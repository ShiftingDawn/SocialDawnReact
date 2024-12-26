import { useEffect, useState } from "react";
import {
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
	Chat as ChatIcon,
	AccountCircle as IconAccountCircle,
	PeopleAlt as PeopleAltIcon,
	Add as IconAdd,
	Close as CloseIcon,
	Check as CheckIcon,
} from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { AddFriendDialog } from "$/AddFriendDialog.tsx";
import { axios, useApi } from "@lib/axios.ts";
import { FriendRequestResponseDTO } from "#/FriendRequestDTO.d.ts";
import { success } from "@lib/notify.ts";
import { Spinner } from "$/Spinner.tsx";
import { post, useEvent } from "@lib/event.ts";

function HomePage() {
	return (
		<Grid2 container spacing={2} sx={{ px: { xs: 0, md: 1 }, height: "100%" }}>
			<Grid2 size={{ xs: 12, sm: 3 }} component={Paper}>
				<Sidebar />
			</Grid2>
			<Grid2 size={{ xs: 12, sm: 9 }} component={Paper}>
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
	const [currenTab, setCurrenTab] = useState<"dm" | "online" | "all" | "pending">("dm");
	return (
		<TabContext value={currenTab}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<TabList onChange={(_, newTab) => setCurrenTab(newTab)} aria-label="Chat list types">
					<StyledTab value={"dm"} aria-label={"chats"} label={"Chats"} icon={<ChatIcon />} />
					<StyledTab value={"online"} aria-label="online friends" label={"Online"}
							   icon={<IconAccountCircle />} />
					<StyledTab value={"all"} aria-label="all friends" label={"Friends"} icon={<PeopleAltIcon />} />
					<StyledTab value={"pending"} aria-label="pending friend requests" label={"Requests"}
							   icon={<IconAdd />} />
				</TabList>
			</Box>
			{currenTab === "pending" && <TabContentPending />}
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
					<Pagination count={Math.ceil(data.length / 10)} page={page}
								onChange={(_, newPage) => setPage(newPage)} />
				</Box>
			)}
			{loading ? (
				<Box display={"flex"} gap={1} alignItems={"center"}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : items.length === 0 ? (
				<span>No requests</span>
			) : items.map(item => (
				<Box key={item.id} p={1} display={"flex"} justifyContent={"space-between"}>
					<Box>
						<Typography variant={"body1"} component={"h3"}>{item.username}</Typography>
						<Typography variant={"body2"} component={"span"}>Sent
							at <time dateTime={new Date(item.sentAt).toISOString()}>
								{new Date(item.sentAt).toLocaleDateString()}
							</time>
						</Typography>
					</Box>
					<Box display={"flex"} alignItems={"center"}>
						{type === "received" && (
							<IconButton color={"success"} aria-label={"accept friend request"}
										onClick={() => handleAccept(item.id)}>
								<CheckIcon />
							</IconButton>
						)}
						<IconButton color={"error"} aria-label={"delete friend request"}
									onClick={() => handleDelete(item.id)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>
			))}
			{data && data.length > 10 && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Pagination count={Math.ceil(data.length / 10)} page={page}
								onChange={(_, newPage) => setPage(newPage)} />
				</Box>
			)}
		</Stack>
	);
}