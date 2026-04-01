// lib/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000"); // same port
export default socket;
