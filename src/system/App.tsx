import { AppBar, Button, Toolbar } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "@page/Home.tsx";

function App() {
	return (
		<>
			<AppBar position={"sticky"} sx={{ flexGrow: 1 }}>
				<Toolbar component={"nav"}>
					<Button color={"inherit"}>Login</Button>
				</Toolbar>
			</AppBar>
			<BrowserRouter>
				<Routes>
					<Route index element={<HomePage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;