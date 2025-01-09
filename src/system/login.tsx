import { FormEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Button, Divider, InputAdornment, TextField, Typography } from "@mui/material";
import { Email, Lock, LockClock } from "@mui/icons-material";
import useAxios from "axios-hooks";
import { fErr, fSuccess } from "@lib/flash.ts";
import { useSession } from "@lib/session.context.ts";
import { LoginCodeRequestDTO, LoginRequestDTO, LoginResponseDTO } from "#/dto.ts";

export function LoginContainer() {
	const [{ loading: loadingLogin, data: dataLogin }, login] = useAxios<LoginResponseDTO>(
		{
			url: "/auth/login",
			method: "post",
		},
		{ manual: true },
	);
	const [{ loading: loading2fa }, auth2fa] = useAxios({ url: "/auth/login/2fa", method: "post" }, { manual: true });
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { update: updateSession } = useSession();
	const [totpCode, setTotpCode] = useState<string>("");

	const tryLogin: FormEventHandler = (event) => {
		event.preventDefault();
		login({ data: { email: email, password: password } satisfies LoginRequestDTO })
			.then(({ data }) => {
				if (!data.token) {
					updateSession("signin").then(() => {
						fSuccess("Welcome back!");
						navigate(0);
					});
				}
			})
			.catch(() => fErr("Could not sign in"));
	};

	const tryValidateToken: FormEventHandler = (event) => {
		event.preventDefault();
		if (dataLogin?.token && totpCode) {
			auth2fa({ data: { token: dataLogin.token, code: totpCode } satisfies LoginCodeRequestDTO })
				.then(() => {
					updateSession("signin").then(() => {
						fSuccess("Welcome back!");
						navigate(0);
					});
				})
				.catch(() => fErr("Could not sign in"));
		}
	};

	return !dataLogin?.token ? (
		<>
			<form onSubmit={tryLogin} aria-disabled={loadingLogin}>
				<Box sx={{ display: "flex", alignItems: "flex-end", mb: 4 }}>
					<InputAdornment position={"start"}>
						<Email fontSize={"large"} />
					</InputAdornment>
					<TextField
						fullWidth
						label={"Email"}
						value={email}
						autoComplete={"email"}
						type={"email"}
						onChange={(e) => setEmail(e.target.value)}
						variant={"standard"}
						id={"signinemail"}
					/>
				</Box>
				<Box sx={{ display: "flex", alignItems: "flex-end", mb: 8 }}>
					<InputAdornment position={"start"}>
						<Lock fontSize={"large"} />
					</InputAdornment>
					<TextField
						fullWidth
						label={"Password"}
						value={password}
						autoComplete={"current-password"}
						onChange={(e) => setPassword(e.target.value)}
						type={"password"}
						variant={"standard"}
						id={"signinpassword"}
					/>
				</Box>
				<Box sx={{ mb: 4 }}>
					<Button type={"submit"} variant={"contained"} fullWidth disabled={loadingLogin}>
						Sign in
					</Button>
				</Box>
			</form>
			<Divider>OR</Divider>
			<Box sx={{ textAlign: "center", mt: 2 }}>
				<Link to={"/register"} replace>
					<Typography>Register a new account here</Typography>
				</Link>
			</Box>
		</>
	) : (
		<form onSubmit={tryValidateToken} aria-disabled={loading2fa}>
			<Box sx={{ display: "flex", alignItems: "flex-end", mb: 4 }}>
				<InputAdornment position={"start"}>
					<LockClock fontSize={"large"} />
				</InputAdornment>
				<TextField
					autoFocus
					fullWidth
					label={"Enter 2 factor code"}
					autoComplete={"one-time-code"}
					type={"text"}
					name={"totp"}
					value={totpCode}
					onChange={(e) => setTotpCode(e.currentTarget.value)}
					variant={"standard"}
					id={"signin2fa"}
				/>
			</Box>
			<Box>
				<Button type={"submit"} variant={"contained"} fullWidth disabled={loading2fa}>
					Submit
				</Button>
			</Box>
		</form>
	);
}
