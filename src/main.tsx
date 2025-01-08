import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { StompSessionProvider } from "react-stomp-hooks";
import { Toaster as FlashContainer } from "sonner";
import Layout from "@sys/layout.tsx";
import SessionProvider from "@sys/session.provider.tsx";
import { apollo } from "@lib/api.ts";
import { stompUrl } from "@lib/stomp.ts";
import theme from "@lib/theme.ts";

function render(): ReactNode {
	return (
		<StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<FlashContainer position={"bottom-center"} />
				<SessionProvider>
					<ApolloProvider client={apollo}>
						<StompSessionProvider url={stompUrl}>
							<BrowserRouter>
								<Layout />
							</BrowserRouter>
						</StompSessionProvider>
					</ApolloProvider>
				</SessionProvider>
			</ThemeProvider>
		</StrictMode>
	);
}

createRoot(document.getElementById("root")!).render(render());
