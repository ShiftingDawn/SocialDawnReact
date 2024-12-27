import { useParams } from "react-router";
import { useApi } from "@lib/axios.ts";
import * as React from "react";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Spinner } from "$/Spinner.tsx";
import { DmDTO } from "#/DmDTO";
import { DmMessageDTO } from "#/DmMessageDTO.ts";
import { Time } from "$/Time.tsx";

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
						<TextField fullWidth variant={"standard"} />
					</Box>
				</>
			)}
		</Box>
	);
}

export default UserChatPage;

function MessageList({ dm }: { dm: string }) {
	const [messages, setMessages] = useState<DmMessageDTO[]>(makeMsgs());

	function handleScroll(event: React.UIEvent) {
		const list = event.target as HTMLOListElement;
		const scrollY = Math.ceil(-list.scrollTop + list.clientHeight);
		if (scrollY >= list.scrollHeight * 0.85) {
			console.log("scroll");
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

function makeMsgs() {
	const result: DmMessageDTO[] = [];
	for (let i = 0; i < 100; ++i) {
		result.push({
			messageId: "" + i,
			username: "test1",
			responseTo: null,
			sendAt: 1000 - i,
			message:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu felis ante. Etiam volutpat suscipit libero, eget pretium odio euismod ac. Nullam vestibulum dapibus nibh, et maximus lorem sodales sit amet. Phasellus sed dolor cursus, eleifend erat a, facilisis felis. Curabitur eget maximus metus, vitae malesuada mauris. Pellentesque efficitur sit amet risus at porta. Integer molestie ipsum sed augue ornare euismod. Integer ac arcu at quam consequat tincidunt vel a enim. Aliquam leo dui, fermentum sit amet scelerisque at, auctor sodales metus. Morbi luctus nec arcu a congue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla scelerisque mi ipsum, a luctus tortor commodo id. Mauris sit amet magna pellentesque, egestas mi vitae, pulvinar sem. Praesent vel lectus vitae justo gravida facilisis.",
		});
	}
	return result;
}
