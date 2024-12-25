import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserProfileDTO } from "#/UserProfileDTO.ts";
import { LoginResponseDTO } from "#/LoginDTO";
import { axios } from "@lib/axios.ts";
import BootScreen from "@sys/BootScreen.tsx";

type UserContextType = { loading: boolean, token: string | null } & Partial<UserProfileDTO>;
const defaultContextValue: UserContextType = { loading: true, token: null };
const UserContext = createContext<UserContextType>(defaultContextValue);

interface AuthContextType {
	signIn: (token: string) => void;
	signOut: () => void;
}

export const useUser = () => useContext(UserContext);
const AuthContext = createContext<AuthContextType>({
	signIn: () => {
	}, signOut: () => {
	},
});
export const useAuth = () => useContext(AuthContext);

function setCachedAuthState(state: boolean) {
	if (state) {
		localStorage.setItem("wasauthenticated", "true");
	} else {
		localStorage.removeItem("wasauthenticated");
	}
}

function UserWrapper({ children }: PropsWithChildren) {
	const [data, setData] = useState<UserContextType>(defaultContextValue);

	function handleToken(token: string | null) {
		setData({ token, loading: !!token });
		setCachedAuthState(!!token);
	}

	useEffect(() => {
		if (localStorage.getItem("wasauthenticated")) {
			axios.post<LoginResponseDTO>("/auth/refresh").then(async tokenResponse => {
				setData({ loading: true, token: tokenResponse.data.accessToken });
				setCachedAuthState(true);
			}).catch(() => {
				setData({ loading: false, token: null });
				setCachedAuthState(false);
			});
		} else {
			setData({ loading: false, token: null });
		}
	}, []);

	useEffect(() => {
		if (data.token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
			axios.get<UserProfileDTO>("/user/profile").then(profileResponse => {
				setData({ loading: false, token: data.token, ...profileResponse.data });
			});
		} else {
			delete axios.defaults.headers.common["Authorization"];
		}
	}, [data.token]);
	return data.loading ? <BootScreen/> : (
		<AuthContext.Provider value={{
			signIn: handleToken,
			signOut: () => handleToken(null),
		}}>
			<UserContext.Provider value={data}>
				{children}
			</UserContext.Provider>
		</AuthContext.Provider>
	);
}

export default UserWrapper;