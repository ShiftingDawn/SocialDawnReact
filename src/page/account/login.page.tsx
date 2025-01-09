import { LoginContainer } from "@sys/login.tsx";
import { PageWrapper } from "$/PageWrapper.tsx";

function LoginPage() {
	return (
		<PageWrapper title={"Sign in"} maxWidth={"xs"}>
			<LoginContainer />
		</PageWrapper>
	);
}

export default LoginPage;
