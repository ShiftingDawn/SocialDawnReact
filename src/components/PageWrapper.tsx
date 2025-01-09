import { Box, Breakpoint, Container, Paper, Typography } from "@mui/material";

interface PageWrapperProps {
	title?: string;
	maxWidth?: Breakpoint;
}

export function PageWrapper({ title, maxWidth, children }: PC<PageWrapperProps>) {
	return (
		<Container maxWidth={maxWidth ?? "sm"}>
			<Paper sx={{ mt: 4, mb: 2 }}>
				{title && (
					<Box sx={{ p: 2 }}>
						<Typography variant={"h4"} component={"h1"}>
							{title}
						</Typography>
					</Box>
				)}
				<Box sx={{ p: 4, pt: title ? 0 : 4 }}>{children}</Box>
			</Paper>
		</Container>
	);
}
