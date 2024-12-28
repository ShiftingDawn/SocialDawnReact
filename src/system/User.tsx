import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { UserProfileDTO } from "#/UserProfileDTO";
import { LoginResponseDTO } from "#/LoginDTO";
import { axios } from "@lib/axios.ts";
import BootScreen from "@sys/BootScreen.tsx";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { fErr } from "@lib/flash.ts";

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

function UserWrapper({ children }: PropsWithChildren) {
	const [data, setData] = useState<UserContextType>(defaultContextValue);

	function update(data: Partial<UserContextType>) {
		setData(current => ({ ...current, ...data }));
	}

	const fetchToken = useCallback(async () => {
		const tokenResponse = await axios.post<LoginResponseDTO>("/auth/refresh");
		update({ loading: true, token: tokenResponse.data.accessToken });
		return tokenResponse.data.accessToken;
	}, []);

	function fetchProfile(token: string) {
		axios.get<UserProfileDTO>("/user/profile", { headers: { Authorization: `Bearer ${token}` } }).then(profileResponse => {
			update({ loading: false, ...profileResponse.data });
		});
	}

	function handleSignOut() {
		axios.post("/auth/destroy").then(() => {
			setData({ token: null, loading: false });
			window.location.assign("/");
		}).catch(() => fErr("Could not sign out"));
	}

	useEffect(() => {
		fetchToken().then(fetchProfile).catch(error => {
			if (error?.status === 401 && error?.config?.url === "/auth/refresh") {
				setData({ token: null, loading: false });
			}
			if (error?.code === "ERR_NETWORK") {
				setData({ token: null, loading: false });
				fErr("Could not connect to server");
			}
		});
		createAuthRefreshInterceptor(axios, async function(failedRequest) {
			const token = await fetchToken();
			failedRequest.response.config.headers["Authorization"] = `Bearer ${token}`;
			return await Promise.resolve();
		}, {
			shouldRefresh: (error) => error.status === 401 && error.config?.url !== "/auth/refresh",
		});
	}, [fetchToken]);

	useEffect(() => {
		const interceptor = axios.interceptors.request.use((request) => {
			if (data.token) {
				request.headers["Authorization"] = `Bearer ${data.token}`;
			}
			return request;
		});
		return () => {
			axios.interceptors.request.eject(interceptor);
		};
	}, [data.token]);

	return data.loading ? <BootScreen /> : (
		<AuthContext.Provider value={{
			signIn: (token) => {
				update({ token, loading: false });
				fetchProfile(token);
			},
			signOut: () => handleSignOut(),
		}}>
			<UserContext.Provider value={data}>
				{children}
			</UserContext.Provider>
		</AuthContext.Provider>
	);
}

export default UserWrapper;