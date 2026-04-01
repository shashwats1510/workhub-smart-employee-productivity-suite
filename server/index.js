import express from "express";
import dotenv from "dotenv/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import initializeDB from "./db.js";
import authRouter from "./routes/authRouter.js";
import infoRouter from "./routes/infoRouter.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 4000;

initializeDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  }),
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/info", infoRouter);

app.get("/ping", (req, res) => {
  res.json("pong");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
