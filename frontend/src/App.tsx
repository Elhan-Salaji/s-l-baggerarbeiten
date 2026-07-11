import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollManager from './components/ScrollManager'
import DatenschutzPage from './pages/DatenschutzPage'
import HomePage from './pages/HomePage'
import ImpressumPage from './pages/ImpressumPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
