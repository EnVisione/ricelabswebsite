import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import BackgroundFX from './components/BackgroundFX.jsx'
import SecretMode from './components/SecretMode.jsx'
import { useDocumentMeta } from './hooks/useDocumentMeta.js'
import { ROUTE_META, SITE_URL } from './data/routeMeta.js'

function RouteMetaUpdater() {
  const location = useLocation()
  const meta = ROUTE_META[location.pathname] || ROUTE_META['/']
  useDocumentMeta({
    title: meta.title,
    description: meta.description,
    image: meta.image,
    url: SITE_URL + location.pathname,
  })
  return null
}
import Home from './pages/Home.jsx'
import Team from './pages/Team.jsx'
import OneRing from './pages/OneRing.jsx'
import Envy from './pages/Envy.jsx'
import Nitro from './pages/Nitro.jsx'
import Banane from './pages/Banane.jsx'
import Contact from './pages/Contact.jsx'
import Downloads from './pages/Downloads.jsx'

export default function App() {
  return (
    <>
      <RouteMetaUpdater />
      <BackgroundFX />
      <SecretMode />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/ool" element={<OneRing />} />
        <Route path="/one-ring" element={<OneRing />} />
        <Route path="/envy" element={<Envy />} />
        <Route path="/nitro" element={<Nitro />} />
        <Route path="/banane" element={<Banane />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/downloads" element={<Downloads />} />
      </Routes>
      <Footer />
    </>
  )
}
