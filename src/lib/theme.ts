import { createTheme } from "@mui/material";
import { deepPurple, purple } from "@mui/material/colors";

const theme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: purple,
				secondary: deepPurple,
				background: {
					default: "#fdfdfd",
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: purple[200],
				},
				secondary: deepPurple,
				background: {
					default: "#121212",
				},
			},
		},
	},
	typography: {
		fontFamily: "Raleway,serif",
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"@global": { body: { fontFamily: "Raleway,serif" } },
			},
		},
	},
});

export default theme;
