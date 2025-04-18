import HomePage from "./home/page";
import { headers } from "next/headers";

export default function Home() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const subdomain = host.split(".")[0];

  return <HomePage subdomain={subdomain} />;
}
