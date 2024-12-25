import {
	AppBar,
	Avatar,
	Button,
	CircularProgress,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
} from "@mui/material";
import {
	AccountCircle as AccountCircleIcon,
	AdminPanelSettings as IconAdminPanelSettings,
	Chat as ChatIcon,
	HomeOutlined as GoHomeIcon,
	HomeRounded as HomeIcon,
	Logout as LogoutIcon,
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
			<AppBar position={"fixed"}
					sx={{ flex: "0 0", backgroundColor: "transparent", backdropFilter: "blur(4px)" }}>
				<Toolbar aria-hidden={true} sx={{
					position: "absolute", left: 0, right: 0,
					backgroundColor: theme => theme.palette.primary.main,
					opacity: onTop ? 1 : 0,
					transition: "opacity .1s ease-in-out",
				}} />
				<Toolbar component={"nav"} sx={{
					justifyContent: "space-between",
					color: theme => onTop ? "inherit" : theme.palette.text.primary,
				}}>
					<HomeButton />
					{/* TODO fav bar */}
					<UserMenu />
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
			{pathname === "/" ? (
				<HomeIcon fontSize={"large"} />
			) : (
				<GoHomeIcon fontSize={"large"} />
			)}
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
			<IconButton aria-label={"account menu"} onClick={e => setMenuAnchor(e.currentTarget)}>
				<Avatar alt={username} src={thumbnail} />
			</IconButton>
			<Menu open={menuAnchor !== null} onClose={() => setMenuAnchor(null)} anchorEl={menuAnchor}
				  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				  transformOrigin={{ vertical: "top", horizontal: "right" }}>
				<MenuItem component={Link} to="/profile" onClick={close}>
					<ListItemIcon><AccountCircleIcon /></ListItemIcon>
					<ListItemText>User profile</ListItemText>
				</MenuItem>
				<MenuItem component={Link} to="/account/social" onClick={close}>
					<ListItemIcon><ChatIcon /></ListItemIcon>
					<ListItemText>Social settings</ListItemText>
				</MenuItem>
				<MenuItem component={Link} to="/account" onClick={close}>
					<ListItemIcon><IconAdminPanelSettings /></ListItemIcon>
					<ListItemText>Account settings</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleSignOut}>
					<ListItemIcon><LogoutIcon /></ListItemIcon>
					<ListItemText>Sign out</ListItemText>
				</MenuItem>
			</Menu>
		</>
	) : (
		<Button color={"inherit"} component={Link} to={"/login"}>Login</Button>
	);
}