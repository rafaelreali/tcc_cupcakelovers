import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ProductList() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantidades, setQuantidades] = useState({});
  const [notification, setNotification] = useState(null);

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
  
  const handleQuantityChange = (id, value) => {
    const newQuantity = Math.max(1, Number(value));
    
    setQuantidades(prev => ({
        ...prev,
        [id]: newQuantity
    }));
  };

  const addToCart = (produto) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || []
    const quantityToAdd = quantidades[produto.id_produto] || 1;
    const existing = currentCart.find(item => item.id_produto === produto.id_produto)
    let updatedCart

    if (existing) {
      updatedCart = currentCart.map(item =>
        item.id_produto === produto.id_produto
          ? { ...item, quantidade: item.quantidade + quantityToAdd }
          : item
      )
    } else {
      updatedCart = [...currentCart, { ...produto, quantidade: quantityToAdd }]
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setNotification(`${quantityToAdd}x ${produto.nome} adicionado(s) ao carrinho!`);
    
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  }

  if (loading) return <div className="loading-state">Carregando produtos...</div>
  if (error) return <div className="error-state">Erro: {error}</div>

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
              
              <input
                type="number"
                min="1"
                value={quantidades[p.id_produto] || 1}
                onChange={(e) => handleQuantityChange(p.id_produto, e.target.value)}
                style={{ width: '40px', textAlign: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              
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
      
      {notification && (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#B39DDB', 
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            {notification}
        </div>
      )}
    </div>
  )
}