import { Box, Card, CardContent, Container, Fab, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { ChevronLeft } from "@mui/icons-material";

function NotFoundPage() {
	const navigate = useNavigate();
	return (
		<Container maxWidth="xs" sx={{ p: 3 }}>
			<Card>
				<CardContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
					<Typography variant={"h4"} component={"h1"} textAlign={"center"}>
						404: Page Not Found
					</Typography>
					<Typography variant={"subtitle1"} component={"pre"} aria-hidden={"true"} textAlign={"center"}>
						(&#x256F;&#xB0;&#x25A1;&#xB0;)&#x256F;&#xFE35; &#x253B;&#x2501;&#x253B;
					</Typography>
					<Box sx={{ textAlign: "center" }}>
						<Fab onClick={() => navigate(-1)} color={"primary"} aria-label={"go back"}>
							<ChevronLeft />
						</Fab>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
}

export default NotFoundPage;