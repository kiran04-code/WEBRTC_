import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Lobby from './screens/Lobby'
const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Lobby/>} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
