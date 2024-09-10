import { exchangeCodeAsync, refreshAsync, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

import { apiBase, authClientId, authIssuer, authRedirect, authScopes } from "../configuration";
import { useAsyncInterval } from "../hooks/util/useAsyncInterval";
import { UserRecord } from "../store/eurofurence/types";
import * as SecureStore from "./SecureStorage";

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
     * Updates the claims and user data. User data is for now coupled with
     * the token, but user info might change.
     */
    update(): Promise<void>;

    /**
     * Updates the token if a refresh token is present. Reloads user claims and info from the IDP and backend.
     */
    refresh(): Promise<void>;

    /**
     * True if logged in.
     */
    loggedIn: boolean;

    /**
     * The user claims if logged in and successfully retrieved.
     */
    claims: Claims | null;

    /**
     * The user self-service info if logged in and successfully retrieved.
     */
    user: UserRecord | null;
};

/**
 * Auth context.
 */
export const AuthContext = createContext<AuthContextType>({
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    update: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    loggedIn: false,
    claims: null,
    user: null,
});

/**
 * Gets the currently assigned auth token.
 */
export const getAccessToken = () => SecureStore.getItemAsync("accessToken");

/**
 * Thrown by fetch methods.
 */
class EndpointError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message?: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * True if the type is a JSON mime type or JSON mime type with extra K-V pairs.
 * @param type
 */
const isJsonMimeType = (type: string | null) => {
    return type?.includes("application/json");
};

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
        throw new EndpointError(response.status, `Invalid response status: ${response.status} ${response.statusText}`);
    }
    // Must be JSON.
    const contentType = response.headers.get("Content-type");
    if (!isJsonMimeType(contentType)) {
        throw new EndpointError(response.status, `Invalid response content type: ${contentType}`);
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
        throw new EndpointError(response.status, `Invalid response status: ${response.status} ${response.statusText}`);
    }
};

/**
 * Fetches the user data from the API server.
 * @param accessToken The current access token.
 */
const fetchUserSelf = async (accessToken: string) => {
    const response = await fetch(`${apiBase}/Users/:self`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        redirect: "manual",
    });

    // Must be OK.
    if (!response.ok) {
        throw new EndpointError(response.status, `Invalid response status: ${response.status} ${response.statusText}`);
    }
    // Must be JSON.
    const contentType = response.headers.get("Content-type");
    if (!isJsonMimeType(contentType)) {
        throw new EndpointError(response.status, `Invalid response content type: ${contentType}`);
    }
    // Parse JSON for result.
    return await response.json();
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
    const [claims, setClaims] = useState<Claims | null>(null);
    const [user, setUser] = useState<UserRecord | null>(null);
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

    // For an existing access token, fetches and applies user claims and settings.
    const update = useCallback(async () => {
        try {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (accessToken) {
                const claimsPromise = fetchUserInfo(accessToken);
                const userPromise = fetchUserSelf(accessToken);
                const claims = await claimsPromise;
                const user = await userPromise;
                setClaims(claims);
                setUser(user);
                setLoggedIn(true);
            } else {
                setClaims(null);
                setUser(null);
                setLoggedIn(false);
            }
        } catch (error) {
            // Delete access and refresh if actual authorization error, then rethrow.
            if (error instanceof EndpointError && (error.statusCode === 401 || error.statusCode === 403)) {
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                setLoggedIn(false);
                setClaims(null);
                setUser(null);
            }
            throw error;
        }
    }, []);

    // Login method.
    const login = useCallback(async () => {
        // Code exchange part.
        try {
            // We set show in "recents" so the web browser doesn't close when
            // you use an MFA method that requires switching apps on android.
            const codeResponse = await promptAsync({ showInRecents: true });

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
            setClaims(null);
            throw error;
        }

        // User update part, if invalid tokens are detected here, data is properly reset.
        await update();
    }, [promptAsync, request, update]);

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
            setClaims(null);
            setUser(null);
        }
    }, []);

    // Reload method.
    const refresh = useCallback(async () => {
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
            setClaims(null);
            setUser(null);
            throw error;
        }

        // User update part, if invalid tokens are detected here, data is properly reset.
        await update();
    }, [update]);

    // Refresh connection.
    useAsyncInterval(refresh, [], refreshInterval);

    // Provide stabilized value.
    const value = useMemo(() => {
        return {
            login,
            logout,
            update,
            refresh,
            loggedIn,
            claims,
            user,
        };
    }, [claims, loggedIn, login, logout, refresh, update, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
