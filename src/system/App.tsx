import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "@page/Home.tsx";
import LoginPage from "@page/Login.tsx";
import NavBar from "@sys/NavBar.tsx";
import NotFoundPage from "@page/404.tsx";
import PageAccountSettings from "@page/AccountSettings.tsx";
import PageAccountChangePassword from "@page/AccountChangePassword.tsx";

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<Box sx={{ mt: 1 }}>
				<Routes>
					<Route index element={<HomePage />} />
					<Route path={"*"} element={<NotFoundPage />} />
					<Route path={"/login"} element={<LoginPage />} />
					<Route path={"/account"} element={<PageAccountSettings />} />
					<Route path={"/account/changepassword"} element={<PageAccountChangePassword />} />
				</Routes>
			</Box>
		</BrowserRouter>
	);
}

export default App;