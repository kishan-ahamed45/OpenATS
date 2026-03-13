"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { ChatMessage } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function useJobChat(jobId: number, enabled: boolean) {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !jobId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_job", jobId);
    });

    socket.on("new_job_message", (msg: ChatMessage) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setLiveMessages([]);
    };
  }, [jobId, enabled]);

  const sendMessage = (senderId: number, message: string) => {
    if (!message.trim() || !socketRef.current) return;
    socketRef.current.emit("send_job_message", { jobId, senderId, message });
  };

  return { liveMessages, sendMessage };
}
