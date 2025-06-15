import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function handleMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
  const jwtToken = authHeader && authHeader.split(" ")[1];
  console.log("jwtToken:", jwtToken);

  if (!jwtToken) {
    res.status(400).json({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const isValid = jwt.verify(jwtToken, process.env.JWT_SECRET!);
    if (isValid) {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Invalid Request",
    });
    return;
  }
}
