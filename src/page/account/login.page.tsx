import { Container } from "@mui/material";
import { LoginContainer } from "@sys/login.tsx";
import { PageTitle } from "$/Text.tsx";

function LoginPage() {
	return (
		<Container maxWidth={"xs"} sx={{ p: 3 }}>
			<PageTitle>Sign in</PageTitle>
			<LoginContainer />
		</Container>
	);
}

export default LoginPage;
