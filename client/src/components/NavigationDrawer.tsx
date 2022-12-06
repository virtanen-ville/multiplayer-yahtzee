import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Drawer, IconButton, SwipeableDrawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavigateFunction, useNavigate } from "react-router";
import { useUser, useSetUser } from "../context/userContext";

const NavigationDrawer = () => {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const toggleDrawer = (open: boolean) => setDrawerOpen(open);
	const navigate: NavigateFunction = useNavigate();
	const user = useUser();
	const setUser = useSetUser();

	let menuItems = [
		"Home",
		"My Scores",
		"Top Scores",
		"Latest Scores",
		"Log Out",
	];
	const logOut = (): any => {
		localStorage.removeItem("token");
		setUser(null);
	};
	const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		toggleDrawer(false);
		if (event.currentTarget.textContent === "Log Out") {
			logOut();
		} else if (event.currentTarget.textContent === "Home") {
			navigate("/");
		} else {
			let link = event.currentTarget.textContent
				?.toLowerCase()
				.replaceAll(" ", "-");
			navigate(`/${link}`);
		}
	};
	return (
		<>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				edge="start"
				onClick={() => {
					toggleDrawer(true);
				}}
				sx={{ position: "absolute", left: "5", top: "50%" }}
			>
				<ExpandLessIcon sx={{ rotate: "90deg" }} />
				{/* <MenuIcon /> */}
			</IconButton>
			<Drawer
				// disableDiscovery={true}
				// disableSwipeToOpen={false}
				// onOpen={() => toggleDrawer(true)}
				// swipeAreaWidth={150}
				// ModalProps={{
				// 	keepMounted: false,
				// }}

				anchor="left"
				open={drawerOpen}
				onClose={() => toggleDrawer(false)}
			>
				<Box
					sx={{
						width: 200,
					}}
					role="navigation"
					onClick={() => toggleDrawer(false)}
					onKeyDown={() => toggleDrawer(false)}
				>
					<List>
						{user ? (
							menuItems.map((text, index) => (
								<ListItem key={text} disablePadding>
									<ListItemButton
										onClick={handleClickUserMenu}
									>
										<ListItemIcon>
											{text === "Home" ? (
												<HomeIcon />
											) : text === "My Scores" ? (
												<AccountCircleIcon />
											) : text === "Top Scores" ? (
												<StarIcon />
											) : text === "Latest Scores" ? (
												<AccessTimeIcon />
											) : text === "Log Out" ? (
												<LogoutIcon />
											) : null}
										</ListItemIcon>
										<ListItemText primary={text} />
									</ListItemButton>
								</ListItem>
							))
						) : (
							<ListItem disablePadding>
								<ListItemButton
									onClick={() => {
										navigate("/login");
									}}
								>
									<ListItemIcon>
										<LoginIcon />
									</ListItemIcon>
									<ListItemText primary="Log In" />
								</ListItemButton>
							</ListItem>
						)}
					</List>
				</Box>
			</Drawer>
		</>
	);
};

export default NavigationDrawer;
