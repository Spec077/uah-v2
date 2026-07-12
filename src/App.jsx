import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Careers from './Careers.jsx'
import Home from './Home.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
