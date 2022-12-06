import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import Routes from "./routes/Routes";
import React from "react";
import { CssBaseline, PaletteMode } from "@mui/material";
import "./App.css";
import { UserProvider } from "./context/userContext";
import { SocketProvider } from "./context/socketContext";
import { MatchProvider } from "./context/matchContext";
import { ScoresProvider } from "./context/scoresContext";
const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === "light"
			? {
					// palette values for light mode
					primary: {
						main: grey[800],
						light: grey[400],
						dark: grey[900],
					},
					secondary: {
						main: red[800],
						light: red[400],
						dark: red[900],
					},
					text: {
						primary: grey[900],
						secondary: grey[800],
					},
			  }
			: {
					// palette values for dark mode
					primary: {
						main: grey[800],
						light: grey[400],
						dark: grey[900],
					},
					secondary: {
						main: red[800],
						light: red[400],
						dark: red[900],
					},
					text: {
						primary: "#fff",
						secondary: grey[500],
					},
			  }),
	},
});
export const ColorModeContext = React.createContext(() => {});

const App = () => {
	const [mode, setMode] = React.useState<"light" | "dark">(
		(localStorage.getItem("mode") as "light" | "dark") || "light"
	);

	// No need to memo these values. useMemo just adds a layer of complexity.
	// const colorMode = React.useMemo(
	// 	() => ({
	// 		toggleColorMode: () => {
	// 			localStorage.setItem(
	// 				"mode",
	// 				mode === "light" ? "dark" : "light"
	// 			);
	// 			setMode((prevMode) =>
	// 				prevMode === "light" ? "dark" : "light"
	// 			);
	// 		},
	// 	}),
	// 	[mode]
	// );

	// const theme = React.useMemo(
	// 	() => createTheme(getDesignTokens(mode)),
	// 	[mode]
	// );

	const toggleColorMode = () => {
		// Save mode to local storage so the preference persists
		localStorage.setItem("mode", mode === "light" ? "dark" : "light");
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	const theme = createTheme(getDesignTokens(mode));

	return (
		<ColorModeContext.Provider value={toggleColorMode}>
			<ThemeProvider theme={theme}>
				<UserProvider>
					<SocketProvider>
						<MatchProvider>
							<ScoresProvider>
								<CssBaseline />

								<Routes />
							</ScoresProvider>
						</MatchProvider>
					</SocketProvider>
				</UserProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default App;
