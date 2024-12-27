import { useEffect, useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid2,
	IconButton,
	Pagination,
	Paper,
	Stack,
	styled,
	Tab,
	Typography,
} from "@mui/material";
import {
	AccountCircle as IconAccountCircle,
	Add as IconAdd,
	Chat as ChatIcon,
	Check as CheckIcon,
	Close as CloseIcon,
	PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { AddFriendDialog } from "$/AddFriendDialog.tsx";
import { axios, useApi } from "@lib/axios.ts";
import { FriendRequestResponseDTO } from "#/FriendRequestDTO";
import { success } from "@lib/notify.ts";
import { Spinner } from "$/Spinner.tsx";
import { post, useEvent } from "@lib/event.ts";
import { FriendDTO } from "#/FriendDTO";
import { Outlet, useNavigate } from "react-router";

function HomePage() {
	return (
		<Grid2
			container
			spacing={2}
			sx={{ px: { xs: 0, md: 1 }, height: "100%", maxHeight: "100%", overflow: "hidden" }}>
			<Grid2 size={{ xs: 12, sm: 3 }} component={Paper}>
				<Sidebar />
			</Grid2>
			<Grid2 size={{ xs: 12, sm: 9 }} component={Paper} sx={{ maxHeight: "100%" }}>
				<Outlet />
			</Grid2>
		</Grid2>
	);
}

export default HomePage;

const StyledTab = styled(Tab)(({}) => ({
	minWidth: "1px",
	width: "25%",
	padding: "0 12px",
	textTransform: "unset",
}));

function Sidebar() {
	const [currentTab, setCurrentTab] = useState<"dm" | "online" | "all" | "pending">("dm");
	return (
		<TabContext value={currentTab}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<TabList onChange={(_, newTab) => setCurrentTab(newTab)} aria-label="Chat list types">
					<StyledTab value={"dm"} aria-label={"chats"} label={"Chats"} icon={<ChatIcon />} />
					<StyledTab
						value={"online"}
						aria-label="online friends"
						label={"Online"}
						icon={<IconAccountCircle />}
					/>
					<StyledTab value={"all"} aria-label="all friends" label={"Friends"} icon={<PeopleAltIcon />} />
					<StyledTab
						value={"pending"}
						aria-label="pending friend requests"
						label={"Requests"}
						icon={<IconAdd />}
					/>
				</TabList>
			</Box>
			{currentTab === "all" && <FriendList type={"all"} />}
			{currentTab === "online" && <FriendList type={"online"} />}
			{currentTab === "pending" && <TabContentPending />}
		</TabContext>
	);
}

function TabContentPending() {
	const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
	return (
		<Stack sx={{ p: 1 }} gap={1}>
			<Button onClick={() => setAddFriendModalOpen(true)}>Add friend</Button>
			<Divider />
			<strong>Received requests</strong>
			<FriendRequestList type={"received"} />
			<Divider />
			<strong>Sent requests</strong>
			<FriendRequestList type={"sent"} />
			<AddFriendDialog open={addFriendModalOpen} setOpen={setAddFriendModalOpen} />
		</Stack>
	);
}

function FriendRequestList({ type }: { type: "sent" | "received" }) {
	const [{ data, loading }, refetch] = useApi<FriendRequestResponseDTO[]>("/friend/request/" + type);
	const [page, setPage] = useState<number>(1);
	const [items, setItems] = useState<FriendRequestResponseDTO[]>([]);

	useEvent("friend_request_update", () => refetch());

	useEffect(() => {
		if (!data) setItems([]);
		else if (data.length <= 10) setItems(data);
		else setItems(data.slice((page - 1) * 10, page * 10));
	}, [data, page]);

	function handleDelete(id: string) {
		setItems(items.filter((item) => item.id !== id));
		axios.delete(`/friend/request/${type}/${id}`).then(() => {
			refetch().then(() => success("Friend request deleted successfully."));
		});
	}

	function handleAccept(id: string) {
		if (type !== "received") return;
		setItems(items.filter((item) => item.id !== id));
		axios.post(`/friend/request/received/${id}`).then(() => {
			refetch().then(() => {
				post("friend_request_update");
				success("Friend request accepted.");
			});
		});
	}

	return (
		<Stack spacing={2}>
			{data && data.length > 10 && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Pagination
						count={Math.ceil(data.length / 10)}
						page={page}
						onChange={(_, newPage) => setPage(newPage)}
					/>
				</Box>
			)}
			{loading ? (
				<Box display={"flex"} gap={1} alignItems={"center"}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : items.length === 0 ? (
				<span>No requests</span>
			) : (
				items.map((item) => (
					<Box key={item.id} p={1} display={"flex"} justifyContent={"space-between"}>
						<Box>
							<Typography variant={"body1"} component={"h3"}>
								{item.username}
							</Typography>
							<Typography variant={"body2"} component={"span"}>
								Sent at{" "}
								<time dateTime={new Date(item.sentAt).toISOString()}>
									{new Date(item.sentAt).toLocaleDateString()}
								</time>
							</Typography>
						</Box>
						<Box display={"flex"} alignItems={"center"}>
							{type === "received" && (
								<IconButton
									color={"success"}
									aria-label={"accept friend request"}
									onClick={() => handleAccept(item.id)}>
									<CheckIcon />
								</IconButton>
							)}
							<IconButton
								color={"error"}
								aria-label={"delete friend request"}
								onClick={() => handleDelete(item.id)}>
								<CloseIcon />
							</IconButton>
						</Box>
					</Box>
				))
			)}
			{data && data.length > 10 && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Pagination
						count={Math.ceil(data.length / 10)}
						page={page}
						onChange={(_, newPage) => setPage(newPage)}
					/>
				</Box>
			)}
		</Stack>
	);
}

function FriendList({ type }: { type: "all" | "online" }) {
	const [{ data }, refetch] = useApi<FriendDTO[]>(`/friend${type === "all" ? "" : "?online=true"}`);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			refetch().catch(() => {});
		}, 3000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<Stack spacing={2}>
			{data === undefined ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : data.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						pt: 2,
					}}>
					<Typography variant={"h4"} aria-hidden={true}>
						(´•︵•`)
					</Typography>
					{type === "online" && <Typography>No friends are online</Typography>}
					{type === "all" && <Typography>It's lonely here</Typography>}
				</Box>
			) : (
				data.map((friend) => (
					<Box
						key={friend.friendId}
						sx={[
							{
								p: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								transition: "background .1s ease-in-out",
								cursor: "pointer",
								"&:hover": {
									backgroundColor: "rgba(0,0,0,.1)",
								},
							},
							(theme) =>
								theme.applyStyles("dark", {
									"&:hover": {
										backgroundColor: "rgba(255,255,255,.1)",
									},
								}),
						]}
						role={"link"}
						aria-label={"open chat"}
						onClick={() => navigate(`/dm/${friend.friendId}`)}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Avatar aria-hidden={true} src={friend.thumbnail} />
							<Typography variant={"body1"} component={"h3"}>
								{friend.username}
							</Typography>
						</Box>
						<Box></Box>
					</Box>
				))
			)}
		</Stack>
	);
}
