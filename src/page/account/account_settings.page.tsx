import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material";
import useAxios from "axios-hooks";
import { URI } from "otpauth";
import QRCode from "react-qr-code";
import { fErr, fInfo, fSuccess } from "@lib/flash.ts";
import { useSession } from "@lib/session.context.ts";
import { SimpleCard } from "$/SimpleCard.tsx";
import { Spinner, SpinnerBox } from "$/Spinner.tsx";
import { PageTitle } from "$/Text.tsx";
import { OneTimeCodeRequestDTO, TotpStatusResponseDTO } from "#/dto.ts";

function PageAccountSettings() {
	const { session } = useSession();
	const [destroySessionDialogOpen, setDestroySessionDialogOpen] = useState(false);
	const [totpDialogOpen, setTotpDialogOpen] = useState(false);
	const [{ data, loading, error }, refetch] = useAxios<TotpStatusResponseDTO>("/auth/totp");

	useEffect(() => {
		refetch().catch(() => {});
	}, [totpDialogOpen]);

	return (
		<Container maxWidth={"sm"} sx={{ pt: 3 }}>
			<PageTitle>Account Settings</PageTitle>
			<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }} component={"main"}>
				<SimpleCard title={"Account details"}>
					<p>{session?.email}</p>
				</SimpleCard>
				<SimpleCard title={"Security"}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, m: 1 }}>
						<Typography>2FA Account Security status: </Typography>
						{!data && loading && (
							<>
								<Spinner />
								Loading
							</>
						)}
						{error && <strong>Could not retrieve status</strong>}
						{data?.totpState === "disabled" && <strong>Disabled</strong>}
						{data?.totpState === "enabled" && <span>Enabled</span>}
						{data?.totpState === "needs_validation" && <strong>Unverified</strong>}
					</Box>
					{data && data.totpState !== "enabled" && (
						<Button onClick={() => setTotpDialogOpen(true)} fullWidth sx={{ justifyContent: "start" }}>
							{data.totpState === "disabled" && "Enable 2 Factor Authentication"}
							{data.totpState === "needs_validation" && "Verify 2 Factor Authentication"}
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
				</SimpleCard>
			</Box>
			<LogOutEverywhereDialog
				open={destroySessionDialogOpen}
				onClose={() => setDestroySessionDialogOpen(false)}
			/>
			{totpDialogOpen && <TotpDialog open={true} onClose={() => setTotpDialogOpen(false)} />}
		</Container>
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
	const [{ data, loading }, refetch] = useAxios<TotpStatusResponseDTO>("/auth/totp");

	useEffect(() => {
		if (data?.totpState === "enabled") {
			onClose();
		}
	}, [data?.totpState]);

	return (
		<Dialog open={open} fullWidth maxWidth={"sm"}>
			<DialogTitle>2 Factor Authentication</DialogTitle>
			<DialogContent>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{(loading || !data) && <SpinnerBox />}
					{data?.totpState === "disabled" && <EnablePage callback={refetch} />}
					{data?.totpState === "needs_validation" && <VerifyPage callback={refetch} />}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}

function EnablePage({ callback }: { callback: () => void }) {
	const [{ loading }, enable] = useAxios<TotpStatusResponseDTO>(
		{ url: "/auth/totp/create", method: "post" },
		{ manual: true },
	);

	function handleEnable() {
		enable()
			.then(() => {
				fInfo("2 Factor authentication is enabled but not verified yet.");
				callback();
			})
			.catch(() => fErr("Could not enable 2 factor authentication. Please try again later."));
	}

	return (
		<Button onClick={handleEnable} disabled={loading}>
			Enable 2 Factor Authentication
		</Button>
	);
}

function VerifyPage({ callback }: { callback: () => void }) {
	const [{ data, loading }] = useAxios<string>("/auth/totp/create");
	const [{ loading: validationLoading, error: validationError }, validate] = useAxios<
		undefined,
		OneTimeCodeRequestDTO
	>({ url: "/auth/totp/activate", method: "post" }, { manual: true });
	const [secret, setSecret] = useState<string>();
	const [validationCode, setValidationCode] = useState("");

	function showCode() {
		const totp = URI.parse(data as string);
		setSecret(totp.secret.base32);
	}

	function handleValidateCode() {
		validate({ data: { code: validationCode } }).then(() => {
			fSuccess("2 Factor Authentication has been validated and enabled.");
			callback();
		});
	}

	return loading || !data ? (
		<SpinnerBox />
	) : (
		<>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Box sx={{ background: "white", padding: "16px" }}>
					<QRCode value={data} />
				</Box>
			</Box>
			<Typography>
				Scan the QRCode with an authenticator app that supports TOTP codes like Google Authenticator, Bitwarden
				or Proton Pass
			</Typography>
			{secret ? (
				<Typography>
					Or enter the following code manually: <code>{secret}</code>
				</Typography>
			) : (
				<Button onClick={showCode}>Or click here for a manual code</Button>
			)}
			<TextField
				label={"Enter one time code for verification"}
				fullWidth
				type={"text"}
				value={validationCode}
				onChange={(e) => setValidationCode(e.currentTarget.value)}
				autoComplete={"one-time-code"}
				error={Boolean(validationError)}
			/>
			<Button onClick={handleValidateCode} disabled={validationLoading}>
				Validate code
			</Button>
		</>
	);
}
