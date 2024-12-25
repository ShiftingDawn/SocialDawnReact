import { Box, Card, Container, Grid2, IconButton, Pagination, Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { SectionTitle } from "$/Text.tsx";
import { axios, useApi } from "@lib/axios.ts";
import { FriendRequestResponseDTO } from "#/FriendRequestDTO.ts";
import { useEffect, useState } from "react";
import { success } from "@lib/notify.ts";

function PageSocialSettings() {
	return (
		<Container>
			<Grid2 container spacing={2}>
				<Grid2 size={{ xs: 12, md: 4 }}>
					<Card>
						<SectionTitle>Social Settings</SectionTitle>
					</Card>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
					<Card>
						<SectionTitle>Sent friend requests</SectionTitle>
						<SentFriendRequests />
					</Card>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
					<Card>
						<SectionTitle>Blocked users</SectionTitle>
					</Card>
				</Grid2>
			</Grid2>
		</Container>
	);
}

export default PageSocialSettings;

function SentFriendRequests() {
	const [{ data }, refetch] = useApi<FriendRequestResponseDTO[]>("/friend/request");
	const [page, setPage] = useState<number>(1);
	const [items, setItems] = useState<FriendRequestResponseDTO[]>([]);

	useEffect(() => {
		if (!data) setItems([]);
		else if (data.length <= 10) setItems(data);
		else setItems(data.slice((page - 1) * 10, page * 10));
	}, [data, page]);

	function handleDelete(id: string) {
		setItems(items.filter((item) => item.id !== id));
		axios.delete(`/friend/request/${id}`).then(() => {
			refetch().then(() => success("Friend request deleted successfully."));
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
			{items.map(item => (
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