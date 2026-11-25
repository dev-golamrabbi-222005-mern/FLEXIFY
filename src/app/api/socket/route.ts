import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";

declare global {
  var io: Server | undefined;
}

export const GET = (req: NextRequest) => {
  return NextResponse.json({ status: "Socket endpoint alive" });
};

export const POST = (req: NextRequest) => {
  // Init Socket.io only once
  if (!globalThis.io) {
    const io = new Server({
      cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected", socket.id);

      socket.on("join_room", (room) => socket.join(room));
      socket.on("send_message", (msg) => {
        const roomId = `${msg.coachId}_${msg.userId}`;
        io.to(roomId).emit("receive_message", msg);
      });

      socket.on("disconnect", () =>
        console.log("Socket disconnected", socket.id),
      );
    });

    globalThis.io = io; // store globally
  }

  return NextResponse.json({ status: "Socket server initialized" });
};
