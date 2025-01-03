import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster as FlashContainer } from "sonner";
import Layout from "@sys/layout.tsx";
import SessionProvider from "@sys/session.provider.tsx";
import SocketHandler from "@sys/socket.provider.tsx";
import theme from "@lib/theme.ts";

function render(): ReactNode {
	return (
		<StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<FlashContainer position={"bottom-center"} />
				<SessionProvider>
					<SocketHandler>
						<BrowserRouter>
							<Layout />
						</BrowserRouter>
					</SocketHandler>
				</SessionProvider>
			</ThemeProvider>
		</StrictMode>
	);
}

createRoot(document.getElementById("root")!).render(render());
