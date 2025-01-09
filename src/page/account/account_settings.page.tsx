import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from "@mui/material";
import useAxios from "axios-hooks";
import { fErr, fInfo, fSuccess } from "@lib/flash.ts";
import { useSession } from "@lib/session.context.ts";
import { MultiPage, MultiPageWrapper } from "$/PageWrapper.tsx";
import { Spinner, SpinnerBox } from "$/Spinner.tsx";
import { EnableTotpResponseDTO, TotpStatusResponseDTO } from "#/dto.ts";

function PageAccountSettings() {
	const [{ data, loading, error }, refetch] = useAxios<TotpStatusResponseDTO>("/auth/totp");
	const { session } = useSession();
	const [destroySessionDialogOpen, setDestroySessionDialogOpen] = useState(false);
	const [totpDialogOpen, setTotpDialogOpen] = useState(false);

	useEffect(() => {
		refetch().catch(() => {});
	}, [totpDialogOpen]);

	return (
		<MultiPageWrapper title={"Account settings"}>
			<MultiPage title={"Account details"}>
				<p>{session?.email}</p>
			</MultiPage>
			<MultiPage title={"Security"}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, m: 1 }}>
					<Typography>2FA Account Security status: </Typography>
					{!data && loading && (
						<>
							<Spinner />
							Loading
						</>
					)}
					{error && <strong>Could not retrieve status</strong>}
					{data?.totpState === "DISABLED" && <strong>Disabled</strong>}
					{data?.totpState === "ENABLED" && <span>Enabled</span>}
					{data?.totpState === "NEEDS_VALIDATION" && <strong>Unverified</strong>}
				</Box>
				{data && data.totpState !== "ENABLED" && (
					<Button onClick={() => setTotpDialogOpen(true)} fullWidth sx={{ justifyContent: "start" }}>
						{data.totpState === "DISABLED" && "Enable 2 Factor Authentication"}
						{data.totpState === "NEEDS_VALIDATION" && "Verify 2 Factor Authentication"}
					</Button>
				)}
				<Button component={Link} to={"/account/changepassword"} sx={{ display: "block" }}>
					Change password
				</Button>
				<Button
					color={"error"}
					onClick={() => setDestroySessionDialogOpen(true)}
					fullWidth
					sx={{ justifyContent: "start" }}
				>
					Log out everywhere
				</Button>
				<LogOutEverywhereDialog
					open={destroySessionDialogOpen}
					onClose={() => setDestroySessionDialogOpen(false)}
				/>
				{totpDialogOpen && <TotpDialog open={true} onClose={() => setTotpDialogOpen(false)} />}
			</MultiPage>
		</MultiPageWrapper>
	);
}

export default PageAccountSettings;

function LogOutEverywhereDialog({ open, onClose }: DialogProps) {
	const { update } = useSession();
	const [{ loading }, execute] = useAxios({ url: `/auth/destroy`, method: "DELETE" }, { manual: true });

	function handleConfirm() {
		execute()
			.then(() => update("destroy"))
			.then(() => window.location.assign("/"));
	}

	return (
		<Dialog open={open} fullWidth maxWidth={"sm"} onClose={loading ? undefined : onClose}>
			<DialogTitle>Log out everywhere</DialogTitle>
			<DialogContent>
				<p>Are you sure you want to log out everywhere?</p>
				<p>Doing so will invalidate all sessions for your account.</p>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleConfirm} color={"error"} disabled={loading}>
					Log out everywhere
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function TotpDialog({ open, onClose }: DialogProps) {
	const [{ loading, data }, enable] = useAxios<EnableTotpResponseDTO>(
		{ url: "/auth/totp", method: "post" },
		{ manual: true },
	);
	const [{ loading: validating, error: validationError }, validate] = useAxios(
		{ url: "/auth/totp/activate", method: "post" },
		{ manual: true },
	);
	const [step, setStep] = useState(0);
	const [validationCode, setValidationCode] = useState("");

	function handleEnable() {
		enable()
			.then(() => fInfo("2 Factor authentication is enabled but not verified yet."))
			.catch(() => fErr("Could not enable 2 factor authentication. Please try again later."));
	}

	function handleValidateCode() {
		validate({ data: { code: validationCode } }).then(() => {
			fSuccess("2 Factor Authentication has been validated and enabled.");
			onClose();
		});
	}

	return (
		<Dialog open={open} fullWidth maxWidth={"xs"}>
			<DialogTitle>2 Factor Authentication</DialogTitle>
			<DialogContent>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{loading ? (
						<SpinnerBox />
					) : !data ? (
						<Button onClick={handleEnable} disabled={loading}>
							Enable 2 Factor Authentication
						</Button>
					) : (
						<Stepper orientation={"vertical"} activeStep={step}>
							<Step>
								<StepLabel>
									{step === 0 ? (
										<span>
											Scan the QRCode with an authenticator app or enter the following code
											manually: <code>{data.secret}</code>
										</span>
									) : (
										<span>Scan the QRCode</span>
									)}
								</StepLabel>
								<StepContent>
									<Stack>
										<img
											src={data.qrcode}
											alt={"qrcode"}
											title={"Click to open in a new tab"}
											style={{ width: "min-content" }}
										/>
										<Button
											onClick={() => {
												const newTab = window.open("", "_blank");
												newTab?.document.write(`<img src="${data?.qrcode}"/>`);
												newTab?.document.close();
											}}
										>
											Open in new tab
										</Button>
									</Stack>
								</StepContent>
							</Step>
							<Step>
								<StepLabel>Verify the code</StepLabel>
								<StepContent>
									<TextField
										label={"Enter one time code for verification"}
										fullWidth
										type={"text"}
										value={validationCode}
										onChange={(e) => setValidationCode(e.currentTarget.value)}
										autoComplete={"one-time-code"}
										error={Boolean(validationError)}
									/>
								</StepContent>
							</Step>
						</Stepper>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color={"error"}>
					Cancel
				</Button>
				{step === 0 && (
					<Button
						onClick={() => {
							setStep(1);
							setValidationCode("");
						}}
						disabled={validating}
					>
						Next step
					</Button>
				)}
				{step === 1 && (
					<>
						<Button onClick={() => setStep(0)} color={"error"} disabled={validating}>
							Previous step
						</Button>
						<Button onClick={handleValidateCode} disabled={validating}>
							Verify code
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
