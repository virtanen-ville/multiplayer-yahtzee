import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Play from "./Play";
import { PlaymodeProvider } from "src/context/playmodeContext";
import Scores from "./Scores";
import { io } from "socket.io-client";
import { useSetUser } from "../context/userContext";
import { useSetSocket } from "../context/socketContext";

const Routes = () => {
	const setUser = useSetUser();
	const setSocket = useSetSocket();
	const [loading, setLoading] = useState(true);

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<PlaymodeProvider>
					<Home loading={loading} />
				</PlaymodeProvider>
			),
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Register />,
		},
		{
			path: "/top-scores",
			element: (
				<Scores headline={"Top Scores"} apiRoute={"api/scores/top"} />
			),
		},
		{
			path: "/latest-scores",
			element: (
				<Scores
					headline={"Latest Scores"}
					apiRoute={"api/scores/latest"}
				/>
			),
		},
		{
			path: "/my-scores",
			element: (
				<Scores headline={"My Scores"} apiRoute={"api/scores/my"} />
			),
		},
		{
			path: "/play",
			element: (
				<PlaymodeProvider>
					<Play />
				</PlaymodeProvider>
			),
		},
	]);

	// Check if token is valid and set the user and socket. We do this here so that the useeffect is run in every route where reload happens.
	useEffect(() => {
		let controller = new AbortController();

		(async () => {
			try {
				const response = await fetch("/api/auth/validate", {
					method: "GET",
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				});
				console.log("response: ", response);

				if (response.status === 200) {
					console.log("User validated - set the socket and user");
					let { token, userInfo } = await response.json();
					localStorage.setItem("token", token);
					setUser(userInfo);
					let newSocket = io({
						auth: {
							token: localStorage.getItem("token"),
						},
					});
					setSocket(newSocket);
					setLoading(false);
				} else {
					console.log(
						"Not authenticated! Server response: ",
						response
					);
					localStorage.removeItem("token");
					setUser(null);
					setLoading(false);
				}
			} catch (err) {
				console.log(err);
				localStorage.removeItem("token");
				setUser(null);
			}
		})();

		return () => {
			// cleanup
			controller?.abort();
		};
	}, [setSocket, setUser]);

	return <RouterProvider router={router} />;
};

export default Routes;
