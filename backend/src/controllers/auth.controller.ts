import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../database";
import config, { isDev } from "../config/config";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name } = req.body;

    const similarUser = await db.user.findUnique({
      where: { email },
    });

    if (similarUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: isDev ? "1d" : "15m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      config.REFRESH_TOKEN_SECRET,
      {
        expiresIn: isDev ? "30d" : "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
