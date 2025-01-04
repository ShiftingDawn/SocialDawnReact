import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Drawer as MuiDrawer,
	Stack,
	Tab,
	Toolbar,
	Typography,
	styled,
	useColorScheme,
	useMediaQuery,
} from "@mui/material";
import {
	AccountCircle as AccountCircleIcon,
	Chat as ChatIcon,
	ChevronLeft as ChevronLeftIcon,
	DarkMode as DarkModeIcon,
	AdminPanelSettings as IconAdminPanelSettings,
	LightMode as LightModeIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
	PeopleAlt as PeopleAltIcon,
	SettingsBrightness as SettingsBrightnessIcon,
	Tag as TagIcon,
} from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { TabContext, TabList } from "@mui/lab";
import { apollo } from "@lib/api.ts";
import { useEvent } from "@lib/event.ts";
import { fErr } from "@lib/flash.ts";
import { useSession } from "@lib/session.context.ts";
import { AddFriendDialog } from "$/AddFriendDialog.tsx";
import { PendingRequestsDialog } from "$/PendingRequestsDialog.tsx";
import { Spinner } from "$/Spinner.tsx";
import { QUERY_GET_DMS, QUERY_GET_FRIENDS, QUERY_GET_FRIEND_REQUESTS, QUERY_MAKE_DM } from "#/queries";
import { DmDTO, FriendDTO, FriendRequestListDTO } from "#/schema";

export const DRAWER_WIDTH = 300;

function Drawer() {
	const small = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [open, setOpen] = useState(false);

	return (
		<>
			<Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
				<MuiDrawer
					variant={small ? "temporary" : "permanent"}
					anchor={"left"}
					open={!small || open}
					sx={{
						width: DRAWER_WIDTH,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: DRAWER_WIDTH,
							boxSizing: "border-box",
						},
					}}
					ModalProps={{ keepMounted: true }}
					onClose={() => setOpen(false)}
				>
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
						<IconButton
							aria-label={"close drawer"}
							onClick={() => setOpen(false)}
							sx={{ display: { xs: "block", sm: "none" } }}
						>
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
							<IconButton
								aria-label={"open drawer"}
								onClick={() => setOpen(true)}
								color={"inherit"}
								edge={"start"}
								sx={{ display: { xs: "block", sm: "none" } }}
							>
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

function UserMenu({ edge }: { edge?: "start" | "end" | false }) {
	const { state: sessionState, session, update: updateSession } = useSession();
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

	function close() {
		setMenuAnchor(null);
	}

	function handleSignOut() {
		updateSession("signout");
		close();
	}

	return sessionState === "loading" ? (
		<CircularProgress variant={"indeterminate"} color={"inherit"} />
	) : session ? (
		<>
			<IconButton aria-label={"account menu"} edge={edge} onClick={(e) => setMenuAnchor(e.currentTarget)}>
				<Avatar alt={session.username} src={session.thumbnail} />
			</IconButton>
			<Menu
				open={menuAnchor !== null}
				onClose={() => setMenuAnchor(null)}
				anchorEl={menuAnchor}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
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

type TabPanelTab = "dm" | "friends" | "guilds" | "channels";

function Sidebar() {
	const [currentTab, setCurrentTab] = useState<TabPanelTab>("dm");
	const { pathname } = useLocation();

	useEffect(() => {
		let expectedTab: TabPanelTab | null = null;
		if (pathname.startsWith("/dm/")) {
			expectedTab = "dm";
		} else if (pathname.startsWith("/guild/")) {
			expectedTab = "channels";
		}
		if (expectedTab && expectedTab !== currentTab) {
			setCurrentTab(expectedTab);
		}
	}, [pathname]);

	return (
		<TabContext value={currentTab}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<TabList onChange={(_, newTab) => setCurrentTab(newTab)} aria-label="Chat list types">
					<StyledTab value={"dm"} aria-label={"chats"} label={"Chats"} icon={<ChatIcon />} />
					<StyledTab value={"friends"} aria-label="friends" label={"Friends"} icon={<PeopleAltIcon />} />
					<StyledTab value={"guilds"} aria-label="guilds" label={"Guilds"} icon={<PeopleAltIcon />} />
					{pathname.startsWith("/guild/") && (
						<StyledTab
							value={"channels"}
							aria-label="guild channels"
							label={"Channels"}
							icon={<TagIcon />}
						/>
					)}
				</TabList>
			</Box>
			{currentTab === "dm" && <TabDms />}
			{currentTab === "friends" && <TabFriends />}
		</TabContext>
	);
}

function TabDms() {
	const { loading, error, data } = useQuery<{ dms: DmDTO[] }>(QUERY_GET_DMS);
	const navigate = useNavigate();

	function openDm(dmId: string) {
		navigate(`/dm/${dmId}`);
	}

	useEffect(() => {
		if (error) {
			fErr("Could not retrieve chats");
		}
	}, [error]);

	return (
		<Stack>
			{loading ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : !data ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<span>An error occurred</span>
				</Box>
			) : data.dms.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						pt: 2,
					}}
				>
					<Typography variant={"h4"} aria-hidden={true}>
						(´•︵•`)
					</Typography>
					<Typography>It's lonely here</Typography>
				</Box>
			) : (
				data.dms.map((dm) => (
					<Box
						key={dm.id}
						sx={[
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
						]}
						role={"link"}
						aria-label={"open chat"}
						onClick={() => openDm(dm.id)}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Avatar aria-hidden={true} src={dm.user.thumbnail} />
							<Typography variant={"body1"} component={"h3"}>
								{dm.user.username}
							</Typography>
						</Box>
					</Box>
				))
			)}
		</Stack>
	);
}

function TabFriends() {
	const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
	const [requestsModalOpen, setRequestsModalOpen] = useState(false);
	const { data, loading, error, refetch } = useQuery<{ friend: FriendDTO[] }>(QUERY_GET_FRIENDS);
	const { data: requests, refetch: refetchReqCount } = useQuery<{
		friendRequest: FriendRequestListDTO;
	}>(QUERY_GET_FRIEND_REQUESTS);
	const navigate = useNavigate();

	useEffect(() => {
		if (error) {
			fErr("Could not friends");
		}
	}, [error]);

	useEvent("friend_request_update", () => {
		refetch();
		refetchReqCount();
	});

	function openDm(friendId: string) {
		apollo
			.mutate<{ openFriendDm: DmDTO }>({ mutation: QUERY_MAKE_DM, variables: { friendId } })
			.then(({ data }) => navigate(`/dm/${data?.openFriendDm.id}`))
			.catch(() => fErr("Could not open chat"));
	}

	return (
		<Stack>
			<Box sx={{ display: "flex", justifyItems: "stretch" }}>
				<Button onClick={() => setAddFriendModalOpen(true)} sx={{ flex: "1 1" }}>
					Add friend
				</Button>
				<Button
					onClick={() => setRequestsModalOpen(true)}
					sx={{ flex: "1 1" }}
					disabled={
						!requests ||
						(requests.friendRequest.received.length === 0 && requests.friendRequest.sent.length === 0)
					}
				>
					Pending
				</Button>
			</Box>
			<Divider />
			<AddFriendDialog open={addFriendModalOpen} setOpen={setAddFriendModalOpen} />
			{requests && requestsModalOpen && (
				<PendingRequestsDialog open={true} setOpen={setRequestsModalOpen} requests={requests.friendRequest} />
			)}
			{loading ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Spinner />
					<span>Loading</span>
				</Box>
			) : !data ? (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<span>An error occurred</span>
				</Box>
			) : data.friend.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						pt: 2,
					}}
				>
					<Typography variant={"h4"} aria-hidden={true}>
						(´•︵•`)
					</Typography>
					<Typography>It's lonely here</Typography>
				</Box>
			) : (
				data.friend.map((friend) => (
					<Box
						key={friend.id}
						sx={[
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
						]}
						role={"link"}
						aria-label={"open chat"}
						onClick={() => openDm(friend.id)}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Avatar aria-hidden={true} src={friend.user.thumbnail} />
							<Typography variant={"body1"} component={"h3"}>
								{friend.user.username}
							</Typography>
						</Box>
					</Box>
				))
			)}
		</Stack>
	);
}
