import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: "#e53935",
			dark: "#ab000d",
			light: "#ff6f60",
		},
		secondary: {
			main: "#ffc107",
			dark: "#c79100",
			light: "#fff350",
		},
		error: {
			main: red.A400,
		},
	},
});
export const theme2 = createTheme({
	palette: {
		primary: {
			light: "#757ce8",
			main: "#3f50b5",
			dark: "#002884",
			contrastText: "#fff",
		},
		secondary: {
			light: "#ff7961",
			main: "#f44336",
			dark: "#ba000d",
			contrastText: "#000",
		},
	},
});

export default theme;
