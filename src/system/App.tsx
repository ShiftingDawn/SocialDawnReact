import { BrowserRouter, Route, Routes } from "react-router";
import { Box } from "@mui/material";
import Drawer from "@sys/Drawer.tsx";
import HomePage from "@page/Home.tsx";
import LoginPage from "@page/Login.tsx";
import NotFoundPage from "@page/404.tsx";
import PageAccountSettings from "@page/AccountSettings.tsx";
import PageAccountChangePassword from "@page/AccountChangePassword.tsx";
import RegisterPage from "@page/Register.tsx";
import UserChatPage from "@page/UserChat.tsx";
import { PropsWithChildren } from "react";

function App() {
	return (
		<BrowserRouter>
			<Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, height: "100%" }}>
				<Drawer />
				<Main>
					<Routes>
						<Route path={"/"} element={<HomePage />} />
						<Route path={"*"} element={<NotFoundPage />} />
						<Route path={"/login"} element={<LoginPage />} />
						<Route path={"/register"} element={<RegisterPage />} />
						<Route path={"/account"} element={<PageAccountSettings />} />
						<Route path={"/account/changepassword"} element={<PageAccountChangePassword />} />
						<Route path={"/dm/:dmId"} element={<UserChatPage />} />
					</Routes>
				</Main>
			</Box>
		</BrowserRouter>
	);
}

export default App;

function Main({ children }: PropsWithChildren) {
	return (
		<Box component={"main"}
		     sx={{ flexGrow: 1, overflow: "hidden", maxHeight: { xs: "calc(100vh - 56px)", sm: "100vh" } }}>
			{children}
		</Box>
	);
}