import { FormEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Container, Divider, Paper, Stack, TextField } from "@mui/material";
import Axios from "axios";
import { fErr, fSuccess } from "@lib/flash.ts";
import { useSession } from "@lib/session.context.ts";
import { PageTitle } from "$/Text.tsx";
import { LoginRequestDTO, LoginResponseDTO } from "#/LoginDTO";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { update: updateSession } = useSession();

	const navigate = useNavigate();

	const tryLogin: FormEventHandler = (event) => {
		event.preventDefault();
		Axios.post<LoginResponseDTO>("/auth/login", {
			email: email,
			password: password,
		} satisfies LoginRequestDTO)
			.then(() => {
				updateSession("signin").then(() => {
					fSuccess("Welcome back!");
					navigate("/");
				});
			})
			.catch(() => fErr("Could not sign in"));
	};

	return (
		<Container maxWidth={"xs"} sx={{ p: 3 }}>
			<PageTitle>Sign in</PageTitle>
			<Paper sx={{ p: 2 }}>
				<form onSubmit={tryLogin}>
					<Stack spacing={2}>
						<TextField
							fullWidth
							label={"Email"}
							value={email}
							autoComplete={"email"}
							type={"email"}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							fullWidth
							label={"Password"}
							value={password}
							autoComplete={"current-password"}
							onChange={(e) => setPassword(e.target.value)}
							type={"password"}
						/>
						<Button type={"submit"}>Sign in</Button>
					</Stack>
				</form>
				<Divider />
				<p>
					Don't have an account yet? <Link to={"/register"}>Make one</Link>
				</p>
			</Paper>
		</Container>
	);
}

export default LoginPage;
