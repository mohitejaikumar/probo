"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Login() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleGoogleSignIn() {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/events",
    });

    if (result?.error) {
      toast.error("Error signing in, please try again.");
    } else {
      toast.success("Successfully signed in!");
      router.replace("/");
    }
  }

  async function handleCredentialSignIn() {
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/events",
    });

    if (result?.error) {
      toast.error("Error signing in, please try again.");
    } else {
      toast.success("Successfully signed in!");
      router.replace("/");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mohitejaikumar@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full bg-black text-white cursor-pointer"
          onClick={() => handleCredentialSignIn()}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Login"}
        </Button>
        <Button
          variant="outline"
          className="w-full bg-white cursor-pointer"
          disabled={isLoading}
          onClick={() => handleGoogleSignIn()}>
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Login with Google"
          )}
        </Button>
      </CardFooter>
      <Toaster position="top-center" />
    </Card>
  );
}
