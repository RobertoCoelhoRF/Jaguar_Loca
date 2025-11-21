import React, { useEffect, useMemo, useState } from 'react'
import heroBanner from '../assets/hero-banner.png'
import placeholder from '../assets/placeholder.svg'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

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
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(formatToday())
  const [time, setTime] = useState('08:00')
  const [notes, setNotes] = useState('')

  const times = useMemo(() => {
    const arr = []
    for (let h = 8; h <= 18; h++) {
      const hh = String(h).padStart(2, '0')
      arr.push(`${hh}:00`)
    }
    return arr
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [open])

  function openModal(car) {
    setSelected(car)
    setDate(formatToday())
    setTime('08:00')
    setNotes('')
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = selected?.name || 'Veículo'
    alert(`Reserva registrada (simulada):\n${name}\nRetirada: ${date} às ${time}`)
    closeModal()
  }

  return (
    <div>
      <Header />

      <section className="hero">
        <img src={heroBanner} alt="A melhor locadora de veículos de Jaguaruana" className="hero-image" />
      </section>

      <main className="container">
        <section className="grid">
          {CARS.map(car => (
            <article className="card" key={car.id}>
              <div className="card-title">{car.name}</div>
              <div className="car-photo">
                <img src={car.img} alt={car.name} />
              </div>
              <div className="indicator">
                <span></span><span></span><span></span><span></span>
              </div>
              <button className="reserve" onClick={() => openModal(car)}>Reservar</button>
            </article>
          ))}
        </section>
      </main>

      <Footer />

      {/* Modal */}
      {open && (
        <div className={`modal open`} aria-hidden={open ? 'false' : 'true'} role="dialog" aria-labelledby="res-title" aria-modal="true">
          <div className="modal-backdrop" onClick={closeModal} data-close="true"></div>
          <div className="modal-dialog" role="document">
            <button className="modal-close" title="Fechar" onClick={closeModal} data-close="true">&times;</button>
            <div className="modal-header">
              <div id="res-title" className="modal-title">Reservar veículo</div>
              <div className="modal-subtitle">Revise os detalhes e escolha o horário de retirada.</div>
            </div>
            <div className="modal-body">
              <div className="modal-product">
                <img id="res-photo" src={selected?.img || placeholder} alt={selected?.name || ''} />
                <div className="modal-product-info">
                  <div id="res-name" className="modal-product-name">{selected?.name}</div>
                  <div className="modal-product-meta small">Retirada em Jaguaruana — Loja Central</div>
                </div>
              </div>

              <form id="res-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="label" htmlFor="res-date">Data de retirada</label>
                    <input className="input" type="date" id="res-date" value={date} min={formatToday()} onChange={e => setDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="res-time">Horário</label>
                    <select className="input" id="res-time" value={time} onChange={e => setTime(e.target.value)} required>
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="res-notes">Observações</label>
                  <textarea className="input" id="res-notes" rows="3" placeholder="Ex.: preciso de cadeirinha infantil" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                </div>
                <div className="actions" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
                  <button className="btn" type="submit">Confirmar reserva</button>
                  <button className="btn btn-ghost" type="button" onClick={closeModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
