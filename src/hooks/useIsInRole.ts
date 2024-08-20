import { useAuthContext } from "../context/AuthContext";

/**
 * True if the user is logged in and in that role.
 * @param role The required role.
 */
export const useIsInRole = (role: string) => {
    const { loggedIn, user } = useAuthContext();
    return loggedIn && user?.Roles?.includes(role);
};

/**
 * True if the user is logged in and in any of the provided role.
 * @param roles All possible roles.
 */
export const useIsInAnyRole = (...roles: string[]) => {
    const { loggedIn, user } = useAuthContext();
    return loggedIn && user?.Roles && Boolean(roles.find((role) => user.Roles.includes(role)));
};
