import React from 'react'
import AirQualityApp from './ApiQulityApp'
import Navbar from './Components/Navbar'
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div>
      <Navbar/>
      <AirQualityApp/>
      <Toaster/>
    </div>
  )
}
