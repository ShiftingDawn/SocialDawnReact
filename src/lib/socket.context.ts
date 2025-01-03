import { Socket } from "socket.io-client";
import { createContext, useContext } from "react";

const SocketContext = createContext<Socket | null>(null);
export const SocketProvider = SocketContext.Provider;

export const useSocket = () => useContext(SocketContext);