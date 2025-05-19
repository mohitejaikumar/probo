import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Route to push message
app.get("/health", async (req, res) => {
  console.log("Hi");

  res.json({ message: "I am healthy!" });
});

app.listen(3000, () => {
  console.log(`Server listening at 3000`);
});
