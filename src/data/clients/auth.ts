import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthRequest, refreshAsync, TokenResponse } from "expo-auth-session";
import { authClientId, authIssuer, authRedirect, authScopes } from "@/configuration";
import type { IdData } from "@/context/auth/Auth.idToken";
import { parseIdToken } from "@/data/clients/auth.idToken";
import axios from "axios";
import { isTokenError } from "@/data/clients/auth.errors";
import { captureException } from "@sentry/react-native";
import { useSyncExternalStore } from "react";

export class AuthClient {
  /**
   * Stored token response.
   * @private
   */
  private _tokenResponse: TokenResponse | null = null;

  /**
   * Stored ID data.
   * @private
   */
  private _idData: IdData | null = null;

  /**
   * Handle to the refresh interval.
   * @private
   */
  private refresher: any = null;

  /**
   * Set of listeners.
   * @private
   */
  private listeners = new Set<() => void>();

  constructor() {
    AsyncStorage.getItem("auth-client-persisted-state")
      .then(
        (state) => {
          if (state === null) {
            // State is null, transfer null and notify.
            this._tokenResponse = null;
            this._idData = null;
            this.notify();
          } else {
            try {
              // Try to parse and set and notify.
              const { tokenResponse, idData } = JSON.parse(state);
              this._tokenResponse = tokenResponse;
              this._idData = idData;
              this.notify();
            } catch {
              // Error occurred, set null and notify.
              this._tokenResponse = null;
              this._idData = null;
              this.notify();
            }
          }
        },
        () => {
          // Error occurred while reading, set null and notify.
          this._tokenResponse = null;
          this._idData = null;
          this.notify();
        },
      )
      .finally(() => {
        // Finally, start timer. Lock once.
        let running = false;

        // Start refresh interval.
        this.refresher = setInterval(() => {
          // Already running, skip.
          if (running) return;

          // Mark running and refresh.
          running = true;
          this.refresh(false)
            .catch(captureException)
            .finally(() => {
              running = false;
            });
        }, 600_000);
      });
  }

  /**
   * Token data with access, refresh, ID tokens.
   */
  get tokenResponse() {
    return this._tokenResponse;
  }

  /**
   * Parsed ID data.
   */
  get idData() {
    return this._idData;
  }

  /**
   * Subscribe a listener to changes.
   * @param listener The listener to invoke.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Stops the refresh interval.
   */
  public stop() {
    // Clear if not null, then reset.
    if (this.refresher != null) clearInterval(this.refresher);
    this.refresher = null;
  }

  /**
   * Prompts for login.
   */
  public async login() {
    try {
      // Build request.
      const request = new AuthRequest({
        clientId: authClientId,
        scopes: authScopes,
        redirectUri: authRedirect,
      });

      // Prompt.
      const response = await request.promptAsync(
        {
          authorizationEndpoint: `${authIssuer}/oauth2/auth`,
        },
        { showInRecents: true },
      );

      // If OK, parse response and saave state.
      if (response.type === "success") {
        this._tokenResponse = response.authentication;
        this._idData = response.authentication?.idToken ? parseIdToken(response.authentication.idToken) : null;
        this.notify();
      }
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        this._tokenResponse = null;
        this._idData = null;
        this.notify();
      }
      throw error;
    }
  }

  /**
   * Refreshes the current token.
   * @param force If true, does not check if the token is still considered fresh.
   */
  public async refresh(force?: boolean) {
    try {
      // Get token response. If nothing to revoke, skip.
      if (!this._tokenResponse) return;

      // Nothing to refresh.
      if (!this._tokenResponse.refreshToken) return;
      // Unforced and still fresh.
      if (!(force || !TokenResponse.isTokenFresh(this._tokenResponse, 300))) return;

      // Refresh with the current token.
      const refreshResponse = await refreshAsync(
        {
          clientId: authClientId,
          scopes: authScopes,
          refreshToken: this._tokenResponse.refreshToken,
        },
        {
          tokenEndpoint: `${authIssuer}/oauth2/token`,
        },
      );

      // Update response.
      this._tokenResponse = refreshResponse;
      this._idData = refreshResponse?.idToken ? parseIdToken(refreshResponse.idToken) : null;
      this.notify();
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        this._tokenResponse = null;
        this._idData = null;
        this.notify();
      }
    }
  }

  /**
   * Revokes tokens and resets state.
   */
  public async logout() {
    // Get token response. If nothing to revoke, skip.
    if (!this._tokenResponse) return;

    // Revoke access token.
    if (this._tokenResponse.accessToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._tokenResponse.accessToken,
            client_id: authClientId,
            token_type_hint: "access_token",
          }),
        )
        .catch(captureException);

    // Revoke refresh token.
    if (this._tokenResponse.refreshToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._tokenResponse.refreshToken,
            client_id: authClientId,
            token_type_hint: "refresh_token",
          }),
        )
        .catch(captureException);

    // Clear data.
    this._tokenResponse = null;
    this._idData = null;
    this.notify();
  }

  /**
   * Notify all listeners that the state has changed.
   * @private
   */
  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const authClient = new AuthClient();

export function useAuthState() {
  return useSyncExternalStore(authClient.subscribe, () => ({ tokenResponse: authClient.tokenResponse, idData: authClient.idData }));
}
