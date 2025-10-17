import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)


    const { data, error } = await supabase.auth.signUp({ email, password: senha })

    if (error) {
      setMsg({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

 
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
        _nome: nome,
        _email: email
    })

    if (rpcError) {
      setMsg({ type: 'error', text: 'Usuário criado no Auth, mas falha ao criar perfil: ' + rpcError.message })
    } else {
      setMsg({ type: 'success', text: 'Cadastro realizado! Verifique seu e-mail se a confirmação estiver ativada.' })
      setNome(''); setEmail(''); setSenha('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:360}}>
      <h3>Criar conta</h3>
      {msg && <div style={{color: msg.type==='error' ? 'red' : 'green', padding:'5px 0'}}>{msg.text}</div>}
      <input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required style={{display:'block',width:'100%',padding:8,margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}} />
      <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{display:'block',width:'100%',padding:8,margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}} />
      <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required style={{display:'block',width:'100%',padding:8,margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}} />
      <button type="submit" disabled={loading} style={{background:'#8d6e63',color:'#fff',border:0,padding:'8px 12px',borderRadius:6}}>
        {loading ? 'Cadastrando...' : 'Criar conta'}
      </button>
    </form>
  )
}