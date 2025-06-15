"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState(new Date());
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "unauthenticated") {
    router.push("/auth/signin");
  }

  async function handleSubmit() {
    if (title.length < 2 || description.length < 2) {
      toast.error(
        "Title should contain at least 2 char and description at least 2 char"
      );
    }
    setIsLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/event`,
        {
          title: title,
          description: description,
          endTime: endTime.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.jwtToken}`,
          },
        }
      );
      toast.success("Event created successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error while submitting...");
    }
    setIsLoading(false);
  }

  return (
    <div className="w-screen h-screen bg-[#F3F3F3] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Event</CardTitle>
          <CardDescription>
            Lets trade our opinion, Why to waste your opinion, when you can
            trade on them .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Category of Event ex: Cricket, Blockchain, Politics"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  placeholder="Description of event..."
                  className="max-h-[100px]"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="date">End Time</Label>
                </div>
                <Input
                  id="end-time"
                  type="datetime-local"
                  required
                  value={endTime.toISOString().slice(0, 16)}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setEndTime(new Date(e.target.value));
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full bg-black text-neutral-300 cursor-pointer"
            disabled={isLoading}
            onClick={() => handleSubmit()}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster position="top-center" />
    </div>
  );
}
