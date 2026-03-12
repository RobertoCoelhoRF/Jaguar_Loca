import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

export default function Admin() {
  const [veiculos, setVeiculos] = useState([])
  const [users, setUsers] = useState([])
  const [reservas, setReservas] = useState([])
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [form, setForm] = useState({ nome: '', cadeiras: 0, acessorios: '', precoDiaria: '' })
  const [activeTab, setActiveTab] = useState('cadastro') // 'cadastro', 'usuarios', 'veiculos', 'reservas'
  const [editingVeiculo, setEditingVeiculo] = useState(null)
  const [editForm, setEditForm] = useState({ nome: '', cadeiras: 0, acessorios: '', precoDiaria: '' })
  const [editFotoFile, setEditFotoFile] = useState(null)
  const [editFotoPreview, setEditFotoPreview] = useState(null)

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

  function loadReservas() {
    fetch(`${backendUrl}/admin/reservas`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setReservas(data.reservas || []))
      .catch(() => setReservas([]))
  }

  useEffect(() => { loadUsers(); loadVeiculos(); loadReservas() }, [])

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview)
      if (editFotoPreview) URL.revokeObjectURL(editFotoPreview)
    }
  }, [fotoPreview, editFotoPreview])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function handleEditChange(e) { setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

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

  function handleEditVeiculo(veiculo) {
    setEditingVeiculo(veiculo.id)
    setEditForm({
      nome: veiculo.nome,
      cadeiras: veiculo.cadeiras,
      acessorios: veiculo.acessorios,
      precoDiaria: veiculo.precoDiaria
    })
    setEditFotoFile(null)
    setEditFotoPreview(null)
  }

  function handleEditFotoChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      if (editFotoPreview) URL.revokeObjectURL(editFotoPreview)
      setEditFotoFile(null)
      setEditFotoPreview(null)
      return
    }
    if (editFotoPreview) URL.revokeObjectURL(editFotoPreview)
    const url = URL.createObjectURL(f)
    setEditFotoFile(f)
    setEditFotoPreview(url)
  }

  function removeEditFoto() {
    if (editFotoPreview) URL.revokeObjectURL(editFotoPreview)
    setEditFotoFile(null)
    setEditFotoPreview(null)
  }

  function cancelEditVeiculo() {
    if (editFotoPreview) URL.revokeObjectURL(editFotoPreview)
    setEditingVeiculo(null)
    setEditForm({ nome: '', cadeiras: 0, acessorios: '', precoDiaria: '' })
    setEditFotoFile(null)
    setEditFotoPreview(null)
  }

  function submitEditVeiculo(e) {
    e.preventDefault()

    if (!editForm.nome.trim()) {
      alert('Nome do veículo é obrigatório')
      return
    }
    if (!editForm.precoDiaria || Number(editForm.precoDiaria) <= 0) {
      alert('Preço da diária é obrigatório e deve ser maior que zero')
      return
    }

    let options = { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    if (editFotoFile) {
      const fd = new FormData()
      fd.append('nome', editForm.nome)
      fd.append('cadeiras', String(Number(editForm.cadeiras)))
      fd.append('acessorios', editForm.acessorios)
      fd.append('precoDiaria', editForm.precoDiaria)
      fd.append('foto', editFotoFile)
      options.body = fd
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ nome: editForm.nome, cadeiras: Number(editForm.cadeiras), acessorios: editForm.acessorios, precoDiaria: Number(editForm.precoDiaria) })
    }

    fetch(`${backendUrl}/admin/veiculos/${editingVeiculo}`, options)
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          alert('Veículo atualizado com sucesso')
          cancelEditVeiculo()
          loadVeiculos()
        } else {
          console.error('Erro ao atualizar veículo:', data)
          alert(`Erro ao atualizar: ${data.error || 'Erro desconhecido'}`)
        }
      })
      .catch(err => {
        console.error('Falha na requisição de atualização:', err)
        alert(`Falha na requisição: ${err.message}`)
      })
  }

  function createVeiculo(e) {
    e.preventDefault()
    
    // Validação básica no frontend
    if (!form.nome.trim()) {
      alert('Nome do veículo é obrigatório')
      return
    }
    if (!form.precoDiaria || Number(form.precoDiaria) <= 0) {
      alert('Preço da diária é obrigatório e deve ser maior que zero')
      return
    }

    let options = { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    if (fotoFile) {
      const fd = new FormData()
      fd.append('nome', form.nome)
      fd.append('cadeiras', String(Number(form.cadeiras)))
      fd.append('acessorios', form.acessorios)
      fd.append('precoDiaria', form.precoDiaria)
      fd.append('foto', fotoFile)
      options.body = fd
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ nome: form.nome, cadeiras: Number(form.cadeiras), acessorios: form.acessorios, precoDiaria: Number(form.precoDiaria) })
    }

    fetch(`${backendUrl}/admin/veiculos`, options)
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          alert('Veículo cadastrado com sucesso')
          setForm({ nome: '', cadeiras: 0, acessorios: '', precoDiaria: '' })
          setFotoFile(null)
          setFotoPreview(null)
          loadVeiculos()
        } else {
          console.error('Erro ao cadastrar veículo:', data)
          alert(`Erro ao cadastrar: ${data.error || 'Erro desconhecido'}`)
        }
      })
      .catch(err => {
        console.error('Falha na requisição de cadastro de veículo:', err)
        alert(`Falha na requisição: ${err.message}`)
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

  function deleteReserva(id) {
    if (!confirm('Cancelar esta reserva?')) return
    fetch(`${backendUrl}/admin/reservas/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => { 
        if (data.ok) {
          alert('Reserva cancelada com sucesso')
          loadReservas()
          loadVeiculos()
        } else {
          alert(data.error || 'Erro ao cancelar reserva')
        }
      })
  }

  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 24 }}>
        <h2>Painel Administrativo</h2>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
          <button 
            type="button" 
            className={activeTab === 'cadastro' ? 'btn btn-ghost active' : 'btn btn-ghost'} 
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastrar Veículo
          </button>
          <button 
            type="button" 
            className={activeTab === 'usuarios' ? 'btn btn-ghost active' : 'btn btn-ghost'} 
            onClick={() => setActiveTab('usuarios')}
          >
            Usuários Cadastrados
          </button>
          <button 
            type="button" 
            className={activeTab === 'veiculos' ? 'btn btn-ghost active' : 'btn btn-ghost'} 
            onClick={() => setActiveTab('veiculos')}
          >
            Veículos Cadastrados
          </button>
          <button 
            type="button" 
            className={activeTab === 'reservas' ? 'btn btn-ghost active' : 'btn btn-ghost'} 
            onClick={() => setActiveTab('reservas')}
          >
            Gerenciar Reservas
          </button>
        </div>

        {activeTab === 'cadastro' && (
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
                <label style={{ fontWeight: 700 }}>Preço da diária (R$)</label>
                <input className="input" type="number" step="0.01" min="0" name="precoDiaria" placeholder="0.00" value={form.precoDiaria} onChange={handleChange} required />
              </div>

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
        )}

        {activeTab === 'usuarios' && (
          <section style={{ marginTop: 18 }}>
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
        )}

        {activeTab === 'veiculos' && (
          <section style={{ marginTop: 18 }}>
            <h3>Veículos Cadastrados</h3>
            
            {editingVeiculo && (
              <div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 24 }}>
                <h4>Editar Veículo</h4>
                <form onSubmit={submitEditVeiculo} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
                  <input className="input" name="nome" placeholder="Nome do veículo" value={editForm.nome} onChange={handleEditChange} required />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontWeight: 700 }}>Número de cadeiras</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button type="button" className="btn btn-ghost" onClick={() => setEditForm(prev => ({ ...prev, cadeiras: Math.max(0, (Number(prev.cadeiras) || 0) - 1) }))}>-</button>
                      <div style={{ minWidth: 56, textAlign: 'center', fontWeight: 700, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>{editForm.cadeiras}</div>
                      <button type="button" className="btn" onClick={() => setEditForm(prev => ({ ...prev, cadeiras: (Number(prev.cadeiras) || 0) + 1 }))}>+</button>
                    </div>
                  </div>

                  <input className="input" name="acessorios" placeholder="Acessórios (vírgula separados)" value={editForm.acessorios} onChange={handleEditChange} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontWeight: 700 }}>Preço da diária (R$)</label>
                    <input className="input" type="number" step="0.01" min="0" name="precoDiaria" placeholder="0.00" value={editForm.precoDiaria} onChange={handleEditChange} required />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontWeight: 700 }}>Nova foto (opcional)</label>
                    <input type="file" accept="image/*" onChange={handleEditFotoChange} />
                    {editFotoPreview && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <img src={editFotoPreview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ fontSize: 13, color: '#374151' }}>{editFotoFile && editFotoFile.name}</div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button type="button" className="btn btn-ghost" onClick={removeEditFoto}>Remover</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" type="submit">Salvar Alterações</button>
                    <button className="btn btn-ghost" type="button" onClick={cancelEditVeiculo}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

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
                      <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>R$ {Number(v.precoDiaria).toFixed(2)}/dia</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost" onClick={() => handleEditVeiculo(v)}>Editar</button>
                    <button className="btn btn-ghost" onClick={() => deleteVeiculo(v.id)}>Deletar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'reservas' && (
          <section style={{ marginTop: 18 }}>
            <h3>Gerenciar Reservas</h3>
            <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
              {reservas.length === 0 && <div>Nenhuma reserva ativa</div>}
              {reservas.map(r => (
                <div key={r.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    {r.veiculo?.foto ? (
                      <img src={`${backendUrl}${r.veiculo.foto}`} alt={r.veiculo.nome} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    ) : (
                      <div style={{ width: 100, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', border: '1px dashed #e5e7eb', borderRadius: 8, fontSize: 11 }}>Sem foto</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{r.veiculo?.nome || 'Veículo'}</div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                        <strong>Cliente:</strong> {r.usuario?.nome} ({r.usuario?.email})
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                        <strong>Retirada:</strong> {new Date(r.dataRetirada).toLocaleDateString('pt-BR')} às {r.horaRetirada}
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                        <strong>Devolução:</strong> {new Date(r.dataDevolucao).toLocaleDateString('pt-BR')}
                      </div>
                      <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>
                        <strong>Total:</strong> R$ {Number(r.valorTotal).toFixed(2)}
                      </div>
                      {r.observacoes && <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}><strong>Obs:</strong> {r.observacoes}</div>}
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        Reservado em: {new Date(r.createdAt).toLocaleDateString('pt-BR')} {new Date(r.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-ghost" onClick={() => deleteReserva(r.id)}>Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
