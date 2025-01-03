import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useApi } from "@lib/api.ts";
import { post } from "@lib/event.ts";
import { Caption } from "$/Text.tsx";
import { AddFriendDTO } from "#/AddFriendDTO";

interface AddFriendDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function AddFriendDialog({ open, setOpen }: AddFriendDialogProps) {
	const [username, setUsername] = useState<string>("");
	const [{ loading, error }, request] = useApi<unknown, AddFriendDTO>(
		{
			url: "/friend",
			method: "post",
		},
		{ manual: true },
	);

	function handleCancel() {
		setUsername("");
		setOpen(false);
	}

	function handleSubmit() {
		if (isValid()) {
			request({ data: { username: username.trim() } }).then(() => {
				post("friend_request_update");
				handleCancel();
			});
		}
	}

	function isValid() {
		return username && String(username).trim().length > 0;
	}

	return (
		<Dialog open={open} fullWidth maxWidth={"xs"} onClose={handleCancel}>
			<DialogTitle>Add friend</DialogTitle>
			<DialogContent>
				{error?.response?.data?.message === "already_requested" && (
					<Alert severity={"error"}>Friend request already sent</Alert>
				)}
				{error?.response?.data?.message === "already_friends" && (
					<Alert severity={"error"}>Already friends</Alert>
				)}
				<TextField
					fullWidth
					label={"Username"}
					value={username}
					sx={{ my: 1 }}
					onChange={(e) => setUsername(e.target.value)}
					error={error?.response?.data?.message === "invalid_username"}
				/>
				<Caption>A friend request will be sent to the given username.</Caption>
				<Caption>You will be notified if the request was accepted, but not if it was rejected</Caption>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} disabled={loading || !isValid()}>
					Add friend
				</Button>
			</DialogActions>
		</Dialog>
	);
}
