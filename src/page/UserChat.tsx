import { useParams } from "react-router";
import { useApi } from "@lib/axios.ts";
import * as React from "react";
import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Spinner } from "$/Spinner.tsx";
import { DmDTO } from "#/DmDTO";
import { DmMessageDTO } from "#/DmMessageDTO.ts";
import { Time } from "$/Time.tsx";
import { useSocket } from "@lib/socket.ts";

function UserChatPage() {
	const { userId } = useParams();
	const [{ data }] = useApi<DmDTO>(`/dm/friend/${userId}`);

	// useEffect(() => {
	// 	if (data) {
	// 		axios.get(`/dm/messages/${data.dmId}`).then((res) => setMessages(res.data));
	// 	}
	// }, [data]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "stretch",
				height: "100%",
				maxHeight: "100%",
				overflow: "hidden",
			}}>
			{!data ? (
				<Spinner />
			) : (
				<>
					<MessageList dm={data.dmId} />
					<Box
						sx={{
							flex: "0 0",
							display: "flex",
							alignItems: "center",
							justifyContent: "stretch",
							px: 2,
							pt: 1,
						}}>
						<Chatbar dm={data.dmId} />
					</Box>
				</>
			)}
		</Box>
	);
}

export default UserChatPage;

function Chatbar({ dm }: { dm: string }) {
	const socket = useSocket();

	useEffect(() => {
		if (socket) {
			socket.on("dm", a => console.log("test", a));
			socket.emit("dm", "test", console.log);
		}
	}, [socket]);

	return <TextField fullWidth variant={"standard"} />;
}

function MessageList({ dm }: { dm: string }) {
	const [messages, setMessages] = useState<DmMessageDTO[]>([]);

	function handleScroll(event: React.UIEvent) {
		const list = event.target as HTMLOListElement;
		const scrollY = Math.ceil(-list.scrollTop + list.clientHeight);
		if (scrollY >= list.scrollHeight * 0.85) {
			console.log("scroll");
			//TODO fetch more
		}
	}

	return (
		<Box
			sx={{
				flex: "1 0",
				height: "100%",
				maxHeight: "100%",
				overflow: "auto",
				display: "flex",
				flexDirection: "column-reverse",
				gap: 2,
			}}
			onScroll={handleScroll}
			component={"ol"}
			role={"list"}>
			{!messages ? <Spinner /> : messages.map((msg) => <Message key={msg.messageId} msg={msg} />)}
		</Box>
	);
}

function Message({ msg }: { msg: DmMessageDTO }) {
	return (
		<Box key={msg.messageId} sx={{ display: "flex", flexDirection: "column" }} component={"li"}>
			<Typography variant={"body2"} component={"h3"} sx={{ display: "flex", gap: 1 }}>
				<strong>{msg.username}</strong>
				<Time value={msg.sendAt} />
			</Typography>
			<Typography variant={"body1"} sx={{ ml: 1 }} component={"div"}>
				{msg.message}
			</Typography>
		</Box>
	);
}
