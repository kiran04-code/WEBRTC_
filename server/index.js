import express from "express"
import { Server } from "socket.io";
import http from "http"
const app = express()
// Attach Socket.io to that server
const server = http.createServer(app)

const io = new Server(server, { cors: "*" })

// WebSocket connection event
io.on("connection", (socket) => {
    console.log(`socket connected`, socket.id)
})
const port = 3000;
app.get("/", (req, res) => {
    return res.send("Server is Runing!!")
})
server.listen(port, (req, res) => {
    console.log(`Server is Runing http://localhost:${port}`)
})