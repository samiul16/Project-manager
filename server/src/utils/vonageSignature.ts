import jwt from "jsonwebtoken";
import { IncomingHttpHeaders } from "http";

export const verifyVonageJWT = (headers: IncomingHttpHeaders): boolean => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || typeof authHeader !== "string") return false;

  const token = authHeader.replace("Bearer ", "");
  const secret = process.env.VONAGE_JWT_SECRET;
  if (!secret) throw new Error("VONAGE_JWT_SECRET is not defined");

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    console.log("✅ JWT verified:", decoded);
    return true;
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return false;
  }
};
