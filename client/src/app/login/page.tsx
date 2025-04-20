"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/Auth/LoginForm";
import { SignupForm } from "@/components/Auth/SignupForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/pexels-artempodrez-5716001.jpg"
          alt="Authentication"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.8 }}
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <div className="mt-6 relative min-h-[400px]">
              <TabsContent
                value="login"
                className="absolute top-0 left-0 right-0 transition-opacity duration-300"
              >
                <LoginForm />
              </TabsContent>
              <TabsContent
                value="signup"
                className="absolute top-0 left-0 right-0 transition-opacity duration-300"
              >
                <SignupForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
