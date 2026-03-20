import express from "express";
import dotenv from "dotenv/config.js";
import cors from "cors";

import initializeDB from "./db.js";
import AuthRouter from "./routes/authRouter.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 4000;

initializeDB();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  }),
);
app.use(express.json());

app.use("/auth", AuthRouter);

app.get("/ping", (req, res) => {
  res.json("pong");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
