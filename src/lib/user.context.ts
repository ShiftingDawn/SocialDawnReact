import { UserProfileDTO } from "#/UserProfileDTO";
import { createContext, useContext } from "react";

export type UserContextType = { loading: boolean, token: string | null } & Partial<UserProfileDTO>;

export const DEFAULT_USER_CONTEXT: UserContextType = { loading: true, token: null };

export const UserContext = createContext<UserContextType>(DEFAULT_USER_CONTEXT);

export function useUser() {
	return useContext(UserContext);
}