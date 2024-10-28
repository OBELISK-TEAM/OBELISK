import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
/***
 note: the following code is on the client side, that is why server host must be different,
 remember that the browser doesn't have access to Docker's internal DNS.
***/
const API_HOST = process.env.NEXT_GW_SERVER_HOST;
const SOCKET_GW_PORT = process.env.SOCKET_GW_PORT;

const baseUrl = `http://${API_HOST}:${SOCKET_GW_PORT}`;

export function getSocket(socket: Socket | null): Socket {
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
