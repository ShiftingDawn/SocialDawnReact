import { Box, Button, Card, CardActions, CardContent, Container } from "@mui/material";
import { PageTitle } from "$/Title.tsx";
import { useUser } from "@sys/User.tsx";
import { Link } from "react-router";

function PageAccountSettings() {
	const user = useUser();
	return (
		<Container maxWidth={"sm"}>
			<PageTitle>Account Settings</PageTitle>
			<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }} component={"main"}>
				<Card>
					<CardContent>
						{user.email}
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