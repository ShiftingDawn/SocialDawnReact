import { createTheme } from "@mui/material";
import { deepPurple, grey, purple } from "@mui/material/colors";

const theme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: purple,
				secondary: deepPurple,
				background: {
					default: grey[100],
				},
			},
		},
		dark: {
			palette: {
				primary: purple,
				secondary: deepPurple,
				background: {
					default: grey[800],
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
