import { Route, Routes } from "react-router";
import PageAccountSettings from "@page/account/account_settings.page.tsx";
import PageAccountChangePassword from "@page/account/change_password.page.tsx";
import LoginPage from "@page/account/login.page.tsx";
import RegisterPage from "@page/account/register.page.tsx";
import PageDM from "@page/dm/dm.page.tsx";
import HomePage from "@page/index.page.tsx";
import NotFoundPage from "@page/not_found.page.tsx";

export default function () {
	return (
		<Routes>
			<Route path={"/"} element={<HomePage />} />
			<Route path={"*"} element={<NotFoundPage />} />
			<Route path={"/login"} element={<LoginPage />} />
			<Route path={"/register"} element={<RegisterPage />} />
			<Route path={"/account"} element={<PageAccountSettings />} />
			<Route path={"/account/changepassword"} element={<PageAccountChangePassword />} />
			<Route path={"/dm/:friendId"} element={<PageDM />} />
		</Routes>
	);
}
