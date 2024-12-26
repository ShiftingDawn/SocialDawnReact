import { FormEventHandler, useState } from "react";
import { Button, Container, Divider, Paper, Stack, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { LoginRequestDTO, LoginResponseDTO } from "#/LoginDTO";
import { useAuth } from "@sys/User.tsx";
import { axios } from "@lib/axios.ts";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { signIn } = useAuth();

	const navigate = useNavigate();

	const tryLogin: FormEventHandler = (event) => {
		event.preventDefault();
		axios
			.post<LoginResponseDTO>("/auth/login", {
				email: email,
				password: password,
			} satisfies LoginRequestDTO)
			.then((res) => {
				signIn(res.data.accessToken);
				navigate("/");
			});
	};

	return (
		<Container maxWidth={"xs"}>
			<Paper sx={{ p: 2 }}>
				<form onSubmit={tryLogin}>
					<Stack spacing={2}>
						<TextField
							fullWidth
							label={"Email"}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type={"email"}
							autoComplete={"email"}
						/>
						<TextField
							fullWidth
							label={"Password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type={"password"}
							autoComplete={"current-password"}
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
