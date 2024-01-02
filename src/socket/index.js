import { io } from "socket.io-client";

const SOCKET_SERVER =
  process.env.NODE_ENV === "production"
    ? "https://drawing-board-server-ydb1.onrender.com"
    : "http://localhost:5000";

export const socket = io(SOCKET_SERVER);
