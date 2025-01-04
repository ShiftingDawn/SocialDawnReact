import { CSSProperties } from "react";
import { Box } from "@mui/material";

interface SpinnerProps {
	size?: CSSProperties["width"];
	lineSize?: CSSProperties["width"];
}

export function Spinner({ size = 24, lineSize = 3 }: SpinnerProps) {
	return (
		<Box
			aria-hidden={true}
			width={size}
			height={size}
			border={lineSize}
			borderRadius={"50%"}
			display={"inline-block"}
			sx={{
				borderColor: (theme) => `${theme.palette.primary.main} transparent`,
				animation: "1s spin infinite linear",
			}}
		/>
	);
}

export function SpinnerBox() {
	return (
		<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
			<Spinner />
			<span>Loading</span>
		</Box>
	);
}
