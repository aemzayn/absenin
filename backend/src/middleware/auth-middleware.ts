import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config, { isDev } from "../config/config";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);

      if (!decoded) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userId = (decoded as any).id;
      req.user = { id: userId };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = req.headers["x-refresh-token"];
        if (!refreshToken) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        try {
          const refreshDecoded = jwt.verify(
            refreshToken as string,
            config.REFRESH_TOKEN_SECRET
          );

          if (!refreshDecoded) {
            res.status(401).json({ message: "Unauthorized" });
            return;
          }

          const newAccessToken = jwt.sign(
            { id: (refreshDecoded as any).id },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: isDev ? "1d" : "15m" }
          );

          res.setHeader("x-access-token", newAccessToken);
          req.user = { id: (refreshDecoded as any).id };
          req.headers.authorization = `Bearer ${newAccessToken}`;
          next();
          return;
        } catch (error) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      throw new Error("Token verification failed");
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    next(error);
  }
}
