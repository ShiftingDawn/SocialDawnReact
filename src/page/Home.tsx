import { Box, Paper } from "@mui/material";

const drawerWidth = 240;

function HomePage() {
	return (
		<Box sx={{ display: "flex", mt: -1, height: "100%", p: { xs: 0, sm: 1 }, gap: 1 }}>
			<Paper square sx={{ width: drawerWidth, flexShrink: 0, justifySelf: "stretch" }}>
				sidebar
			</Paper>
			<Paper sx={{ width: "100%" }}>
				content
			</Paper>
		</Box>
	);
}

export default HomePage;