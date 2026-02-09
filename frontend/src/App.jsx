import React, { useEffect, useState } from 'react'
import heroBanner from '../assets/hero-banner.png'
import placeholder from '../assets/placeholder.svg'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Card from '../components/card/Card'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function formatToday() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function App() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    function load() {
      fetch(`${backendUrl}/veiculos`).then(r => r.json()).then(data => {
        const items = (data.veiculos || []).map(v => ({ id: v.id, name: v.nome, img: v.foto ? `${backendUrl}${v.foto}` : placeholder, cadeiras: v.cadeiras, acessorios: v.acessorios, precoDiaria: v.precoDiaria, reserved: Boolean(v.reservado) }))
        setCars(items)
      }).catch(() => setCars([]))
    }
    load()
    const onChange = () => load()
    window.addEventListener('veiculos-changed', onChange)
    return () => window.removeEventListener('veiculos-changed', onChange)
  }, [])

  return (
    <div>
      <Header />

      <section className="hero">
        <img src={heroBanner} alt="A melhor locadora de veículos de Jaguaruana" className="hero-image" />
      </section>

      <main className="container">
        <section className="grid">
          {cars.map(car => (
            <Card key={car.id} car={car} />
          ))}
        </section>
      </main>

      <Footer />
      {/* modal moved into each Card for better encapsulation */}
    </div>
  )
}
