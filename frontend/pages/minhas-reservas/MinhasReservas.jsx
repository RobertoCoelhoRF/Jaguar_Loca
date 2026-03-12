import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import { useModalContext } from '../../context/ModalContext'

export default function MinhasReservas() {
  const modal = useModalContext()
  const [reservas, setReservas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  function loadReservas() {
    const token = localStorage.getItem('token')
    if (!token) {
      setReservas([])
      setLoading(false)
      return
    }
    fetch(`${backendUrl}/reservas/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.reservas) setReservas(data.reservas); else { setError(data.error || null); setReservas([]) }; setLoading(false) })
      .catch(err => { setError(err.message); setReservas([]); setLoading(false) })
  }

  useEffect(() => {
    loadReservas()
  }, [])

  function deleteReserva(id) {
    modal.confirm(
      'Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.',
      () => {
        const token = localStorage.getItem('token')
        fetch(`${backendUrl}/reservas/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              modal.success('Reserva cancelada com sucesso', 'Sucesso!')
              loadReservas()
            } else {
              modal.error(data.error || 'Erro ao cancelar reserva', 'Erro')
            }
          })
          .catch(err => modal.error('Erro ao cancelar reserva: ' + err.message, 'Falha na conexão'))
      },
      'Cancelar Reserva',
      'Confirmar',
      'Não, manter'
    )
  }

  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 24 }}>
        <h2>Minhas Reservas</h2>
        {loading && <div>Carregando suas reservas...</div>}
        {!loading && error && <div style={{ color: 'red' }}>Erro ao carregar reservas: {error}</div>}
        {!loading && !error && reservas && reservas.length === 0 && (
          <div>Você ainda não tem reservas.</div>
        )}
        {!loading && !error && reservas && reservas.length > 0 && (
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {reservas.map(r => (
              <div key={r.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  {r.veiculo?.foto ? (
                    <img src={`${backendUrl}${r.veiculo.foto}`} alt={r.veiculo.nome} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  ) : (
                    <div style={{ width: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', border: '1px dashed #e5e7eb', borderRadius: 8 }}>Sem foto</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{r.veiculo?.nome || 'Veículo'}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{r.veiculo?.cadeiras} cadeiras • {r.veiculo?.acessorios}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>
                    <strong>Data de retirada:</strong> {new Date(r.dataRetirada).toLocaleDateString('pt-BR')} às {r.horaRetirada}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <strong>Data de devolução:</strong> {new Date(r.dataDevolucao).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 6 }}>
                    <strong>Total a pagar:</strong> R$ {Number(r.valorTotal).toFixed(2)}
                  </div>
                  {r.observacoes && <div style={{ fontSize: 13, marginTop: 6 }}><strong>Observações:</strong> {r.observacoes}</div>}
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-ghost" onClick={() => deleteReserva(r.id)}>Cancelar Reserva</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
