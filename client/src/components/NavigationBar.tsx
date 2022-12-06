import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { NavigateFunction, useNavigate } from "react-router";
import { ButtonBase, Chip, ListItemIcon, useTheme } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser, useSetUser } from "../context/userContext";
import { ColorModeContext } from "src/App";
import LogoImage from "../assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const NavigationBar = ({ headline }: any): React.ReactElement => {
	const user = useUser();
	const setUser = useSetUser();
	const theme = useTheme();
	const toggleColorMode = React.useContext(ColorModeContext);

	let menuItems = [
		"Home",
		"My Scores",
		"Top Scores",
		"Latest Scores",
		"Log Out",
	];

	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const navigate: NavigateFunction = useNavigate();

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	const logOut = (): any => {
		localStorage.removeItem("token");
		setUser(null);
	};

	const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		handleCloseUserMenu();
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

	let imageUrl;
	if (user && user.profilePicture) {
		imageUrl = "data:image/jpeg;base64," + user.profilePicture;
	}

	return (
		<AppBar position="sticky">
			<Container>
				<Toolbar disableGutters>
					<ButtonBase
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
							navigate("/");
						}}
					>
						<Avatar
							alt="User"
							src={LogoImage}
							sx={{
								width: { xs: 24, md: 48 },
								height: { xs: 24, md: 48 },
								marginRight: 2,
							}}
						/>
						<Typography variant="body1">
							Welcome {user ? user.username : "Guest"}!
						</Typography>
					</ButtonBase>

					<Box
						display="flex"
						justifyContent="center"
						sx={{
							flexGrow: 1,
						}}
					>
						<Typography sx={{ margin: "auto" }} variant="h6">
							{headline}
						</Typography>
					</Box>

					<Box
						display="flex"
						justifyContent="right"
						sx={{
							alignItems: "center",
						}}
					>
						{user ? (
							<>
								<Chip
									clickable
									sx={{ display: { xs: "none", md: "flex" } }}
									icon={<LogoutIcon color="success" />}
									label="Log Out"
									onClick={logOut}
									color="primary"
								/>
								<Chip
									clickable
									size="small"
									sx={{ display: { xs: "flex", md: "none" } }}
									icon={<LogoutIcon color="success" />}
									onClick={logOut}
									color="primary"
								/>
							</>
						) : (
							<>
								<Chip
									clickable
									sx={{ display: { xs: "none", md: "flex" } }}
									icon={<LoginIcon color="success" />}
									label="Log In"
									onClick={() => {
										navigate("/login");
									}}
									color="primary"
								/>
								<Chip
									clickable
									size="small"
									sx={{ display: { xs: "flex", md: "none" } }}
									icon={<LoginIcon color="success" />}
									label="Log In"
									onClick={() => {
										navigate("/login");
									}}
									color="primary"
								/>
							</>
						)}
						<IconButton onClick={handleOpenUserMenu}>
							<Avatar
								alt="User"
								src={imageUrl}
								sx={{
									width: { xs: 24, md: 48 },
									height: { xs: 24, md: 48 },
								}}
							/>
						</IconButton>
						<IconButton
							sx={{ ml: 1 }}
							onClick={toggleColorMode}
							color="inherit"
						>
							{theme.palette.mode === "dark" ? (
								<Brightness7Icon />
							) : (
								<Brightness4Icon />
							)}
						</IconButton>
						<Menu
							sx={{ marginTop: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{user ? (
								menuItems.map((menuItem) => (
									<MenuItem
										key={menuItem}
										onClick={handleClickUserMenu}
									>
										<ListItemIcon>
											{menuItem === "Home" ? (
												<HomeIcon />
											) : menuItem === "My Scores" ? (
												<AccountCircleIcon />
											) : menuItem === "Top Scores" ? (
												<StarIcon />
											) : menuItem === "Latest Scores" ? (
												<AccessTimeIcon />
											) : menuItem === "Log Out" ? (
												<LogoutIcon />
											) : null}
										</ListItemIcon>
										<Typography textAlign="center">
											{menuItem}
										</Typography>
									</MenuItem>
								))
							) : (
								<MenuItem
									onClick={() => {
										navigate("/login");
									}}
								>
									<Typography textAlign="center">
										Log In
									</Typography>
								</MenuItem>
							)}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default NavigationBar;
