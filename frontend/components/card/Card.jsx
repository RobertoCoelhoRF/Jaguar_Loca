import React, { useState, useMemo, useEffect, useRef } from 'react'
import './Card.css'

function formatToday() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function Card({ car }) {
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

  function openModal() {
    setDate(formatToday())
    setTime('08:00')
    setNotes('')
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  // bloquear rolagem quando modal aberto e limpar quando fechar
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
    return undefined
  }, [open])

  // fechar com ESC quando modal aberto
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const dialogRef = useRef(null)
  // focar primeiro campo quando abrir
  useEffect(() => {
    if (open) {
      const first = dialogRef.current && dialogRef.current.querySelector('input, select, textarea, button')
      if (first && typeof first.focus === 'function') first.focus()
    }
  }, [open])

  function handleSubmit(e) {
    e.preventDefault()
    const name = car?.name || 'Veículo'
    alert(`Reserva registrada (simulada):\n${name}\nRetirada: ${date} às ${time}`)
    closeModal()
  }

  return (
    <>
      <article className="car-card" key={car.id}>
        <div className="car-card-title">{car.name}</div>
        <div className="car-photo">
          <img src={car.img} alt={car.name} />
        </div>
        <div className="indicator">
          <span></span><span></span><span></span><span></span>
        </div>
        <button className="reserve" onClick={openModal}>Reservar</button>
      </article>

      {open && (
        <div className={`modal open`} aria-hidden={open ? 'false' : 'true'} role="dialog" aria-labelledby={`res-title-${car.id}`} aria-modal="true">
          <div className="modal-backdrop" onClick={closeModal} data-close="true"></div>
          <div className="modal-dialog" role="document" ref={dialogRef} onClick={e => e.stopPropagation()}>
            <button className="modal-close" title="Fechar" onClick={closeModal} data-close="true">&times;</button>
            <div className="modal-header">
              <div id={`res-title-${car.id}`} className="modal-title">Reservar veículo</div>
              <div className="modal-subtitle">Revise os detalhes e escolha o horário de retirada.</div>
            </div>
            <div className="modal-body">
              <div className="modal-product">
                <img id={`res-photo-${car.id}`} src={car?.img || ''} alt={car?.name || ''} />
                <div className="modal-product-info">
                  <div id={`res-name-${car.id}`} className="modal-product-name">{car?.name}</div>
                  <div className="modal-product-meta small">Retirada em Jaguaruana — Loja Central</div>
                </div>
              </div>

              <form id={`res-form-${car.id}`} onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="label" htmlFor={`res-date-${car.id}`}>Data de retirada</label>
                    <input className="input" type="date" id={`res-date-${car.id}`} value={date} min={formatToday()} onChange={e => setDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor={`res-time-${car.id}`}>Horário</label>
                    <select className="input" id={`res-time-${car.id}`} value={time} onChange={e => setTime(e.target.value)} required>
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`res-notes-${car.id}`}>Observações</label>
                  <textarea className="input" id={`res-notes-${car.id}`} rows="3" placeholder="Ex.: preciso de cadeirinha infantil" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
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
    </>
  )
}
