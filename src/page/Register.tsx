import { FormEventHandler, useState } from "react";
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useApi } from "@lib/axios.ts";
import { RegisterDTO } from "#/RegisterDTO";
import { PageTitle } from "$/Text.tsx";

function RegisterPage() {
	const [{ loading, error }, request] = useApi<undefined, RegisterDTO>(
		{
			url: "/user/register",
			method: "POST",
		},
		{ manual: true },
	);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [notTheSame, setNotTheSame] = useState(false);

	const navigate = useNavigate();

	const tryRegister: FormEventHandler = (event) => {
		event.preventDefault();
		if (password !== password2) {
			setNotTheSame(true);
			return;
		}
		request({
			data: {
				username: username,
				email: email,
				password: password,
			},
		}).then(() => navigate("/login"));
	};

	return (
		<Container maxWidth={"xs"}>
			<PageTitle>Create new account</PageTitle>
			<Paper sx={{ p: 2 }}>
				<form onSubmit={tryRegister} aria-disabled={loading}>
					<Stack spacing={2}>
						<TextField
							fullWidth
							label={"Username"}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete={"username"}
							error={Boolean(error?.response?.data?.message === "invalid_username")}
							helperText={
								Boolean(error?.response?.data?.message === "invalid_username") &&
								"Enter a valid username"
							}
						/>
						<Typography variant={"caption"} sx={{ pl: 1 }}>
							A valid username must be at least 3 characters, at most 32 characters and contain only
							letters, numbers, hyphens (-) and underscores (_)
						</Typography>
						<TextField
							fullWidth
							label={"Email"}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type={"email"}
							autoComplete={"email"}
							error={Boolean(error?.response?.data?.message === "invalid_email")}
							helperText={
								Boolean(error?.response?.data?.message === "invalid_email") &&
								"Enter a valid e-mail address"
							}
						/>
						<TextField
							fullWidth
							label={"Password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type={"password"}
							autoComplete={"new-password"}
							error={notTheSame || Boolean(error?.response?.data?.message === "invalid_password")}
							helperText={
								Boolean(error?.response?.data?.message === "invalid_password") &&
								"Enter a valid password"
							}
						/>
						<Typography variant={"caption"} sx={{ pl: 1 }}>
							Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number. Password
							must also be at least 8 characters long
						</Typography>
						<TextField
							fullWidth
							label={"Confirm password"}
							value={password2}
							onChange={(e) => setPassword2(e.target.value)}
							type={"password"}
							autoComplete={"new-password"}
							error={notTheSame}
							helperText={notTheSame && "Passwords do not match"}
						/>
						<Button type={"submit"} disabled={loading}>
							Create account
						</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	);
}

export default RegisterPage;
