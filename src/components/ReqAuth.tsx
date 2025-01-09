import { useSession } from "@lib/session.context.ts";

export function ReqAuth({ children }: PC) {
	const { state } = useSession();
	return state === "authenticated" ? children : null;
}
