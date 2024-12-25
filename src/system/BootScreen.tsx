import { Box, Typography } from "@mui/material";
import { Spinner } from "$/Spinner.tsx";

function BootScreen() {
	return (
		<Box display={"flex"} flexDirection={"column"} gap={2} alignItems={"center"} justifyContent={"center"}
			 height={"100%"}>
			<Spinner size={128} lineSize={8} />
			<Typography component={"h1"} variant={"h4"}>
				Loading
			</Typography>
		</Box>
	);
}

export default BootScreen;