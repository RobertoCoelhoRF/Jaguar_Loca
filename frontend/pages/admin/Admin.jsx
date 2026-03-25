import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import { useModalContext } from '../../context/ModalContext'

function formatCategorias(veiculo) {
  const categorias = []
  categorias.push(veiculo?.cambio === 'AUTOMATICO' ? 'Automático' : 'Manual')
  categorias.push(veiculo?.vidroEletrico ? 'Vidro elétrico' : 'Sem vidro elétrico')
  categorias.push(veiculo?.arCondicionado ? 'Ar-condicionado' : 'Sem ar-condicionado')
  categorias.push(veiculo?.travaEletrica ? 'Trava elétrica' : 'Sem trava elétrica')
  categorias.push(veiculo?.direcaoHidraulica ? 'Dir. hidráulica' : 'Sem dir. hidráulica')
  if (veiculo?.portaMalas) {
    const mapaPortaMalas = { PEQUENO: 'Porta-malas pequeno', MEDIO: 'Porta-malas médio', GRANDE: 'Porta-malas grande' }
    categorias.push(mapaPortaMalas[veiculo.portaMalas] || `Porta-malas ${String(veiculo.portaMalas).toLowerCase()}`)
  }
  return categorias.join(' • ')
}

export default function Admin() {
  const modal = useModalContext()
  const [veiculos, setVeiculos] = useState([])
  const [users, setUsers] = useState([])
  const [reservas, setReservas] = useState([])
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [form, setForm] = useState({ nome: '', cadeiras: 0, vidroEletrico: false, arCondicionado: false, cambio: 'MANUAL', travaEletrica: false, direcaoHidraulica: false, portaMalas: 'MEDIO', precoDiaria: '' })
  const [activeTab, setActiveTab] = useState('cadastro') // 'cadastro', 'usuarios', 'veiculos', 'reservas'
  const [editingVeiculo, setEditingVeiculo] = useState(null)
  const [editForm, setEditForm] = useState({ nome: '', cadeiras: 0, vidroEletrico: false, arCondicionado: false, cambio: 'MANUAL', travaEletrica: false, direcaoHidraulica: false, portaMalas: 'MEDIO', precoDiaria: '' })
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

  function handleChange(e) {
    const { name, type, checked, value } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleEditChange(e) {
    const { name, type, checked, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

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
      vidroEletrico: Boolean(veiculo.vidroEletrico),
      arCondicionado: Boolean(veiculo.arCondicionado),
      cambio: veiculo.cambio || 'MANUAL',
      travaEletrica: Boolean(veiculo.travaEletrica),
      direcaoHidraulica: Boolean(veiculo.direcaoHidraulica),
      portaMalas: veiculo.portaMalas || 'MEDIO',
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
    setEditForm({ nome: '', cadeiras: 0, vidroEletrico: false, arCondicionado: false, cambio: 'MANUAL', travaEletrica: false, direcaoHidraulica: false, portaMalas: 'MEDIO', precoDiaria: '' })
    setEditFotoFile(null)
    setEditFotoPreview(null)
  }

  function submitEditVeiculo(e) {
    e.preventDefault()

    if (!editForm.nome.trim()) {
      modal.alert('Nome do veículo é obrigatório', 'warning')
      return
    }
    if (!editForm.precoDiaria || Number(editForm.precoDiaria) <= 0) {
      modal.alert('Preço da diária é obrigatório e deve ser maior que zero', 'warning')
      return
    }

    let options = { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    if (editFotoFile) {
      const fd = new FormData()
      fd.append('nome', editForm.nome)
      fd.append('cadeiras', String(Number(editForm.cadeiras)))
      fd.append('vidroEletrico', String(Boolean(editForm.vidroEletrico)))
      fd.append('arCondicionado', String(Boolean(editForm.arCondicionado)))
      fd.append('cambio', editForm.cambio)
      fd.append('travaEletrica', String(Boolean(editForm.travaEletrica)))
      fd.append('direcaoHidraulica', String(Boolean(editForm.direcaoHidraulica)))
      fd.append('portaMalas', editForm.portaMalas)
      fd.append('precoDiaria', editForm.precoDiaria)
      fd.append('foto', editFotoFile)
      options.body = fd
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ nome: editForm.nome, cadeiras: Number(editForm.cadeiras), vidroEletrico: Boolean(editForm.vidroEletrico), arCondicionado: Boolean(editForm.arCondicionado), cambio: editForm.cambio, travaEletrica: Boolean(editForm.travaEletrica), direcaoHidraulica: Boolean(editForm.direcaoHidraulica), portaMalas: editForm.portaMalas, precoDiaria: Number(editForm.precoDiaria) })
    }

    fetch(`${backendUrl}/admin/veiculos/${editingVeiculo}`, options)
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          modal.success('Veículo atualizado com sucesso', 'Sucesso!')
          cancelEditVeiculo()
          loadVeiculos()
        } else {
          console.error('Erro ao atualizar veículo:', data)
          modal.error(data.error || 'Erro desconhecido ao atualizar', 'Erro')
        }
      })
      .catch(err => {
        console.error('Falha na requisição de atualização:', err)
        modal.error(err.message, 'Falha na conexão')
      })
  }

  function createVeiculo(e) {
    e.preventDefault()
    
    if (!form.nome.trim()) {
      modal.alert('Nome do veículo é obrigatório', 'warning')
      return
    }
    if (!form.precoDiaria || Number(form.precoDiaria) <= 0) {
      modal.alert('Preço da diária é obrigatório e deve ser maior que zero', 'warning')
      return
    }

    let options = { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    if (fotoFile) {
      const fd = new FormData()
      fd.append('nome', form.nome)
      fd.append('cadeiras', String(Number(form.cadeiras)))
      fd.append('vidroEletrico', String(Boolean(form.vidroEletrico)))
      fd.append('arCondicionado', String(Boolean(form.arCondicionado)))
      fd.append('cambio', form.cambio)
      fd.append('travaEletrica', String(Boolean(form.travaEletrica)))
      fd.append('direcaoHidraulica', String(Boolean(form.direcaoHidraulica)))
      fd.append('portaMalas', form.portaMalas)
      fd.append('precoDiaria', form.precoDiaria)
      fd.append('foto', fotoFile)
      options.body = fd
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ nome: form.nome, cadeiras: Number(form.cadeiras), vidroEletrico: Boolean(form.vidroEletrico), arCondicionado: Boolean(form.arCondicionado), cambio: form.cambio, travaEletrica: Boolean(form.travaEletrica), direcaoHidraulica: Boolean(form.direcaoHidraulica), portaMalas: form.portaMalas, precoDiaria: Number(form.precoDiaria) })
    }

    fetch(`${backendUrl}/admin/veiculos`, options)
      .then(r => r.json())
      .then(data => {
        if (data.veiculo) {
          modal.success('Veículo cadastrado com sucesso', 'Sucesso!')
          setForm({ nome: '', cadeiras: 0, vidroEletrico: false, arCondicionado: false, cambio: 'MANUAL', travaEletrica: false, direcaoHidraulica: false, portaMalas: 'MEDIO', precoDiaria: '' })
          setFotoFile(null)
          setFotoPreview(null)
          loadVeiculos()
        } else {
          console.error('Erro ao cadastrar veículo:', data)
          modal.error(data.error || 'Erro desconhecido ao cadastrar', 'Erro')
        }
      })
      .catch(err => {
        console.error('Falha na requisição de cadastro de veículo:', err)
        modal.error(err.message, 'Falha na conexão')
      })
  }

  function deleteUser(id) {
    modal.confirm(
      'Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.',
      () => {
        fetch(`${backendUrl}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              modal.success('Usuário deletado com sucesso', 'Sucesso!')
              loadUsers()
            } else {
              modal.error(data.error || 'Erro ao deletar usuário', 'Erro')
            }
          })
      },
      'Deletar Usuário',
      'Deletar',
      'Cancelar'
    )
  }

  function deleteVeiculo(id) {
    modal.confirm(
      'Tem certeza que deseja deletar este veículo? Esta ação não pode ser desfeita.',
      () => {
        fetch(`${backendUrl}/admin/veiculos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              modal.success('Veículo deletado com sucesso', 'Sucesso!')
              loadVeiculos()
            } else {
              modal.error(data.error || 'Erro ao deletar veículo', 'Erro')
            }
          })
      },
      'Deletar Veículo',
      'Deletar',
      'Cancelar'
    )
  }

  function deleteReserva(id) {
    modal.confirm(
      'Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.',
      () => {
        fetch(`${backendUrl}/admin/reservas/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              modal.success('Reserva cancelada com sucesso', 'Sucesso!')
              loadReservas()
              loadVeiculos()
            } else {
              modal.error(data.error || 'Erro ao cancelar reserva', 'Erro')
            }
          })
      },
      'Cancelar Reserva',
      'Confirmar',
      'Cancelar'
    )
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

              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="vidroEletrico" checked={Boolean(form.vidroEletrico)} onChange={handleChange} /> Vidro elétrico</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="arCondicionado" checked={Boolean(form.arCondicionado)} onChange={handleChange} /> Ar-condicionado</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="travaEletrica" checked={Boolean(form.travaEletrica)} onChange={handleChange} /> Trava elétrica</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="direcaoHidraulica" checked={Boolean(form.direcaoHidraulica)} onChange={handleChange} /> Direção hidráulica</label>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label style={{ fontWeight: 700 }}>Câmbio</label>
                  <select className="input" name="cambio" value={form.cambio} onChange={handleChange}>
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATICO">Automático</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label style={{ fontWeight: 700 }}>Porta-malas</label>
                  <select className="input" name="portaMalas" value={form.portaMalas} onChange={handleChange}>
                    <option value="PEQUENO">Pequeno</option>
                    <option value="MEDIO">Médio</option>
                    <option value="GRANDE">Grande</option>
                  </select>
                </div>
              </div>

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

                  <div style={{ display: 'grid', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="vidroEletrico" checked={Boolean(editForm.vidroEletrico)} onChange={handleEditChange} /> Vidro elétrico</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="arCondicionado" checked={Boolean(editForm.arCondicionado)} onChange={handleEditChange} /> Ar-condicionado</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="travaEletrica" checked={Boolean(editForm.travaEletrica)} onChange={handleEditChange} /> Trava elétrica</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="direcaoHidraulica" checked={Boolean(editForm.direcaoHidraulica)} onChange={handleEditChange} /> Direção hidráulica</label>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontWeight: 700 }}>Câmbio</label>
                      <select className="input" name="cambio" value={editForm.cambio} onChange={handleEditChange}>
                        <option value="MANUAL">Manual</option>
                        <option value="AUTOMATICO">Automático</option>
                      </select>
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontWeight: 700 }}>Porta-malas</label>
                      <select className="input" name="portaMalas" value={editForm.portaMalas} onChange={handleEditChange}>
                        <option value="PEQUENO">Pequeno</option>
                        <option value="MEDIO">Médio</option>
                        <option value="GRANDE">Grande</option>
                      </select>
                    </div>
                  </div>

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
                      <div style={{ fontSize: 13 }}>{v.cadeiras} assentos • {formatCategorias(v)}</div>
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
                        <strong>Devolução:</strong> {new Date(r.dataDevolucao).toLocaleDateString('pt-BR')} às {r.horaRetirada}
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
