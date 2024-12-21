import { createTheme } from "@mui/material";
import { deepPurple, purple } from "@mui/material/colors";

const theme = createTheme({
	palette: {
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