// import express, { NextFunction, Request, Response } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { ErrorMiddleWare } from "./middleware/error";
// import userRouter from "./routes/user.route";
// import courseRouter from "./routes/course.route";
// import orderRouter from "./routes/order.route";
// import notificationRouter from "./routes/notification.route";
// import analyticsRouter from "./routes/analytics.route";
// import layoutRouter from "./routes/layout.route";
// import rateLimit from "express-rate-limit";

// require("dotenv").config();

// export const app = express();

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000,
// 	max: 100,
// 	standardHeaders: "draft-7",
// 	legacyHeaders: false,
// });

// app.use(express.json({ limit: "50mb" }));

// app.use(cookieParser());

// // app.use(
// //   cors({
// //     origin: process.env.ORIGIN || process.env.ORIGIN_DEPLOYED,
// //     credentials: true,
// //   })
// // );
// app.use(
// 	cors({ origin: ["https://learnifypro-lms.vercel.app"], credentials: true })
// );

// app.use(
// 	"/api/v1",
// 	userRouter,
// 	courseRouter,
// 	orderRouter,
// 	notificationRouter,
// 	analyticsRouter,
// 	layoutRouter
// );

// app.get("/test", (req: Request, res: Response, next: NextFunction) => {
// 	res.status(200).json({
// 		success: true,
// 		message: "API is working",
// 	});
// });

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
// 	const err = new Error(`Route ${req.originalUrl} not found`) as any;
// 	err.statusCode = 404;
// 	next(err);
// });

// app.use(limiter);

// app.use(ErrorMiddleWare);

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleWare } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

export const app = express();

// Rate limiting middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware to parse JSON and cookies
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Configure CORS
const allowedOrigins = process.env.ORIGIN
	? JSON.parse(process.env.ORIGIN)
	: ["https://learnifypro-lms.vercel.app"];
app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps, curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);

// Registering routes
app.use(
	"/api/v1",
	userRouter,
	courseRouter,
	orderRouter,
	notificationRouter,
	analyticsRouter,
	layoutRouter
);

// Test route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API is working",
	});
});

// Handle undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

// Error handling middleware
app.use(ErrorMiddleWare);
