import { Request, Response } from "express";

export const handleIncomingMessage = async (req: Request, res: Response) => {
  const incoming = req.body;

  // Save to DB, create message entry, etc.
  // You can check incoming.to/from and text content
};
