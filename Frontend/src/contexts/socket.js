import { createContext } from "react";
import socketio from "socket.io-client";
import configData from "./../config.json";

const SOCKET_URL = configData.url.baseURL;

export const socket = socketio.connect(SOCKET_URL);
socket.on("connect", () => {
  console.log("Socket Connected!");
});
export const SocketContext = createContext();
