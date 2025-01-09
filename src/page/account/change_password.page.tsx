import { FormEvent, useMemo, useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import useAxios from "axios-hooks";
import { PageWrapper } from "$/PageWrapper.tsx";
import { ChangePasswordRequestDTO } from "#/dto.ts";

function PageAccountChangePassword() {
	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirm, setPasswordConfirm] = useState<string>("");
	const [{ response, error }, sendRequest] = useAxios<undefined, ChangePasswordRequestDTO, ErrorResponse>(
		{ url: "/auth/password", method: "put" },
		{ manual: true },
	);

	const hasPasswordTooWeakError = useMemo(
		() => Boolean(error?.response?.data?.message === "password_too_weak"),
		[error?.response?.data?.message],
	);
	const hasPasswordDontMatchError = useMemo(
		() => Boolean(error?.response?.data?.message === "passwords_do_not_match"),
		[error?.response?.data?.message],
	);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		sendRequest({
			data: {
				oldPassword: currentPassword,
				newPassword: password,
				confirmPassword: passwordConfirm,
			},
		});
	}

	return (
		<PageWrapper title={"Change password"} maxWidth={"xs"}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={2}>
					{response?.status === 200 && <Alert severity={"success"}>Password has been updated!</Alert>}
					<TextField
						fullWidth
						label={"Current password"}
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						type={"password"}
						error={error?.response?.status === 401}
						helperText={error?.response?.status === 401 && "Invalid password"}
						variant={"standard"}
						id={"changepasswordold"}
					/>
					<TextField
						fullWidth
						label={"New password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type={"password"}
						error={hasPasswordTooWeakError || hasPasswordDontMatchError}
						helperText={hasPasswordTooWeakError && "Password is too weak"}
						variant={"standard"}
						id={"changepasswordnew"}
					/>
					<TextField
						fullWidth
						label={"Confirm new password"}
						value={passwordConfirm}
						onChange={(e) => setPasswordConfirm(e.target.value)}
						type={"password"}
						error={hasPasswordDontMatchError}
						helperText={hasPasswordDontMatchError && "Passwords do not match"}
						variant={"standard"}
						id={"changepasswordnew2"}
					/>
					<Box sx={{ mb: 4 }}>
						<Button type={"submit"} variant={"contained"} fullWidth>
							Submit
						</Button>
					</Box>
				</Stack>
			</form>
		</PageWrapper>
	);
}

export default PageAccountChangePassword;
