import express from "express";
import { CustomError } from "../errors/errorHandler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import { createPassword, createToken } from "../utils/cryptoFuncs";
import { User } from "../types/types";
dotenv.config();

const apiAuthRouter: express.Router = express.Router();

apiAuthRouter.use(express.json());

const upload = multer({
	dest: path.resolve(__dirname, "tmp"),
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1024 * 200, // 200 kt filesize limit  1024 * 200
	},

	fileFilter: (req, file, callback) => {
		if (["jpg", "jpeg", "png"].includes(file.mimetype.split("/")[1])) {
			callback(null, true);
		} else {
			callback(new Error());
		}
	},
}).single("profilePicture");

const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const usersCollection = database.collection<User>("users");

apiAuthRouter.post(
	"/login",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		const user = await usersCollection.findOne({
			username: req.body.username,
		});
		if (!user) next(new CustomError(401, "Invalid username"));

		let hash = createPassword(req.body.password);
		if (hash !== user?.password)
			next(new CustomError(401, "Wrong password"));

		const updatedUser = await usersCollection.findOneAndUpdate(
			{
				username: req.body.username,
			},
			{
				$set: {
					lastLogin: new Date(),
					loggedIn: true,
				},
			},
			{
				returnDocument: "after",
			}
		);
		if (!updatedUser.ok) next(new CustomError(500, "Database error"));
		let tokenPayload = {
			username: updatedUser.value?.username,
			_id: updatedUser.value?._id,
		};
		let newToken = createToken(tokenPayload);
		let userInfo = {
			username: updatedUser.value?.username,
			_id: updatedUser.value?._id,
			profilePicture: updatedUser.value?.profilePicture,
		};

		res.send({ token: newToken, userInfo: userInfo });
	}
);

apiAuthRouter.get(
	"/validate",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		let token: string = req.headers.authorization!.split(" ")[1];
		try {
			const decoded = jwt.verify(
				token,
				String(process.env.ACCESS_TOKEN_KEY)
			) as User;
			const user = await usersCollection.findOne({
				username: decoded.username,
			});

			let userInfo = {
				username: user?.username,
				_id: user?._id,
				profilePicture: user?.profilePicture,
			};
			let newToken = createToken(user); // Payload is user._id and user.username
			res.send({ token: newToken, userInfo: userInfo });
		} catch (e: any) {
			console.log(e);
			next(new CustomError(401, "Invalid token"));
		}
	}
);

apiAuthRouter.post(
	"/register",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		upload(req, res, async (err: any) => {
			let errors = {
				username: "",
				email: "",
				password: "",
				profilePicture: "",
			};
			if (err instanceof multer.MulterError) {
				errors.profilePicture = "File size must be less than 200kb";
				res.json({ errors: errors });
			} else if (err) {
				errors.profilePicture =
					"Wrong filetype. Use only jpg, jpeg or png-files.";
				res.json({ errors: errors });
			} else if (req.body.username.length < 3) {
				errors.username = "Username must be at least 3 characters";
				res.json({ errors: errors });
			} else if (req.body.password.length < 8) {
				errors.password = "Password must be at least 8 characters";
				res.json({ errors: errors });
			} else {
				try {
					const user = await usersCollection.findOne({
						username: req.body.username,
					});

					if (user) {
						next(new CustomError(401, "Username alredy in use"));
					}

					let hashedPassword = createPassword(req.body.password);

					const newUser = await usersCollection.insertOne({
						_id: new ObjectId(),
						username: req.body.username,
						password: hashedPassword,
						email: req.body.email,
						createdAt: new Date(),
						loggedIn: true,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						lastLogin: new Date(),
						profilePicture: req.file?.buffer,
					});

					if (newUser.acknowledged) {
						const user = await usersCollection.findOne({
							_id: newUser.insertedId,
						});

						let tokenPayload = {
							username: user?.username,
							_id: user?._id,
						};
						let newToken = createToken(tokenPayload);
						let userInfo = {
							username: user?.username,
							_id: user?._id,
							profilePicture: user?.profilePicture,
						};
						res.json({ token: newToken, userInfo: userInfo });
					} else {
						next(new CustomError(401, "Error in registering"));
					}
				} catch (error: any) {
					next(new Error(error));
				}
			}
		});
	}
);

export default apiAuthRouter;
