import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const API_HOST = process.env.SERVER_HOST;
const SOCKET_GW_PORT = process.env.SOCKET_GW_PORT;

if (!API_HOST || !SOCKET_GW_PORT) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_SERVER_PORT i NEXT_PUBLIC_SOCKET_GW_PORT muszą być zdefiniowane"
  );
}
const baseUrl = `http://${API_HOST}:${SOCKET_GW_PORT}`;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = `Bearer ${Cookies.get("accessToken")}`;
    socket = io(`${baseUrl}/gateway`, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        token,
      },
    });
  }
  return socket;
}
