import { Request, Response } from "express";

export const inboundService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const authHeaderBase64 = authHeader.split(" ")[1];

    const decodedAuthHeader = Buffer.from(
      authHeaderBase64,
      "base64"
    ).toString();

    const [username, password] = decodedAuthHeader.split(":");

    if (
      username !== process.env.VONAGE_WEBHOOK_USERNAME ||
      password !== process.env.VONAGE_WEBHOOK_PASSWORD
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ message: "Message received" });
  } catch (error) {
    console.error("Error in inbound service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
