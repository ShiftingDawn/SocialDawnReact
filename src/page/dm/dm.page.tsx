import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Avatar, Box, Fab, IconButton, Input, Typography, Zoom } from "@mui/material";
import { Add as AddIcon, ArrowDownward, EmojiEmotions as EmojiIcon, Send as SendIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { apollo } from "@lib/api.ts";
import { Emoji, EmojiPicker } from "$/EmojiPicker.tsx";
import { RenderedText } from "$/RenderedText.tsx";
import { Spinner } from "$/Spinner.tsx";
import { Time } from "$/Time.tsx";
import { QUERY_GET_DM, QUERY_GET_DM_MESSAGES } from "#/queries.ts";
import { DmDTO, DmMessageDTO, FriendDTO } from "#/schema.ts";

function PageDM() {
	const { friendId } = useParams();
	const { data } = useQuery<{ friend: FriendDTO; dm: DmDTO }>(QUERY_GET_DM, {
		variables: { friendId },
	});

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
					<MessageList friendId={data.friend.id} />
					<Chatbar friendId={data.friend.id} />
				</>
			)}
		</Box>
	);
}

export default PageDM;

function Chatbar({ friendId }: { friendId: string }) {
	const textFieldRef = useRef<HTMLInputElement | null>(null);
	const [text, setText] = useState<string>("");
	const [emojiPickerAnchor, setEmojiPickerAnchor] = useState<HTMLButtonElement | null>(null);
	const stomp = useStompClient();

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!stomp || text.trim().length === 0) {
			return;
		}
		stomp.publish({
			destination: `/app/dm/${friendId}`,
			body: text.trim(),
		});
		setText("");
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
			<Box sx={{ display: "flex", gap: 1, p: 1 }}>
				<Box
					sx={[
						{ flex: "0 0", backgroundColor: "grey.200", display: "flex", borderRadius: "40px" },
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
						{ flex: "1 0", backgroundColor: "grey.200", borderRadius: "40px", overflow: "hidden", px: 2 },
						(theme) => theme.applyStyles("dark", { backgroundColor: "grey.800" }),
					]}
				>
					<Input
						fullWidth
						size={"medium"}
						sx={{ height: "100%" }}
						inputRef={textFieldRef}
						value={text}
						onChange={(e) => setText(e.currentTarget.value)}
						disableUnderline
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

function MessageList({ friendId }: { friendId: string }) {
	const [messages, setMessages] = useState<DmMessageDTO[]>([]);
	const [scrollAtBottom, setScrollAtBottom] = useState(true);
	const containerRef = useRef<HTMLOListElement | null>(null);

	useSubscription(`/dm/${friendId}`, (msg) => {
		const parsed = JSON.parse(msg.body) as DmMessageDTO;
		addMessages([parsed], true);
	});

	function addMessages(messages: DmMessageDTO[], prepend: boolean = false) {
		if (prepend) {
			setMessages((current) => {
				return [...messages.filter((msg) => !current.find((v) => v.id === msg.id)), ...current];
			});
		} else {
			setMessages((current) => {
				return [...current, ...messages.filter((msg) => !current.find((v) => v.id === msg.id))];
			});
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
			.query<{ dm: DmDTO }, { friendId: string; last: string | null; take: number }>({
				query: QUERY_GET_DM_MESSAGES,
				variables: {
					friendId,
					last: messages.length === 0 ? null : messages[messages.length - 1].id,
					take: 50,
				},
			})
			.then((data) => {
				addMessages(data.data.dm.messages);
			});
	}

	useEffect(() => fetchMessages(), []);

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
			<Box sx={{ mr: 2 }}>
				<Avatar src={msg.sender.thumbnail} />
			</Box>
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
