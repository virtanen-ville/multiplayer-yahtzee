import express from "express";
import path from "path";
// import apiPhotosRouter from "./routes/apiPhotos";
// import apiCommentsRouter from "./routes/apiComments";
// import apiAuthRouter from "./routes/apiAuth";
//import { errorHandler } from "./errors/errorHandler.ts";
import dotenv from "dotenv";
//import checkToken from "./middleware/checkToken.ts";
// import apiFavoritesRouter from "./routes/apiFavorites";
import * as http from "http";
//import * as WebSocket from "ws";
import WebSocket, { WebSocketServer } from "ws";

dotenv.config();
/*
const app: express.Application = express();

const PORT: number = Number(process.env.PORT);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(
	bodyParser.urlencoded({
		limit: "5mb",
		extended: true,
		parameterLimit: 50000,
	})
);

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/auth", apiAuthRouter);

app.use("/api/photos", apiPhotosRouter);

app.use("/api/comments", checkToken, apiCommentsRouter);

app.use("/api/favorites", checkToken, apiFavoritesRouter);

app.use(errorHandler);

app.use(
	(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (!res.headersSent) {
			res.status(404).json({ viesti: "Virheellinen reitti" });
		}

		next();
	}
);
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		res.locals.error = err;
		const status = err.status || 500;
		res.status(status);
	}
);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});



*/
const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
	//connection is up, let's add a simple simple event
	ws.on("message", (message) => {
		//log the received message and send it back to the client
		console.log("received: %s", JSON.stringify(message));
		// ws.send(`Hello, you sent -> ${message}`);
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
				console.log("message", JSON.stringify(message));
			}
		});

		//send immediatly a feedback to the incoming connection
		//ws.send("Hi there, I am a WebSocket server");
	});
});

//start our server
server.listen(process.env.PORT || 8999, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});
