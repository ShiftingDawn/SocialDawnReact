import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { Socket, io } from "socket.io-client";
import { getApiBaseUrl } from "@lib/api.ts";
import { SocketProvider } from "@lib/socket.context.ts";
import { Spinner } from "$/Spinner.tsx";

export default function ({ children }: PC) {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const socket = io(getApiBaseUrl(), {
			autoConnect: false,
			transports: ["polling"],
			withCredentials: true,
			retries: 10,
		});
		socket.connect();
		setSocket(socket);
		return () => {
			socket.disconnect();
			setSocket(null);
		};
	}, []);

	return (
		<>
			<SocketProvider value={socket}>{children}</SocketProvider>
			{socket && !socket.active && (
				<Paper
					sx={{
						width: 48,
						height: 48,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "fixed",
						zIndex: 10000,
						bottom: 5,
						right: 5,
					}}
				>
					<Spinner size={32} />
				</Paper>
			)}
		</>
	);
}
