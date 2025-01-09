import { FormEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Button, Divider, InputAdornment, TextField, Typography } from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";
import useAxios from "axios-hooks";
import { fErr, fSuccess } from "@lib/flash.ts";
import { PageWrapper } from "$/PageWrapper.tsx";
import { RegisterRequestDTO } from "#/dto.ts";

function RegisterPage() {
	const [{ loading, error }, request] = useAxios<undefined, RegisterRequestDTO, ErrorResponse>(
		{ url: "/auth/register", method: "POST" },
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
		request({ data: { username: username, email: email, password: password } })
			.then(() => {
				fSuccess("Account created successfully");
				navigate("/login");
			})
			.catch(() => fErr("Could not register new account"));
	};

	return (
		<PageWrapper title={"Sign up"} maxWidth={"xs"}>
			<form onSubmit={tryRegister} aria-disabled={loading}>
				<Box sx={{ mb: 4 }}>
					<Box sx={{ display: "flex", alignItems: "flex-end" }}>
						<InputAdornment position={"start"}>
							<AccountCircle fontSize={"large"} />
						</InputAdornment>
						<TextField
							fullWidth
							label={"Username"}
							value={username}
							autoComplete={"username"}
							onChange={(e) => setUsername(e.target.value)}
							error={Boolean(error?.response?.data?.message === "invalid_username")}
							helperText={
								Boolean(error?.response?.data?.message === "invalid_username") &&
								"Enter a valid username"
							}
							id={"signupusername"}
							variant={"standard"}
						/>
					</Box>
					<Typography variant={"caption"}>
						A valid username must be at least 3 characters, at most 32 characters and contain only letters,
						numbers, hyphens (-) and underscores (_)
					</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "flex-end", mb: 4 }}>
					<InputAdornment position={"start"}>
						<Email fontSize={"large"} />
					</InputAdornment>
					<TextField
						fullWidth
						label={"E-mail address"}
						value={email}
						type={"email"}
						autoComplete={"email"}
						onChange={(e) => setEmail(e.target.value)}
						error={Boolean(error?.response?.data?.message === "invalid_email")}
						helperText={
							Boolean(error?.response?.data?.message === "invalid_email") &&
							"Enter a valid e-mail address"
						}
						id={"signupemail"}
						variant={"standard"}
					/>
				</Box>
				<Box sx={{ mb: 4 }}>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ pt: 2 }}>
							<InputAdornment position={"start"}>
								<Lock fontSize={"large"} />
							</InputAdornment>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
							<TextField
								fullWidth
								label={"Password"}
								value={password}
								type={"password"}
								autoComplete={"new-password"}
								onChange={(e) => setPassword(e.target.value)}
								error={notTheSame || Boolean(error?.response?.data?.message === "invalid_password")}
								helperText={
									Boolean(error?.response?.data?.message === "invalid_password") &&
									"Enter a valid password"
								}
								id={"signuppassword"}
								variant={"standard"}
							/>
							<TextField
								fullWidth
								label={"Confirm password"}
								value={password2}
								type={"password"}
								autoComplete={"new-password"}
								onChange={(e) => setPassword2(e.target.value)}
								error={notTheSame}
								helperText={notTheSame && "Passwords do not match"}
								id={"signuppassword2"}
								variant={"standard"}
							/>
						</Box>
					</Box>
					<Typography variant={"caption"}>
						Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number. Password
						must also be at least 8 characters long
					</Typography>
				</Box>
				<Box sx={{ mb: 4 }}>
					<Button type={"submit"} variant={"contained"} disabled={loading} fullWidth>
						Create account
					</Button>
				</Box>
			</form>
			<Divider>OR</Divider>
			<Box sx={{ textAlign: "center", mt: 2 }}>
				<Link to={"/login"} replace>
					<Typography>Sign in with an existing account</Typography>
				</Link>
			</Box>
		</PageWrapper>
	);
}

export default RegisterPage;
