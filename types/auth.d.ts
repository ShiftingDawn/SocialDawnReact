declare interface ClientSession {
	username: string;
	thumbnail: string;
	email: string;
}

declare type SessionContextValue =
	| { state: "loading" | "unauthenticated"; session: null; update: SessionFetchFunction }
	| { state: "authenticated"; session: ClientSession; update: SessionFetchFunction };

declare type SessionFetchReason = "timer" | "signin" | "signout" | "force";

declare type SessionFetchFunction = (reason: SessionFetchReason) => Promise<void>;

declare interface InternalClientSessionStore {
	lastUpdate: number;
	session: ClientSession | null | undefined;
	fetchSession: SessionFetchFunction;
}