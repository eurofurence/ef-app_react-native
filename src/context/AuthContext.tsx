import { exchangeCodeAsync, refreshAsync, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useState } from "react";

import * as SecureStore from "./SecureStorage";
import { authClientId, authIssuer, authRedirect, authScopes } from "../configuration";
import { useAsyncInterval } from "../hooks/util/useAsyncInterval";

/**
 * Discovery entries.
 */
const discovery = {
    authorizationEndpoint: `${authIssuer}/oauth2/auth`,
    tokenEndpoint: `${authIssuer}/oauth2/token`,
    userInfoEndpoint: `${authIssuer}/api/v1/userinfo`,
    revocationEndpoint: `${authIssuer}/oauth2/revoke`,
};

/**
 * Redirect url.
 */
const redirectUri = authRedirect;

/**
 * Token refresh interval.
 */
const refreshInterval = 600_000;

/**
 * User claims record.
 */
export type Claims = Record<string, string | string[]>;

/**
 * Type of the auth context.
 */
export type AuthContextType = {
    /**
     * Performs a remote login and maintains the state. May throw.
     */
    login(): Promise<void>;

    /**
     * Performs a remote logout and maintains the state. May throw.
     */
    logout(): Promise<void>;

    /**
     * True if logged in.
     */
    loggedIn: boolean;

    /**
     * The user claims if logged in and successfully retrieved.
     */
    user: Claims | null;
};

/**
 * Auth context.
 */
export const AuthContext = createContext<AuthContextType>({
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loggedIn: false,
    user: null,
});

/**
 * Gets the currently assigned auth token.
 */
export const getAccessToken = () => SecureStore.getItemAsync("accessToken");

/**
 * Thrown by fetch methods.
 */
class EndpointError extends Error {}

/**
 * Fetches the user info from the user info endpoint.
 * @param accessToken The current access token.
 */
const fetchUserInfo = async (accessToken: string) => {
    const response = await fetch(discovery.userInfoEndpoint, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        redirect: "manual",
    });

    // Must be OK.
    if (!response.ok) {
        throw new EndpointError(`Invalid response status: ${response.status} ${response.statusText}`);
    }
    // Must be JSON.
    const contentType = response.headers.get("Content-type");
    if (contentType !== "application/json") {
        throw new EndpointError(`Invalid response content type: ${contentType}`);
    }
    // Parse JSON for result.
    return await response.json();
};

/**
 * Posts token revocation.
 * @param token The token.
 * @param type The type of the token.
 */
const fetchRevokeToken = async (token: string, type: "access_token" | "refresh_token") => {
    const response = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        redirect: "manual",
        body: new URLSearchParams({
            token,
            client_id: authClientId,
            token_type_hint: type,
        }),
    });
    // Must be OK.
    if (!response.ok) {
        throw new EndpointError(`Invalid response status: ${response.status} ${response.statusText}`);
    }
};

// Link browser closing.
WebBrowser.maybeCompleteAuthSession();

/**
 * Provides and maintains auth state.
 * @param children
 * @constructor
 */
export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
    // Current user.
    const [user, setUser] = useState<Claims | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    // Auth request and login prompt.
    const [request, , promptAsync] = useAuthRequest(
        {
            clientId: authClientId,
            scopes: authScopes,
            redirectUri,
        },
        discovery,
    );

    // Login method.
    const login = useCallback(async () => {
        // Code exchange part.
        try {
            const codeResponse = await promptAsync();

            if (!(request && codeResponse?.type === "success")) return;

            const response = await exchangeCodeAsync(
                {
                    clientId: authClientId,
                    code: codeResponse.params.code,
                    extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
                    redirectUri,
                },
                discovery,
            );

            await SecureStore.setItemToAsync("accessToken", response.accessToken);
            await SecureStore.setItemToAsync("refreshToken", response.refreshToken);
            setLoggedIn(true);
        } catch (error) {
            // Delete access and refresh, then rethrow.
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            setLoggedIn(false);
            setUser(null);
            throw error;
        }

        // User update part, if invalid tokens are detected here, data is properly reset.
        try {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (accessToken) {
                const user = await fetchUserInfo(accessToken);
                setUser(user);
                setLoggedIn(true);
            } else {
                setUser(null);
                setLoggedIn(false);
            }
        } catch (error) {
            // Delete access and refresh, then rethrow.
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            setLoggedIn(false);
            setUser(null);
            throw error;
        }
    }, [promptAsync, request, discovery]);

    // Logout method.
    const logout = useCallback(async () => {
        try {
            // Get tokens and delete from store.
            const accessToken = await SecureStore.getItemAsync("accessToken");
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");

            // Revoke all present tokens.
            let accessTokenTask;
            let refreshTokenTask;
            if (accessToken) accessTokenTask = fetchRevokeToken(accessToken, "access_token");
            if (refreshToken) refreshTokenTask = fetchRevokeToken(refreshToken, "refresh_token");
            await Promise.all([accessTokenTask, refreshTokenTask]);
        } finally {
            setLoggedIn(false);
            setUser(null);
        }
    }, [discovery]);

    // Refresh connection.
    useAsyncInterval(
        async () => {
            console.log("INVOKING REFRESH");
            // Refresh token part.
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (refreshToken) {
                    // Refresh it.
                    const response = await refreshAsync(
                        {
                            clientId: authClientId,
                            scopes: authScopes,
                            refreshToken,
                        },
                        discovery,
                    );

                    await SecureStore.setItemToAsync("accessToken", response.accessToken);
                    await SecureStore.setItemToAsync("refreshToken", response.refreshToken ?? refreshToken);
                    setLoggedIn(true);
                }
            } catch (error) {
                // Delete access and refresh, then rethrow.
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                setLoggedIn(false);
                setUser(null);
                throw error;
            }

            // User update part, if invalid tokens are detected here, data is properly reset.
            try {
                const accessToken = await SecureStore.getItemAsync("accessToken");
                if (accessToken) {
                    const user = await fetchUserInfo(accessToken);
                    setUser(user);
                    setLoggedIn(true);
                } else {
                    setUser(null);
                    setLoggedIn(false);
                }
            } catch (error) {
                // Delete access and refresh, then rethrow.
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                setLoggedIn(false);
                setUser(null);
                throw error;
            }
        },
        [],
        refreshInterval,
    );

    return <AuthContext.Provider value={{ login, logout, loggedIn, user }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
