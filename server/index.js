import express from "express"
import { Server } from "socket.io";
import http from "http"
const app = express()
// Attach Socket.io to that server
const server = http.createServer(app)

const io = new Server(server, { cors: "*" })

// WebSocket connection event
const EmailToIdMap = new Map();
const IdToEmailMap = new Map();
io.on("connection", (socket) => {
    console.log(`socket connected`, socket.id)
    socket.on("room:join", (data) => {
        const { email, roomid } = data;
        EmailToIdMap.set(email, socket.id)
        IdToEmailMap.set(socket.id, email)
        socket.to(roomid).emit("user:joined", { email, id: socket.id })
        socket.join(roomid)
        io.to(socket.id).emit("room:join", data)
    })
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", { from: socket.id, offer })
    })
    socket.on("call:accept", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans })
    })
    socket.on("peer:negotiatitneded", ({ to, offer }) => {
        io.to(to).emit("peer:negotiatitneded", { from: socket.id, offer })
    })
    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:done", { ans })
    })
})
const port = 3000;
app.get("/", (req, res) => {
    return res.send("Server is Runing!!")
})
server.listen(port, (req, res) => {
    console.log(`Server is Runing http://localhost:${port}`)
})