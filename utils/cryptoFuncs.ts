import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const createPassword = (password: string) => {
	return crypto.createHash("SHA256").update(password).digest("hex");
};

export const createToken = (user: any) => {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username,
		},
		String(process.env.ACCESS_TOKEN_KEY),
		{ expiresIn: "12h" }
	);
};
