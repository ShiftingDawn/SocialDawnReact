import { Box, Toolbar } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "@page/Home.tsx";
import LoginPage from "@page/Login.tsx";
import NavBar from "@sys/NavBar.tsx";
import NotFoundPage from "@page/404.tsx";
import PageAccountSettings from "@page/AccountSettings.tsx";
import PageAccountChangePassword from "@page/AccountChangePassword.tsx";
import { useEffect } from "react";
import RegisterPage from "@page/Register.tsx";

function App() {
	useEffect(() => {
		function calcHeight() {
			const top = document.getElementById("pagecontainer")!.offsetTop;
			document.getElementById("pagecontainer")!.style.minHeight = `calc(100% - ${top}px)`;
		}
		calcHeight();
		window.addEventListener("resize", calcHeight);
		return () => {
			window.removeEventListener("resize", calcHeight);
		};
	}, []);

	return (
		<BrowserRouter>
			<NavBar />
			<Toolbar aria-hidden={true} />
			<Box sx={{ py: 1 }} id={"pagecontainer"}>
				<Routes>
					<Route index element={<HomePage />} />
					<Route path={"*"} element={<NotFoundPage />} />
					<Route path={"/login"} element={<LoginPage />} />
					<Route path={"/register"} element={<RegisterPage />} />
					<Route path={"/account"} element={<PageAccountSettings />} />
					<Route path={"/account/changepassword"} element={<PageAccountChangePassword />} />
				</Routes>
			</Box>
		</BrowserRouter>
	);
}

export default App;
