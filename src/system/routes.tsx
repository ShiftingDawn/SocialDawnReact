import { ReactNode } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { useSession } from "@lib/session.context.ts";
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

			<Route path={"/login"} element={noAuth(<LoginPage />, "/")} />
			<Route path={"/register"} element={noAuth(<RegisterPage />, "/")} />
			<Route path={"/account"} element={withAuth(<Outlet />, "/login")}>
				<Route index element={<PageAccountSettings />} />
				<Route path={"changepassword"} element={<PageAccountChangePassword />} />
			</Route>

			<Route path={"/dm/:friendId"} element={withAuth(<PageDM />, "/")} />
		</Routes>
	);
}

function withAuth(node: ReactNode, anonHref: string): ReactNode {
	const { state } = useSession();
	return state !== "authenticated" ? <Navigate to={anonHref} replace /> : node;
}

function noAuth(node: ReactNode, authHref: string): ReactNode {
	const { state } = useSession();
	return state === "authenticated" ? <Navigate to={authHref} replace /> : node;
}
