import { Request, Response } from "express";
import { ZodError } from "zod";
import { loginService, signupService } from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      subDomain,
      organizationName,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !subDomain ||
      !organizationName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await signupService(req.body);
    res
      .status(201)
      .json({ message: "User and Organization created successfully", user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((err) => err.message) });
    }
    res.status(401).json({ message: "Invalid email or password" });
  }
};
