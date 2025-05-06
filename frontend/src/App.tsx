// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import CardDesigner from "./pages/CardDesigner"
import CardBrowser from "./pages/CardBrowser"
import Layout from "./layouts/Layout"
import CardCreator from "./pages/CardCreator"
import ShotBuilder from "pages/ShotBuilder"
import TimelineEditor from "pages/TimelineEditor"
import PromptBuilder from "pages/PromptBuilder"
import FaceMaker from "./pages/FaceMaker"
import MagicPrompts from "./pages/MagicPrompts"
import TimeFrame from "pages/TimeFrame"



export default function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CardBrowser />} />
        <Route path="designer" element={<CardDesigner />} />
        <Route path="browser" element={<CardBrowser />} />
        <Route path="creator" element={<CardCreator/>} />
        <Route path="face-maker" element={<FaceMaker />} />
        <Route path="shot-builder" element={<ShotBuilder />} />
        <Route path="magic" element={<MagicPrompts />} />
        <Route path="timeline" element={<TimelineEditor />} />
        <Route path="timeframe" element={<TimeFrame/>}/>
        <Route path="prompt" element={<PromptBuilder />} />
      </Route>
    </Routes>
  </Router>
  )
}

