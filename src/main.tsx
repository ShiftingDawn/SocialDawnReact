import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import App from "@sys/App.tsx";
import theme from "@lib/theme.ts";
import UserWrapper from "@sys/User.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<GlobalStyles styles={{ body: { backgroundColor: theme.palette.background.default } }} />
			<Toaster position={"bottom-center"} />
			<UserWrapper>
				<App />
			</UserWrapper>
		</ThemeProvider>
	</StrictMode>,
);