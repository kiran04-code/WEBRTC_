import React, { useEffect } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { useSockets } from '../context/socket'
import { useNavigate } from 'react-router-dom'

const Lobby = () => {

    const socket = useSockets()
    const [email, setemail] = useState("")
    const [roomid, setRoomId] = useState("")
    const navigate = useNavigate()
    const data = new FormData()
    data.append("email:", email)
    data.append("RoomId", roomid)
    const handleonsubmit = useCallback(
        (e) => {
            e.preventDefault()
            socket.emit("room:join", { email, roomid })
            setRoomId("")
            setemail("")
        },
        [data, socket]
    )
    const handleroomJoine = useCallback((data) => {
        const { email, roomid } = data
        navigate(`/room/${roomid}`)
        
    }, [])
    useEffect(() => {
        socket.on('room:join', handleroomJoine)
        return () => {
            socket.off("room:join", handleroomJoine)
        }
    }, [socket])
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-10 w-full max-w-lg">

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Enter Lobby
                </h1>

                <form onSubmit={handleonsubmit} className="space-y-7">


                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-700 tracking-wide">
                            Email ID
                        </label>
                        <input
                            onChange={(e) => setemail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Enter Email"
                            className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 
                                       focus:ring-2 focus:ring-indigo-300 outline-none"
                        />
                    </div>

                    {/* Room */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-700 tracking-wide">
                            Room ID
                        </label>
                        <input
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomid}
                            type="text"
                            placeholder="Enter Room ID"
                            className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 
                                       focus:ring-2 focus:ring-indigo-300 outline-none"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg 
                                   hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
                    >
                        Join Lobby
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Lobby
