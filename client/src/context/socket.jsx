import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client"
const SocketContext = createContext(null)

export const SocketContextProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io("http://localhost:3000")
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export const useSockets = () => {
    const socket = useContext(SocketContext)
    return socket
}
