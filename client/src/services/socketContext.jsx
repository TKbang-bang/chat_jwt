import { createContext, useContext, useEffect, useState } from "react";
import socketService from "./socket.service";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const init = async () => {
      const s = await socketService();
      if (s) setSocket(s);
    };

    init();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
