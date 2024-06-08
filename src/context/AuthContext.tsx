import { exchangeCodeAsync, refreshAsync, makeRedirectUri, useAutoDiscovery, useAuthRequest } from "expo-auth-session";
import * as Linking from "expo-linking";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

import * as SecureStore from "./SecureStorage";
import { authClientId, authIssuer, authScheme, authScopes } from "../configuration";
import { useAppDispatch, useAppSelector } from "../store";
import { setAccessToken as setAccessTokenAction } from "../store/authorization.slice";

const refreshInterval = 600_000;

export type Claims = Record<string, string | string[]>;
export type AuthContextType = {
    login(): Promise<void>;
    logout(): Promise<void>;
    loggedIn: boolean;
    user: Claims | null;
    accessToken: string | null;
};

export const AuthContext = createContext<AuthContextType>({
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loggedIn: false,
    user: null,
    accessToken: null,
});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
    // Dispatch is used to send the token to the store.
    const dispatch = useAppDispatch();

    // Endpoint configuration and redirect into app.
    const discovery = useAutoDiscovery(authIssuer);
    const redirectUri = "https://app.eurofurence.org/auth/login";
    //     makeRedirectUri({
    //     scheme: authScheme,
    //     path: "auth", //TODO
    // });

    // Current user.
    const [user, setUser] = useState<Claims | null>(null);

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
    const login = useCallback(
        () =>
            promptAsync().then(async (codeResponse) => {
                // TODO Remove when tested.
                console.log("CODE RESPONSE", codeResponse);

                if (!(request && codeResponse?.type === "success" && discovery)) return;

                const response = await exchangeCodeAsync(
                    {
                        clientId: authClientId,
                        code: codeResponse.params.code,
                        extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
                        redirectUri,
                    },
                    discovery,
                );

                // TODO Remove when tested.
                console.log("CODE EXCHANGED", response);

                // Transmit access.
                if (response.accessToken) await SecureStore.setItemAsync("accessToken", response.accessToken);
                else await SecureStore.deleteItemAsync("accessToken");
                dispatch(setAccessTokenAction(response.accessToken));

                // Transmit refresh.
                if (response.refreshToken) await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                else await SecureStore.deleteItemAsync("refreshToken");
                dispatch(setAccessTokenAction(response.accessToken));
            }),
        [promptAsync, request, discovery, dispatch],
    );

    // Logout method.
    const logout = useCallback(() => {
        // TODO
        return Promise.resolve();
    }, []);

    // Access token via indirection, this way it is sync with all useAppSelectors within the app.
    const accessToken = useAppSelector((state) => state.authorization.accessToken);

    // Checks if there's an access token currently present. TODO: Verify
    const loggedIn = Boolean(accessToken);

    // Refresh connection.
    useEffect(() => {
        let go = true;

        async function retrieveAndRefresh() {
            // Discovery is needed.
            if (!discovery) return;

            // Try to get token.
            const refreshToken = await SecureStore.getItemAsync("refreshToken").catch((error) => {
                console.error("Error retrieving secure storage item", error);
                return null;
            });

            // No token, therefore not actionable.
            if (!refreshToken) return;

            try {
                // Refresh it.
                const response = await refreshAsync(
                    {
                        clientId: authClientId,
                        refreshToken,
                    },
                    discovery,
                );

                // Stop if propagation cancelled.
                if (!go) return;

                // Transmit access.
                if (response.accessToken) await SecureStore.setItemAsync("accessToken", response.accessToken);
                else await SecureStore.deleteItemAsync("accessToken");
                dispatch(setAccessTokenAction(response.accessToken));

                // Transmit refresh.
                if (response.refreshToken) await SecureStore.setItemAsync("refreshToken", response.refreshToken);
                else await SecureStore.deleteItemAsync("refreshToken");
            } catch (error) {
                // Stop if propagation cancelled.
                if (!go) return;

                // Delete access and refresh.
                console.error("Refresh error", error);
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                dispatch(setAccessTokenAction(null));
            }
        }

        // Initial refresh.
        retrieveAndRefresh().catch();

        let active = false;
        setInterval(() => {
            if (active) return;
            active = true;
            retrieveAndRefresh()
                .catch()
                .finally(() => {
                    active = false;
                });
        }, refreshInterval);

        // Stop propagation.
        return () => {
            go = false;
        };
    }, [discovery, dispatch]);

    // Retrieve user on refreshed access token.
    useEffect(() => {
        let go = true;

        async function retrieveUser() {
            // Userinfo and access token needed.
            if (!discovery?.userInfoEndpoint || !accessToken) return;

            try {
                // Get from user info endpoint.
                const response = await fetch(discovery.userInfoEndpoint, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // Stop if propagation cancelled.
                if (!go) return;

                // Transfer.
                const user = await response.json();
                setUser(user);
            } catch (error) {
                // Stop if propagation cancelled.
                if (!go) return;

                // Log error and reset.
                console.error("Userinfo failed", error);
                setUser(null);
            }
        }

        // Initial retrieval. Subsequently done via
        retrieveUser().catch();

        // Stop propagation.
        return () => {
            go = false;
        };
    }, [discovery?.userInfoEndpoint, accessToken]);

    return <AuthContext.Provider value={{ login, logout, loggedIn, user, accessToken }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
