import React, { useEffect, useMemo, useState } from 'react'
import heroBanner from '../assets/hero-banner.png'
import placeholder from '../assets/placeholder.svg'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Card from '../components/card/Card'

const CARS = [
  { id: 1, name: 'HYUNDAI HB20 2025 1.0 12V FLEX COMFORT PLUS MANUAL', img: placeholder },
  { id: 2, name: 'TORO 2025 ENDURANCE TURBO 270 FLEX AT6', img: placeholder },
  { id: 3, name: 'TOYOTA SW4 2.8 D-4D TURBO DIESEL SRX PLATINUM 4X4 AUTOMÁTICO', img: placeholder },
  { id: 4, name: 'HILUX TURBO DIESEL CD SRX PLUS 4X4 AUTOMÁTICO', img: placeholder },
  { id: 5, name: 'TOYOTA COROLLA 2025 2.0 VVT-iE FLEX XEi DIRECT SHIFT', img: placeholder },
  { id: 6, name: 'JEEP COMPASS 1.3 T270 TURBO FLEX LONGITUDE AT6', img: placeholder },
  { id: 7, name: 'FIAT STRADA ENDURANCE CS 2025', img: placeholder },
  { id: 8, name: 'ONIX RS 2025 HATCH 1.0 TURBO FLEX 116CV', img: placeholder },
]

function formatToday() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function App() {
  const [vehicles, setVehicles] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
      fetch(`${backendUrl}/veiculos`).then(r => r.json()).then(data => {
        const v = (data.veiculos || data.vehicles || []).map(x => ({
        id: x.id,
        name: x.nome,
        img: x.image ? (x.image.startsWith('http') ? x.image : `${backendUrl}${x.image}`) : placeholder
      }))
      setVehicles(v)
    }).catch(() => setVehicles([]))
  }, [])

  return (
    <div>
      <Header />

      <section className="hero">
        <img src={heroBanner} alt="A melhor locadora de veículos de Jaguaruana" className="hero-image" />
      </section>

      <main className="container">
        <section className="grid">
          {vehicles.map(car => (
            <Card key={car.id} car={car} />
          ))}
        </section>
      </main>

      <Footer />
      {/* modal moved into each Card for better encapsulation */}
    </div>
  )
}
