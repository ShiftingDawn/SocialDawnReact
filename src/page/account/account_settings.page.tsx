import { useState } from "react";
import { Link } from "react-router";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import useAxios from "axios-hooks";
import { useSession } from "@lib/session.context.ts";
import { PageTitle } from "$/Text.tsx";

function PageAccountSettings() {
	const { session } = useSession();
	const [destroySessionDialogOpen, setDestroySessionDialogOpen] = useState(false);
	return (
		<Container maxWidth={"sm"} sx={{ pt: 3 }}>
			<PageTitle>Account Settings</PageTitle>
			<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }} component={"main"}>
				<Card>
					<CardContent>{session?.email}</CardContent>
					<CardActions>
						<Button component={Link} to={"/account/changepassword"}>
							Change password
						</Button>
						<Button color={"error"} onClick={() => setDestroySessionDialogOpen(true)}>
							Log out everywhere
						</Button>
					</CardActions>
				</Card>
			</Box>
			<LogOutEverywhereDialog
				open={destroySessionDialogOpen}
				onClose={() => setDestroySessionDialogOpen(false)}
			/>
		</Container>
	);
}

export default PageAccountSettings;

function LogOutEverywhereDialog({ open, onClose }: DialogProps) {
	const { update } = useSession();
	const [{ loading }, execute] = useAxios({ url: `/auth/destroy`, method: "DELETE" }, { manual: true });

	function handleConfirm() {
		execute()
			.then(() => update("destroy"))
			.then(() => window.location.assign("/"));
	}

	return (
		<Dialog open={open} fullWidth maxWidth={"sm"} onClose={loading ? undefined : onClose}>
			<DialogTitle>Log out everywhere</DialogTitle>
			<DialogContent>
				<p>Are you sure you want to log out everywhere?</p>
				<p>Doing so will invalidate all sessions for your account.</p>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleConfirm} color={"error"} disabled={loading}>
					Log out everywhere
				</Button>
			</DialogActions>
		</Dialog>
	);
}
