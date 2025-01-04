import { useEffect } from "react";
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
import Axios from "axios";
import { post } from "@lib/event.ts";
import { fSuccess } from "@lib/flash.ts";
import { FriendRequestDTO, FriendRequestListDTO } from "#/schema.ts";

interface PendingRequestsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	requests: FriendRequestListDTO;
}

export function PendingRequestsDialog({ open, setOpen, requests }: PendingRequestsDialogProps) {
	useEffect(() => {
		if (requests.sent.length === 0 && requests.received.length === 0) {
			setOpen(false);
		}
	}, [requests.sent.length, requests.received.length]);

	return (
		<Dialog open={open} fullWidth maxWidth={"xs"} onClose={() => setOpen(false)}>
			<DialogTitle>Pending requests</DialogTitle>
			<DialogContent>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>Received friend requests</AccordionSummary>
					<AccordionDetails>
						<FriendRequestList type={"received"} data={requests.received} />
					</AccordionDetails>
				</Accordion>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>Sent friend requests</AccordionSummary>
					<AccordionDetails>
						<FriendRequestList type={"sent"} data={requests.sent} />
					</AccordionDetails>
				</Accordion>
			</DialogContent>
		</Dialog>
	);
}

function FriendRequestList({ type, data }: { data: FriendRequestDTO[]; type: "sent" | "received" }) {
	function handleDelete(id: string) {
		Axios.delete(`/friend/request/${id}`).then(() => {
			post("friend_request_update");
			fSuccess("Friend request deleted");
		});
	}

	function handleAccept(id: string) {
		if (type !== "received") return;
		Axios.post(`/friend/request/${id}`).then(() => {
			post("friend_request_update");
			fSuccess("Friend request accepted");
		});
	}

	return (
		<Stack spacing={2}>
			{data.map((item) => (
				<Box key={item.id} p={1} display={"flex"} justifyContent={"space-between"}>
					<Box>
						<Typography variant={"body1"} component={"h3"}>
							{item.user.username}
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
								onClick={() => handleAccept(item.id)}
							>
								<CheckIcon />
							</IconButton>
						)}
						<IconButton
							color={"error"}
							aria-label={"delete friend request"}
							onClick={() => handleDelete(item.id)}
						>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>
			))}
		</Stack>
	);
}
