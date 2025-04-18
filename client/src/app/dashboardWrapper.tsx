"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, {
  useAppDispatch,
  useAppSelector,
} from "@/app/reduxStoreProvider";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RootState } from "./reduxStoreProvider";
import { setLoading } from "@/state/loadingSlice";
import { Loader2 } from "lucide-react";
import LoginPage from "./login/page";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state: RootState) => state.loading.isLoading
  );

  useEffect(() => {
    dispatch(setLoading(false)); // Stop loading when page updates
  }, [pathname, dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />{" "}
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {isLoading ? <Loading /> : <>{children}</>}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = Cookies.get("auth-token");
  useEffect(() => {
    console.log("token", token);
    setIsAuthenticated(!!token);
  }, [token]);

  // Optional: Show a loader while authentication is being checked
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  console.log("isAuthenticated", isAuthenticated);

  return (
    <StoreProvider>
      {isAuthenticated ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <LoginPage />
      )}
    </StoreProvider>
  );
};

export default DashboardWrapper;
