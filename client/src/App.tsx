import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'

function App() {

  return (
    <Routes>
        <Route index element={<Home />} />
    </Routes>
  )
}

export default App
