import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { gql } from "@apollo/client";
import Axios from "axios";
import { apollo } from "@lib/api.ts";
import { SessionContext } from "@lib/session.context.ts";
import { Spinner } from "$/Spinner.tsx";
import { SelfUserDTO } from "#/schema.ts";

const QUERY = gql`
	{
		self {
			username
			thumbnail
			email
		}
	}
`;

export default function ({ children }: PC) {
	const [session, setSession] = useState<ClientSession | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		InternalSessionStore.fetchSession = async (reason) => {
			async function realFetch() {
				InternalSessionStore.lastUpdate = Math.floor(Date.now() / 1000);
				const result = await apollo.query<{ self: SelfUserDTO }>({ query: QUERY });
				InternalSessionStore.session = {
					username: result.data.self.username,
					thumbnail: result.data.self.thumbnail,
					email: result.data.self.email,
				};
				setSession(InternalSessionStore.session);
			}

			try {
				if (InternalSessionStore.session === undefined) {
					await realFetch();
				}
				switch (reason) {
					case "force":
						await realFetch();
						break;
					case "timer":
						await realFetch();
						break;
					case "signin":
						setLoading(true);
						await realFetch();
						break;
					case "signout":
					case "destroy":
						if (InternalSessionStore.session !== null) {
							if (reason === "signout") {
								await Axios.post("/auth/destroy");
							}
							setSession(null);
							InternalSessionStore.session = null;
							InternalSessionStore.lastUpdate = Math.floor(Date.now() / 1000);
						}
						break;
				}
			} finally {
				setLoading(false);
			}
		};
		InternalSessionStore.fetchSession("timer");

		const interval = setInterval(() => {
			if (InternalSessionStore.fetchSession) {
				InternalSessionStore.fetchSession("timer");
			}
		}, 1000 * 300); //Every 5 minutes

		return () => {
			clearInterval(interval);
			InternalSessionStore.lastUpdate = 0;
			InternalSessionStore.session = undefined;
			InternalSessionStore.fetchSession = async () => {};
		};
	}, []);

	const sessionContextValue = useMemo<SessionContextValue>(
		() =>
			({
				session,
				state: session ? "authenticated" : loading ? "loading" : "unauthenticated",
				update: InternalSessionStore.fetchSession,
			}) as SessionContextValue,
		[loading, session],
	);

	return loading ? (
		<BootLoadingScreen />
	) : (
		<SessionContext.Provider value={sessionContextValue}>{children}</SessionContext.Provider>
	);
}
const InternalSessionStore: InternalClientSessionStore = {
	lastUpdate: 0,
	session: undefined,
	async fetchSession() {},
};

function BootLoadingScreen() {
	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			gap={2}
			alignItems={"center"}
			justifyContent={"center"}
			height={"100%"}
		>
			<Spinner size={128} lineSize={8} />
			<Typography component={"h1"} variant={"h4"}>
				Loading
			</Typography>
		</Box>
	);
}
