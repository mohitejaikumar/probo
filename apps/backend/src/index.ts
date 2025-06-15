import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRouter from "./router/events.js";
import userRouter from "./router/user.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/v1/event", eventRouter);
app.use("/v1/user", userRouter);

// Route to push message
app.get("/health", async (req, res) => {
  console.log("Hi");

  res.json({ message: "I am healthy!" });
});

app.listen(3001, () => {
  console.log(`Server listening at 3000`);
});
