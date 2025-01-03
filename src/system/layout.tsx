import { Box } from "@mui/material";
import Drawer from "@sys/navigation.tsx";
import Routes from "@sys/routes.tsx";

export default function () {
	return (
		<Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, height: "100%" }}>
			<Drawer />
			<Box
				component={"main"}
				sx={{ flexGrow: 1, overflow: "hidden", maxHeight: { xs: "calc(100vh - 56px)", sm: "100vh" } }}
			>
				<Routes />
			</Box>
		</Box>
	);
}
