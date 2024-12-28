import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { axios, useApi } from "@lib/axios.ts";
import { post, useEvent } from "@lib/event.ts";
import { FriendRequestCountDTO, FriendRequestResponseDTO } from "#/FriendRequestDTO";
import { fSuccess } from "@lib/flash.ts";
import { Spinner } from "$/Spinner.tsx";
import { useEffect } from "react";

interface PendingRequestsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	count: FriendRequestCountDTO;
}

export function PendingRequestsDialog({ open, setOpen, count }: PendingRequestsDialogProps) {
	useEffect(() => {
		if (count.sent === 0 && count.received === 0) {
			setOpen(false);
		}
	}, [count.sent, count.received]);

	return (
		<Dialog open={open} fullWidth maxWidth={"xs"} onClose={() => setOpen(false)}>
			<DialogTitle>Pending requests</DialogTitle>
			<DialogContent>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} disabled={count.received === 0}>
						Received friend requests
					</AccordionSummary>
					<AccordionDetails>
						<FriendRequestList type={"received"} />
					</AccordionDetails>
				</Accordion>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} disabled={count.sent === 0}>
						Sent friend requests
					</AccordionSummary>
					<AccordionDetails>
						<FriendRequestList type={"sent"} />
					</AccordionDetails>
				</Accordion>
			</DialogContent>
		</Dialog>
	);
}

function FriendRequestList({ type }: { type: "sent" | "received" }) {
	const [{ data, loading }, refetch] = useApi<FriendRequestResponseDTO[]>("/friend/request/" + type);

	useEvent("friend_request_update", () => refetch());

	function handleDelete(id: string) {
		axios.delete(`/friend/request/${type}/${id}`).then(() => {
			refetch().then(() => {
				post("friend_request_update");
				fSuccess("Friend request deleted successfully.");
			});
		});
	}

	function handleAccept(id: string) {
		if (type !== "received") return;
		axios.post(`/friend/request/received/${id}`).then(() => {
			refetch().then(() => {
				post("friend_request_update");
				fSuccess("Friend request accepted.");
			});
		});
	}

	return (
		<Stack spacing={2}>
			{loading ? (
				<Box display={"flex"} gap={1} alignItems={"center"}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : data?.map((item) => (
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
			))}
		</Stack>
	);
}