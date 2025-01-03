import { Box, Button, Card, CardActions, CardContent, Container } from "@mui/material";
import { PageTitle } from "$/Text.tsx";
import { Link } from "react-router";
import { useSession } from "@lib/session.context.ts";

function PageAccountSettings() {
	const { session } = useSession();
	return (
		<Container maxWidth={"sm"} sx={{ pt: 3 }}>
			<PageTitle>Account Settings</PageTitle>
			<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }} component={"main"}>
				<Card>
					<CardContent>
						{session?.email}
					</CardContent>
					<CardActions>
						<Button component={Link} to={"/account/changepassword"}>
							Change password
						</Button>
					</CardActions>
				</Card>
			</Box>
		</Container>
	);
}

export default PageAccountSettings;