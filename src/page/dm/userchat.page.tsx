import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Box, Fab, IconButton, TextField, Typography, Zoom } from "@mui/material";
import { Add as AddIcon, ArrowDownward, EmojiEmotions as EmojiIcon, Send as SendIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { apollo } from "@lib/api.ts";
import { useSocket } from "@lib/socket.context.ts";
import { Emoji, EmojiPicker } from "$/EmojiPicker.tsx";
import { RenderedText } from "$/RenderedText.tsx";
import { Spinner } from "$/Spinner.tsx";
import { Time } from "$/Time.tsx";
import { QUERY_GET_DM, QUERY_GET_DM_MESSAGES } from "#/queries.ts";
import { DmDTO, DmMessageDTO } from "#/schema.ts";

function UserChatPage() {
	const { dmId } = useParams();
	const { data } = useQuery<{ dm: DmDTO }>(QUERY_GET_DM, {
		variables: { dmId },
	});
	const socket = useSocket();

	useEffect(() => {
		if (!data?.dm?.id) return;
		if (socket) {
			socket.emit("dm_connect", { dm: data.dm.id });
			return () => {
				socket.emit("dm_disconnect", { dm: data.dm.id });
			};
		}
	}, [socket, data]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "stretch",
				height: "100%",
				maxHeight: "100%",
				overflow: "hidden",
			}}
		>
			{!data ? (
				<Spinner />
			) : (
				<>
					<MessageList dm={data.dm.id} />
					<Chatbar dm={data.dm.id} />
				</>
			)}
		</Box>
	);
}

export default UserChatPage;

function Chatbar({ dm }: { dm: string }) {
	const socket = useSocket();
	const textFieldRef = useRef<HTMLInputElement | null>(null);
	const [text, setText] = useState<string>("");
	const [emojiPickerAnchor, setEmojiPickerAnchor] = useState<HTMLButtonElement | null>(null);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!socket || text.trim().length === 0) {
			return;
		}
		socket.emit("dm_msg", { dm, msg: text }, () => setText(""));
	}

	function handleEmojiPicked(emoji: Emoji | null) {
		if (emoji && textFieldRef.current) {
			const selStart = textFieldRef.current.selectionStart ?? 0;
			const selEnd = textFieldRef.current.selectionEnd ?? 0;
			const textBefore = textFieldRef.current.value.substring(0, selStart);
			const textAfter = textFieldRef.current.value.substring(selEnd);
			const newText = textBefore + emoji.shortcodes + textAfter;
			setText(newText);
		}
		setEmojiPickerAnchor(null);
	}

	return (
		<form onSubmit={handleSubmit}>
			<Box
				sx={{
					display: "flex",
					gap: 1,
					p: 1,
				}}
			>
				<Box
					sx={[
						{ flex: "0 0", backgroundColor: "grey.200", display: "flex", borderRadius: "20px" },
						(theme) => theme.applyStyles("dark", { backgroundColor: "grey.800" }),
					]}
				>
					<IconButton>
						<AddIcon />
					</IconButton>
					<IconButton aria-label={"open emoji picker"} onClick={(e) => setEmojiPickerAnchor(e.currentTarget)}>
						<EmojiIcon />
					</IconButton>
					<EmojiPicker anchorEl={emojiPickerAnchor} onClose={handleEmojiPicked} />
				</Box>
				<Box
					sx={[
						{ flex: "1 0", backgroundColor: "grey.200", borderRadius: "20px", overflow: "hidden" },
						(theme) => theme.applyStyles("dark", { backgroundColor: "grey.800" }),
					]}
				>
					<TextField
						fullWidth
						variant={"filled"}
						size={"small"}
						hiddenLabel
						sx={{ background: "transparent" }}
						inputRef={textFieldRef}
						value={text}
						onChange={(e) => setText(e.currentTarget.value)}
					/>
				</Box>
				<Box
					sx={[
						{ flex: "0 0", backgroundColor: "grey.200", borderRadius: "20px" },
						(theme) => theme.applyStyles("dark", { backgroundColor: "grey.800" }),
					]}
				>
					<IconButton type={"submit"} aria-label={"send message"}>
						<SendIcon />
					</IconButton>
				</Box>
			</Box>
		</form>
	);
}

function MessageList({ dm }: { dm: string }) {
	const [messages, setMessages] = useState<DmMessageDTO[]>([]);
	const [scrollAtBottom, setScrollAtBottom] = useState(true);
	const containerRef = useRef<HTMLOListElement | null>(null);
	const socket = useSocket();

	function addMessages(messages: DmMessageDTO[], prepend: boolean = false) {
		if (prepend) {
			setMessages((current) => [...messages.filter((msg) => !current.find((v) => v.id === msg.id)), ...current]);
		} else {
			setMessages((current) => [...current, ...messages.filter((msg) => !current.find((v) => v.id === msg.id))]);
		}
	}

	function handleScroll(event: React.UIEvent) {
		const list = event.target as HTMLOListElement;
		const scrollY = Math.ceil(-list.scrollTop + list.clientHeight);
		if (scrollY >= list.scrollHeight * 0.85) {
			fetchMessages();
		}
		if (scrollAtBottom && list.scrollTop !== 0) {
			setScrollAtBottom(false);
		} else if (!scrollAtBottom && list.scrollTop === 0) {
			setScrollAtBottom(true);
		}
	}

	function scrollChatToBottom() {
		if (containerRef.current) {
			containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
		}
	}

	function fetchMessages() {
		apollo
			.query<{ dmMessages: DmMessageDTO[] }, { dmId: string; last: string | null; take: number }>({
				query: QUERY_GET_DM_MESSAGES,
				variables: {
					dmId: dm,
					last: messages.length === 0 ? null : messages[messages.length - 1].id,
					take: 50,
				},
			})
			.then((data) => {
				addMessages(data.data.dmMessages);
			});
	}

	function handleSocketMessage(msg: DmMessageDTO) {
		addMessages([msg], true);
	}

	useEffect(() => fetchMessages(), []);

	useEffect(() => {
		if (socket) {
			const s = socket;
			s.on("message", handleSocketMessage);
			return () => {
				s.off("message", handleSocketMessage);
			};
		}
	}, [socket]);

	return (
		<Box
			ref={containerRef}
			sx={{
				flex: "1 0",
				height: "100%",
				maxHeight: "100%",
				overflow: "auto",
				display: "flex",
				flexDirection: "column-reverse",
				gap: 2,
				px: 2,
				pt: 2,
				m: 0,
			}}
			onScroll={handleScroll}
			component={"ol"}
			role={"list"}
		>
			{!messages ? <Spinner /> : messages.map((msg) => <Message key={msg.id} msg={msg} />)}
			<Zoom unmountOnExit in={!scrollAtBottom}>
				<Fab
					color={"secondary"}
					sx={{
						position: "absolute",
						right: { xs: "50%", sm: "24px" },
						translate: { xs: "50%", sm: "unset" },
					}}
					onClick={scrollChatToBottom}
					aria-label={"scroll chat to present"}
				>
					<ArrowDownward />
				</Fab>
			</Zoom>
		</Box>
	);
}

function Message({ msg }: { msg: DmMessageDTO }) {
	return (
		<Box key={msg.id} sx={{ display: "flex", flexDirection: "row" }} component={"li"}>
			<Box>{/*	TODO user avatar here */}</Box>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<Typography variant={"body2"} component={"h3"} sx={{ display: "flex", gap: 1 }}>
					<strong>{msg.sender.username}</strong>
					<Time value={msg.sentAt} />
				</Typography>
				<Typography variant={"body1"} sx={{ ml: 1 }} component={"div"}>
					<RenderedText>{msg.content}</RenderedText>
				</Typography>
			</Box>
		</Box>
	);
}
