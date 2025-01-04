import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { Toaster as FlashContainer } from "sonner";
import Layout from "@sys/layout.tsx";
import SessionProvider from "@sys/session.provider.tsx";
import SocketHandler from "@sys/socket.provider.tsx";
import { apollo } from "@lib/api.ts";
import theme from "@lib/theme.ts";

function render(): ReactNode {
	return (
		<StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<FlashContainer position={"bottom-center"} />
				<SessionProvider>
					<ApolloProvider client={apollo}>
						<SocketHandler>
							<BrowserRouter>
								<Layout />
							</BrowserRouter>
						</SocketHandler>
					</ApolloProvider>
				</SessionProvider>
			</ThemeProvider>
		</StrictMode>
	);
}

createRoot(document.getElementById("root")!).render(render());
