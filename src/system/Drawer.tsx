import { useState } from "react";
import { Link } from "react-router";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	Drawer as MuiDrawer,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	styled,
	Tab,
	Toolbar,
	Typography,
	useColorScheme,
	useMediaQuery,
} from "@mui/material";
import {
	AccountCircle as AccountCircleIcon,
	AdminPanelSettings as IconAdminPanelSettings,
	Chat as ChatIcon,
	ChevronLeft as ChevronLeftIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
	PeopleAlt as PeopleAltIcon,
	SettingsBrightness as SettingsBrightnessIcon,
} from "@mui/icons-material";
import { useAuth, useUser } from "@sys/User.tsx";
import { TabContext, TabList } from "@mui/lab";
import { AddFriendDialog } from "$/AddFriendDialog.tsx";
import { useApi } from "@lib/axios.ts";
import { FriendDTO } from "#/FriendDTO";
import { Spinner } from "$/Spinner.tsx";
import { PendingRequestsDialog } from "$/PendingRequestsDialog.tsx";
import { FriendRequestCountDTO } from "#/FriendRequestDTO";
import { useEvent } from "@lib/event.ts";

export const DRAWER_WIDTH = 300;

function Drawer() {
	const small = useMediaQuery(theme => theme.breakpoints.down("sm"));
	const [open, setOpen] = useState(false);

	return (
		<>
			<Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
				<MuiDrawer variant={small ? "temporary" : "permanent"} anchor={"left"} open={!small || open} sx={{
					width: DRAWER_WIDTH,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: DRAWER_WIDTH,
						boxSizing: "border-box",
					},
				}} ModalProps={{ keepMounted: true }} onClose={() => setOpen(false)}>
					<Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						{small ? (
							<>
								<ThemeSwitch />
								<Typography variant="h6" noWrap component="div">
									SocialDawn
								</Typography>
							</>
						) : (
							<>
								<UserMenu edge={"start"} />
								<Typography variant="h6" noWrap component="div">
									SocialDawn
								</Typography>
								<ThemeSwitch />
							</>
						)}
						<IconButton aria-label={"close drawer"} onClick={() => setOpen(false)}
						            sx={{ display: { xs: "block", sm: "none" } }}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<Sidebar />
				</MuiDrawer>
			</Box>
			{small && (
				<>
					<AppBar position={"fixed"}>
						<Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<IconButton aria-label={"open drawer"} onClick={() => setOpen(true)} color={"inherit"}
							            edge={"start"} sx={{ display: { xs: "block", sm: "none" } }}>
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" noWrap component="div">
								SocialDawn
							</Typography>
							<UserMenu edge={"end"} />
						</Toolbar>
					</AppBar>
					<Toolbar aria-hidden={true} />
				</>
			)}
		</>
	);
}

export default Drawer;

function UserMenu({ edge }: { edge?: "start" | "end" | false; }) {
	const { loading, thumbnail, username } = useUser();
	const { signOut } = useAuth();
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

	function close() {
		setMenuAnchor(null);
	}

	function handleSignOut() {
		signOut();
		close();
	}

	return loading ? (
		<CircularProgress variant={"indeterminate"} color={"inherit"} />
	) : thumbnail ? (
		<>
			<IconButton aria-label={"account menu"} edge={edge} onClick={(e) => setMenuAnchor(e.currentTarget)}>
				<Avatar alt={username} src={thumbnail} />
			</IconButton>
			<Menu
				open={menuAnchor !== null}
				onClose={() => setMenuAnchor(null)}
				anchorEl={menuAnchor}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}>
				<MenuItem component={Link} to="/profile" onClick={close}>
					<ListItemIcon>
						<AccountCircleIcon />
					</ListItemIcon>
					<ListItemText>User profile</ListItemText>
				</MenuItem>
				<MenuItem component={Link} to="/account" onClick={close}>
					<ListItemIcon>
						<IconAdminPanelSettings />
					</ListItemIcon>
					<ListItemText>Account settings</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleSignOut}>
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText>Sign out</ListItemText>
				</MenuItem>
			</Menu>
		</>
	) : (
		<Button color={"inherit"} component={Link} to={"/login"}>
			Login
		</Button>
	);
}

function ThemeSwitch() {
	const { mode, setMode } = useColorScheme();

	function toggle() {
		switch (mode) {
			case "dark":
				setMode("light");
				break;
			case "light":
				setMode("system");
				break;
			case "system":
				setMode("dark");
				break;
		}
	}

	switch (mode) {
		case "light":
			return (
				<IconButton onClick={toggle} sx={{ color: "inherit" }}>
					<LightModeIcon />
				</IconButton>
			);
		case "dark":
			return (
				<IconButton onClick={toggle} sx={{ color: "inherit" }}>
					<DarkModeIcon />
				</IconButton>
			);
		case "system":
			return (
				<IconButton onClick={toggle} sx={{ color: "inherit" }}>
					<SettingsBrightnessIcon />
				</IconButton>
			);
	}
	return null;
}

const StyledTab = styled(Tab)(({}) => ({
	flex: "1 1",
	padding: "0px 12px",
	minWidth: "1px",
	textTransform: "none",
}));

function Sidebar() {
	const [currentTab, setCurrentTab] = useState<"dm" | "friends" | "guilds" | "channels">("dm");
	return (
		<TabContext value={currentTab}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<TabList onChange={(_, newTab) => setCurrentTab(newTab)} aria-label="Chat list types">
					<StyledTab value={"dm"} aria-label={"chats"} label={"Chats"} icon={<ChatIcon />} />
					<StyledTab value={"friends"} aria-label="friends" label={"Friends"} icon={<PeopleAltIcon />} />
					<StyledTab value={"guilds"} aria-label="guilds" label={"Guilds"} icon={<PeopleAltIcon />} />
					<StyledTab value={"channels"} aria-label="guild channels" label={"Channels"}
					           icon={<PeopleAltIcon />} />
				</TabList>
			</Box>
			{currentTab === "friends" && <TabFriends />}
		</TabContext>
	);
}

function TabFriends() {
	const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
	const [requestsModalOpen, setRequestsModalOpen] = useState(false);
	const [{ data }, refetch] = useApi<FriendDTO[]>(`/friend`);
	const [{ data: reqCount }, refetchReqCount] = useApi<FriendRequestCountDTO>("/friend/request/count");

	useEvent("friend_request_update", () => {
		refetch();
		refetchReqCount();
	});

	return (
		<Stack>
			<Box sx={{ display: "flex", justifyItems: "stretch" }}>
				<Button onClick={() => setAddFriendModalOpen(true)} sx={{ flex: "1 1" }}>Add friend</Button>
				<Button onClick={() => setRequestsModalOpen(true)} sx={{ flex: "1 1" }}
				        disabled={!reqCount || (reqCount.received === 0 && reqCount.sent === 0)}>Pending</Button>
			</Box>
			<Divider />
			<AddFriendDialog open={addFriendModalOpen} setOpen={setAddFriendModalOpen} />
			{reqCount && requestsModalOpen &&
				<PendingRequestsDialog open={true} setOpen={setRequestsModalOpen} count={reqCount} />}
			{data === undefined ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : data.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						pt: 2,
					}}>
					<Typography variant={"h4"} aria-hidden={true}>
						(´•︵•`)
					</Typography>
					<Typography>It's lonely here</Typography>
				</Box>
			) : data.map((friend) => (
				<Box key={friend.friendId} sx={[
					{
						p: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						transition: "background .1s ease-in-out",
						cursor: "pointer",
						"&:hover": {
							backgroundColor: "rgba(0,0,0,.1)",
						},
					},
					(theme) =>
						theme.applyStyles("dark", {
							"&:hover": {
								backgroundColor: "rgba(255,255,255,.1)",
							},
						}),
				]} role={"link"} aria-label={"open chat"}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Avatar aria-hidden={true} src={friend.thumbnail} />
						<Typography variant={"body1"} component={"h3"}>
							{friend.username}
						</Typography>
					</Box>
					<Box></Box>
				</Box>
			))}
		</Stack>
	);
}