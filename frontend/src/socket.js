import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5001";

export const socket = io(ENDPOINT, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
