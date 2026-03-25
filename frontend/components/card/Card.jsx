import React, { useState, useEffect, useRef } from 'react'
import './Card.css'
import { useModalContext } from '../../context/ModalContext'

const FIXED_PICKUP_TIME = '08:00'

function formatToday() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function Card({ car }) {
  const modal = useModalContext()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(formatToday())
  const [devDate, setDevDate] = useState(formatToday())
  const [notes, setNotes] = useState('')

  function calculateDays() {
    const d1 = new Date(date)
    const d2 = new Date(devDate)
    const diffTime = d2 - d1
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  function calculateTotal() {
    const days = calculateDays()
    return (days * (car.precoDiaria || 0)).toFixed(2)
  }

  function openModal() {
    setDate(formatToday())
    setDevDate(formatToday())
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

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const token = localStorage.getItem('token')
      const resp = await fetch(`${backendUrl}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ veiculoId: car.id, dataRetirada: date, horaRetirada: FIXED_PICKUP_TIME, dataDevolucao: devDate, valorTotal: calculateTotal(), observacoes: notes })
      })
      const data = await resp.json()
      if (resp.ok && data.reserva) {
        // notify parent to reload vehicles
        window.dispatchEvent(new Event('veiculos-changed'))
        modal.success('Reserva criada com sucesso', 'Sucesso!')
        closeModal()
      } else {
        console.error('Erro ao criar reserva:', data)
        modal.error(data.error || 'Erro ao criar reserva', 'Erro')
      }
    } catch (err) {
      console.error('Falha ao criar reserva:', err)
      modal.error('Erro na requisição', 'Falha na conexão')
    }
  }

  return (
    <>
      <article className="car-card" key={car.id}>
        <div className="car-card-title">{car.name}</div>
        <div className="car-photo">
          <img src={car.img} alt={car.name} />
        </div>
        <div className="car-meta small" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700 }}>{car.cadeiras || '—'} cadeiras</div>
          <div style={{ fontSize: 13, color: '#555' }}>{car.acessorios || 'Sem acessórios informados'}</div>
          {car.precoDiaria && (
            <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 6 }}>
              R$ {Number(car.precoDiaria).toFixed(2)}/dia
            </div>
          )}
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
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{car?.cadeiras || '—'} cadeiras</div>
                    <div style={{ fontSize: 13, color: '#555' }}>{car?.acessorios || 'Sem acessórios informados'}</div>                      {car?.precoDiaria && (
                        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 6 }}>
                          R$ {Number(car.precoDiaria).toFixed(2)}/dia
                        </div>
                      )}                  </div>
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
                    <input className="input" type="text" id={`res-time-${car.id}`} value={FIXED_PICKUP_TIME} readOnly disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`res-devdate-${car.id}`}>Data de devolução</label>
                  <input className="input" type="date" id={`res-devdate-${car.id}`} value={devDate} min={date} onChange={e => setDevDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`res-notes-${car.id}`}>Observações</label>
                  <textarea className="input" id={`res-notes-${car.id}`} rows="3" placeholder="Ex.: preciso de cadeirinha infantil" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                </div>
                <div style={{ padding: 12, background: '#f3f4f6', borderRadius: 8, marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                    <span>Quantidade de dias:</span>
                    <strong>{calculateDays()} dia(s)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                    <span>Preço por dia:</span>
                    <strong>R$ {Number(car.precoDiaria).toFixed(2)}</strong>
                  </div>
                  <div style={{ borderTop: '1px solid #d1d5db', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                    <span>Total:</span>
                    <strong style={{ color: '#16a34a' }}>R$ {calculateTotal()}</strong>
                  </div>
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
