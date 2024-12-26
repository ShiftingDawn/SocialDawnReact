import {
	AppBar,
	Avatar,
	Box,
	Button,
	CircularProgress,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	useColorScheme,
} from "@mui/material";
import {
	AccountCircle as AccountCircleIcon,
	AdminPanelSettings as IconAdminPanelSettings,
	DarkMode,
	HomeOutlined as GoHomeIcon,
	HomeRounded as HomeIcon,
	LightMode,
	Logout as LogoutIcon,
	SettingsBrightness,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router";
import { useAuth, useUser } from "@sys/User.tsx";
import { useEffect, useState } from "react";

function NavBar() {
	const [onTop, setOnTop] = useState(window.scrollY === 0);
	useEffect(() => {
		function handle() {
			setOnTop(window.scrollY === 0);
		}

		window.addEventListener("scroll", handle);
		return () => {
			window.removeEventListener("scroll", handle);
		};
	}, []);
	return (
		<>
			<AppBar
				position={"fixed"}
				sx={{ flex: "0 0", backgroundColor: "transparent", backdropFilter: "blur(4px)" }}>
				<Toolbar
					aria-hidden={true}
					sx={[
						{
							position: "absolute",
							left: 0,
							right: 0,
							opacity: onTop ? 1 : 0,
							transition: "opacity .1s ease-in-out",
						},
						(theme) => ({
							backgroundColor: theme.palette.primary.main,
						}),
						(theme) =>
							theme.applyStyles("dark", {
								backgroundColor: theme.palette.background.default,
							}),
					]}
				/>
				<Toolbar
					component={"nav"}
					sx={{
						justifyContent: "space-between",
						color: (theme) => (onTop ? "inherit" : theme.palette.text.primary),
					}}>
					<HomeButton />
					{/* TODO fav bar */}
					<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
						<ThemeSwitch />
						<UserMenu />
					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
}

export default NavBar;

function HomeButton() {
	const { pathname } = useLocation();
	return (
		<IconButton component={Link} to="/" color={"inherit"}>
			{pathname === "/" ? <HomeIcon fontSize={"large"} /> : <GoHomeIcon fontSize={"large"} />}
		</IconButton>
	);
}

function UserMenu() {
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
			<IconButton aria-label={"account menu"} onClick={(e) => setMenuAnchor(e.currentTarget)}>
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
					<LightMode />
				</IconButton>
			);
		case "dark":
			return (
				<IconButton onClick={toggle} sx={{ color: "inherit" }}>
					<DarkMode />
				</IconButton>
			);
		case "system":
			return (
				<IconButton onClick={toggle} sx={{ color: "inherit" }}>
					<SettingsBrightness />
				</IconButton>
			);
	}
	return null;
}
