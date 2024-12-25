import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import { AddFriendDialog } from "$/AddFriendDialog.tsx";

const drawerWidth = 240;

function HomePage() {
	const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
	return (
		<>
			<Box sx={{ display: "flex", mt: -1, height: "100%", p: { xs: 0, sm: 1 }, gap: 1 }}>
				<Paper square sx={{ width: drawerWidth, flexShrink: 0, justifySelf: "stretch" }}>
					<Button onClick={() => setAddFriendModalOpen(true)}>Add friend</Button>
					sidebar
				</Paper>
				<Paper sx={{ width: "100%" }}>
					content
				</Paper>
			</Box>
			<AddFriendDialog open={addFriendModalOpen} setOpen={setAddFriendModalOpen} />
		</>
	);
}

export default HomePage;