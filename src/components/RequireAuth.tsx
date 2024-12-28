import { useUser } from "@sys/User.tsx";
import { PropsWithChildren } from "react";

export function RequireAuth({ children }: PropsWithChildren) {
	const { token } = useUser();

	return token ? children : null;
}