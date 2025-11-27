import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

export default function Admin() {
  const [veiculos, setVeiculos] = useState([])
  const [users, setUsers] = useState([])
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
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

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview)
    }
  }, [fotoPreview])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function handleFotoChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview)
      setFotoFile(null)
      setFotoPreview(null)
      return
    }
    if (fotoPreview) URL.revokeObjectURL(fotoPreview)
    const url = URL.createObjectURL(f)
    setFotoFile(f)
    setFotoPreview(url)
  }

  function removeFoto() {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview)
    setFotoFile(null)
    setFotoPreview(null)
  }

  function createVeiculo(e) {
    e.preventDefault()
    let options = { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    if (fotoFile) {
      const fd = new FormData()
      fd.append('nome', form.nome)
      fd.append('cadeiras', String(Number(form.cadeiras)))
      fd.append('acessorios', form.acessorios)
      fd.append('foto', fotoFile)
      options.body = fd
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ nome: form.nome, cadeiras: Number(form.cadeiras), acessorios: form.acessorios })
    }

    fetch(`${backendUrl}/admin/veiculos`, options)
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          alert('Veículo cadastrado com sucesso')
          setForm({ nome: '', cadeiras: 0, acessorios: '' })
          setFotoFile(null)
          setFotoPreview(null)
          loadVeiculos()
        } else {
          // logar erro no console da página para facilitar cópia/inspeção
          console.error('Erro ao cadastrar veículo:', data)
        }
      })
      .catch(err => {
        console.error('Falha na requisição de cadastro de veículo:', err)
      })
  }

  function deleteUser(id) {
    if (!confirm('Deletar usuário?')) return
    fetch(`${backendUrl}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => { if (data.ok) loadUsers(); else alert(data.error || 'Erro') })
  }

  function deleteVeiculo(id) {
    if (!confirm('Deletar veículo?')) return
    fetch(`${backendUrl}/admin/veiculos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => { if (data.ok) loadVeiculos(); else alert(data.error || 'Erro') })
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Foto do veículo (opcional)</label>
              <input type="file" accept="image/*" onChange={handleFotoChange} />
              {fotoPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <img src={fotoPreview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 13, color: '#374151' }}>{fotoFile && fotoFile.name}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="button" className="btn btn-ghost" onClick={removeFoto}>Remover</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

        <section style={{ marginTop: 32 }}>
          <h3>Veículos Cadastrados</h3>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {veiculos.length === 0 && <div>Nenhum veículo cadastrado</div>}
            {veiculos.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, border: '1px solid #eee', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {v.foto ? (
                    <img src={`${backendUrl}${v.foto}`} alt={v.nome} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  ) : (
                    <div style={{ width: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', border: '1px dashed #e5e7eb', borderRadius: 8 }}>Sem foto</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700 }}>{v.nome}</div>
                    <div style={{ fontSize: 13 }}>{v.cadeiras} cadeiras • {v.acessorios}</div>
                  </div>
                </div>
                <div>
                  <button className="btn btn-ghost" onClick={() => deleteVeiculo(v.id)}>Deletar</button>
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
