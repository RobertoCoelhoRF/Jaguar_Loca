import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

export default function Admin() {
  const [veiculos, setVeiculos] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ nome: '', cadeiras: 0, acessorios: '' })

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  function loadUsers() {
    fetch(`${backendUrl}/admin/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setUsers(data.users || []))
      .catch(() => setUsers([]))
  }

  function loadVeiculos() {
    fetch(`${backendUrl}/admin/veiculos`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setVeiculos(data.veiculos || []))
      .catch(() => setVeiculos([]))
  }

  useEffect(() => { loadUsers(); loadVeiculos() }, [])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function createVeiculo(e) {
    e.preventDefault()
    fetch(`${backendUrl}/admin/veiculos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ nome: form.nome, cadeiras: Number(form.cadeiras), acessorios: form.acessorios })
    })
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          alert('Veículo cadastrado com sucesso')
          setForm({ nome: '', cadeiras: 0, acessorios: '' })
          loadVeiculos()
        } else alert(data.error || 'Erro')
      })
  }

  function deleteUser(id) {
    if (!confirm('Deletar usuário?')) return
    fetch(`${backendUrl}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => { if (data.ok) loadUsers(); else alert(data.error || 'Erro') })
  }

  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 24 }}>
        <h2>Painel Administrativo</h2>

        <section style={{ marginTop: 18 }}>
          <h3>Cadastrar Veículo</h3>
          <form onSubmit={createVeiculo} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
            <input className="input" name="nome" placeholder="Nome do veículo" value={form.nome} onChange={handleChange} required />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Número de cadeiras</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setForm(prev => ({ ...prev, cadeiras: Math.max(0, (Number(prev.cadeiras) || 0) - 1) }))}>-</button>
                <div style={{ minWidth: 56, textAlign: 'center', fontWeight: 700, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>{form.cadeiras}</div>
                <button type="button" className="btn" onClick={() => setForm(prev => ({ ...prev, cadeiras: (Number(prev.cadeiras) || 0) + 1 }))}>+</button>
              </div>
            </div>

            <input className="input" name="acessorios" placeholder="Acessórios (vírgula separados)" value={form.acessorios} onChange={handleChange} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" type="submit">Cadastrar</button>
            </div>
          </form>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3>Usuários Cadastrados</h3>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {users.length === 0 && <div>Nenhum usuário encontrado</div>}
            {users.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, border: '1px solid #eee', borderRadius: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.nome}</div>
                  <div style={{ fontSize: 13 }}>{u.email} • {u.cpf}</div>
                </div>
                <div>
                  <button className="btn btn-ghost" onClick={() => deleteUser(u.id)}>Deletar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
