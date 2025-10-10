import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ProductList() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchProdutos() {
      setLoading(true)
      const { data, error } = await supabase
        .from('produto')
        .select('id_produto, nome, descricao, preco, imagem_url')
        .eq('ativo', true)
        .order('criado_em', { ascending: false })

      if (error) {
        setError(error.message)
        console.error('Supabase error:', error)
      } else if (mounted) {
        setProdutos(data || [])
      }
      setLoading(false)
    }
    fetchProdutos()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="loading-state">Carregando produtos...</div>
  if (error) return <div className="error-state">Erro: {error}</div>

  const addToCart = (produto) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || []
    const existing = currentCart.find(item => item.id_produto === produto.id_produto)
    let updatedCart

    if (existing) {
      updatedCart = currentCart.map(item =>
        item.id_produto === produto.id_produto
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    } else {
      updatedCart = [...currentCart, { ...produto, quantidade: 1 }]
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    alert(`${produto.nome} adicionado ao carrinho!`)
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 className="title-section">🧁 Nossos Cupcakes</h2>
      <div className="product-grid">
        {produtos.map(p => (
          <div key={p.id_produto} className="product-card">
            <div className="product-image-container">
              {p.imagem_url ? (
                <img src={p.imagem_url} alt={p.nome} className="product-image" />
              ) : (
                <span className="image-placeholder">Imagem</span>
              )}
            </div>
            <div className="product-info">
                <strong>{p.nome}</strong>
                <p className="product-description">{p.descricao}</p>
            </div>
            
            <div className="product-actions">
              <span className="product-price">R$ {Number(p.preco).toFixed(2)}</span>
              <button
                onClick={() => addToCart(p)}
                className="btn btn-add-cart"
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}