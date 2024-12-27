import { PropsWithChildren, useEffect, useState } from "react";
import { SocketProvider } from "@lib/socket.ts";
import { Paper } from "@mui/material";
import { Spinner } from "$/Spinner.tsx";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { useUser } from "@sys/User.tsx";
import { getApiBaseUrl } from "@lib/axios.ts";

function SocketHandler({ children }: PropsWithChildren) {
	const { token } = useUser();
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (token) {
			const options: Partial<ManagerOptions & SocketOptions> = {
				autoConnect: false,
				transports: ["polling"],
				withCredentials: true,
			};
			if (token) {
				options.extraHeaders = { Authorization: `Bearer ${token}` };
			}
			const socket = io(getApiBaseUrl(), options);
			socket.connect();
			setSocket(socket);
		} else if (socket) {
			socket.disconnect();
			setSocket(null);
		}
	}, [token]);

	return (
			<>
				<SocketProvider value={socket}>
					{children}
				</SocketProvider>
				{socket && !socket.active && (<Paper sx={{
					width: 48,
					height: 48,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "fixed",
					zIndex: 10000,
					bottom: 5,
					right: 5,
				}}>
					<Spinner size={32} />
				</Paper>)}
			</>
	);
}

export default SocketHandler;