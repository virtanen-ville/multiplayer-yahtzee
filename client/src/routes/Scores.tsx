import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import BackgroundImage from "../assets/yahtzee.png";
import { useTheme } from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { ObjectId } from "bson";

interface scoreWithEndTime {
	_id: ObjectId;
	username: string;
	total: number;
	endTime: Date;
}

const Scores = ({ headline, apiRoute }: any) => {
	const [scores, setScores] = useState<scoreWithEndTime[]>([]);
	const theme = useTheme();

	// Fetch top scores from backend
	useEffect(() => {
		let controller = new AbortController();

		(async () => {
			try {
				const response = await fetch(apiRoute, {
					method: "GET",
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				});
				if (response.status === 200) {
					let data = await response.json();
					setScores(data);
				} else {
					console.log(
						"Not authenticated! Server response: ",
						response
					);
				}
			} catch (err) {
				console.log(err);
			}
		})();

		return () => {
			// cleanup
			controller?.abort();
		};
	}, [apiRoute]);

	return (
		<>
			<NavigationBar headline={headline} />

			<Box
				sx={{
					display: "flex",
					width: "100vw",
					height: "100vh",
					backgroundImage:
						theme.palette.mode === "light"
							? "linear-gradient(white, red)"
							: "linear-gradient(black, red)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container
					maxWidth="md"
					sx={{
						padding: "3rem",
						height: "100%",
					}}
				>
					<Box
						sx={{
							backgroundImage: `url(${BackgroundImage})`,
							backgroundRepeat: "no-repeat",
							backgroundSize: "100%",
							width: "100%",
							height: "100%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",

								height: "100%",
							}}
						>
							{scores.length > 0 ? (
								<TableContainer
									component={Paper}
									sx={{ opacity: "0.9" }}
								>
									<Table aria-label="top-scores-table">
										<TableHead>
											<TableRow
												sx={{
													backgroundColor:
														"secondary.light",
												}}
											>
												<TableCell>Player</TableCell>
												<TableCell>Date</TableCell>

												<TableCell align="right">
													Score
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{scores.map((score, idx) => (
												<TableRow key={idx}>
													<TableCell>
														{score.username}
													</TableCell>
													<TableCell>
														{score.endTime
															? new Date(
																	score.endTime
															  ).toLocaleString()
															: "N/A"}
													</TableCell>

													<TableCell align="right">
														{score.total}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							) : null}
						</Box>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Scores;
