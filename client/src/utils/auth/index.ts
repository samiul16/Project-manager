"use server";
import { cookies } from "next/headers";

export async function getAuthToken() {
  return cookies().get("auth-token")?.value || null;
}

export async function setAuthToken(token: string) {
  await cookies().set("auth-token", token);
  return true;
}

export async function removeAuthToken() {
  await cookies().delete("auth-token");
  return true;
}
