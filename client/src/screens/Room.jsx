import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSockets } from '../context/socket'
import Reactplayer from "react-player"
import peer from '../service/peer'
const Room = () => {
  const socket = useSockets()
  const { id } = useParams()
  const [remoteSocketId, setRemotesockId] = useState(null)
  const [mystrem, setMystream] = useState(null)
  const [remotestrem, setRemoteStrem] = useState(null)
  const handlevent = useCallback(({ email, id }) => {
    console.log(`Email${email} joined Room`)
    setRemotesockId(id)
  }, [])

  const handleCallUser = useCallback(async () => {
    const steram = await navigator.mediaDevices.getUserMedia({ Audio: true, video: true })
    const offer = await peer.getOffer()
    socket.emit("user:call", { to: remoteSocketId, offer })
    setMystream(steram)
  }, [mystrem, socket])
  const hnadleIncomingCall = useCallback(async ({ from, offer }) => {
    setRemotesockId(from)
    console.log(`incoming Called from:${from}`, offer)
    const steram = await navigator.mediaDevices.getUserMedia({ Audio: true, video: true })
    setMystream(steram)
    const ans = await peer.getAnswer(offer)
    console.log(ans)
    socket.emit("call:accept",{to:from,ans})
  }, [])

 const handleCallAccepted = useCallback(async({from ,ans})=>{
  await peer.setLocalDescription(ans)
  console.log("Called Accepted!")

  for(const track of mystrem.getTracks()){
    peer.peer.addTrack(track,mystrem)
  }
 },[mystrem])
 useEffect(()=>{
  peer.peer.addEventListener("track",async (ev) =>{
  const Remotstream = ev.streams
  setRemoteStrem(Remotstream[0])
  })
 },[])
  const handleNegoration = useCallback(async()=>{
    const offer = await peer.getOffer();
    socket.emit("peer:negotiatitneded",{to:remoteSocketId,offer})
  },[])
 useEffect(()=>{
    peer.peer.addEventListener("negotiationneed",handleNegoration)
  return ()=>{  
    peer.peer.removeEventListener("negotiationneed",handleNegoration)
  }
 },[handleNegoration])
 const haadleIncomingCall = useCallback(async({from,offer})=>{
 const ans = await peer.getAnswer(offer)
 socket.emit("peer:nego:done",{to:from,ans})
 },[])
 const haadleIncomingCallfinal = useCallback(async({ans})=>{
 await peer.setLocalDescription(ans)
 },[])
  useEffect(() => {
    socket.on("user:joined", handlevent)
    socket.on("incoming:call", hnadleIncomingCall)
    socket.on("call:accepted", handleCallAccepted)
    socket.on("peer:negotiatitneded", haadleIncomingCall)
    socket.on("peer:nego:done", haadleIncomingCallfinal)
    return () => {
      socket.off("user:joined", handlevent)
      socket.off("incoming:call", hnadleIncomingCall)
      socket.off("call:accepted", handleCallAccepted)
      socket.off("peer:nego:done", haadleIncomingCallfinal)
    }
  }, [socket, handlevent, hnadleIncomingCall])
  const videoRef = useRef(null)
  const videoRef2 = useRef(null)
  if (videoRef.current) {
    videoRef.current.srcObject = mystrem
  }
  if (videoRef2.current) {
    videoRef2.current.srcObject = remotestrem
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Room: <span className="text-blue-600">{id}</span>
        </h1>
        <h4 className={`text-2xl font-semibold ${remoteSocketId ? "text-green-600" : "text-red-500"
          }`}>
          {remoteSocketId
            ? `Connected Email ID: ${remoteSocketId}`
            : "No One in Room"}
        </h4>
        <div className="mt-6">
          {
            remoteSocketId ? <button onClick={handleCallUser} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
              Make Call
            </button> : null
          }
        </div>
      </div>
      <div className='flex gap-2'>

        {mystrem && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="mt-8 w-80 rounded-xl shadow-lg border-4 border-white"
            ></video>

            <h1 className='text-center text-2xl'>You</h1>
          </div>
        )}
        {remotestrem && (
          <div>
            <video
              ref={videoRef2}
              autoPlay
              playsInline
              muted
              className="mt-8 w-80 rounded-xl shadow-lg border-4 border-white"
            ></video>

            <h1 className='text-center text-2xl'>Remote stream</h1>
          </div>
        )}


      </div>
    </div>

  )
}

export default Room
