import { createTheme } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";
import { deepPurple, grey, purple } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		background: {
			default: grey[100],
		},
		primary: purple,
		secondary: deepPurple,
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