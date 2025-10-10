import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setMsg({ type: 'error', text: error.message })
    } else {
      setMsg({ type: 'success', text: 'Login efetuado.' })
      if (onLogin) onLogin(data.user)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} style={{maxWidth:360}}>
      <h3>Entrar</h3>
      {msg && <div style={{color: msg.type==='error' ? 'red' : 'green', padding:'5px 0'}}>{msg.text}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{display:'block',width:'100%',padding:8,margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}} />
      <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required style={{display:'block',width:'100%',padding:8,margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}} />
      <button type="submit" disabled={loading} className="btn btn-auth-secondary" style={{padding:'8px 12px'}}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}