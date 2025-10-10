import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; 

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
      
      const cartTotal = savedCart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
      setTotal(cartTotal);

      if (savedCart.length === 0) {
        setError("Seu carrinho está vazio. Adicione produtos para finalizar a compra.");
      } else if (!session?.user) {
        setError("Você precisa estar logado para finalizar a compra.");
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleCheckout() {
    if (!user || cart.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedido')
        .insert({ 
          cliente_id: user.id, 
          valor_total: total,
          status: 'aguardando pagamento'
        })
        .select('id_pedido') 
        .single();
        
      if (pedidoError) throw new Error('Falha ao criar o pedido: ' + pedidoError.message);
      
      const pedidoId = pedido.id_pedido; 

      const itemsToInsert = cart.map(item => ({
        pedido_id: pedidoId,
        produto_id: item.id_produto,
        quantidade: item.quantidade,
        preco_unitario: item.preco
      }));
      
      const { error: itemError } = await supabase
        .from('item_pedido')
        .insert(itemsToInsert);
        
      if (itemError) throw new Error('Falha ao inserir itens do pedido: ' + itemError.message);

      localStorage.removeItem("cart");
      alert("Pedido realizado com sucesso!");
      navigate('/'); 

    } catch (e) {
      setError(e.message);
      console.error("Checkout Error:", e);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div>Carregando checkout...</div>;
  if (error) {
    return (
        <div style={{color:'red', maxWidth:400, margin:'0 auto', textAlign:'center'}}>
            <h2>❌ Erro no Checkout</h2>
            <p>{error}</p>
            {error.includes("logado") && <a href="/login">Clique aqui para fazer Login</a>}
            {error.includes("vazio") && <a href="/">Clique aqui para ver os Produtos</a>}
        </div>
    )
  }

  return (
    <div style={{maxWidth:600, margin:'0 auto', padding:'20px', background:'#fff', borderRadius:'10px', boxShadow:'0 4px 8px rgba(0,0,0,0.1)', color:'#333'}}>
      <h2>✅ Confirme seu Pedido</h2>

      <div style={{marginBottom:'20px', padding:'15px', border:'1px solid #f8bbd0', borderRadius:'8px', background:'#fff5f5'}}>
        <h3 style={{marginTop:0, borderBottom:'1px solid #f8bbd0', paddingBottom:'5px'}}>Itens:</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id_produto} style={{listStyle:'none', display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:'0.9em'}}>
              <span>{item.nome} x {item.quantidade}</span>
              <strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong>
            </li>
          ))}
        </ul>
        <div style={{borderTop:'2px solid #8d6e63', marginTop:'15px', paddingTop:'10px', display:'flex', justifyContent:'space-between'}}>
            <strong>TOTAL A PAGAR</strong>
            <strong style={{fontSize:'1.2em'}}>R$ {total.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{marginBottom:'20px', padding:'15px', border:'1px solid #ccc', borderRadius:'8px', background:'#f5f5f5'}}>
        <h3 style={{marginTop:0}}>Dados do Cliente</h3>
        <p>Logado como: <strong>{user?.email}</strong></p>
        <p> * A lógica para endereço de entrega e pagamento deve ser adicionada aqui.</p>
      </div>


      <button 
        onClick={handleCheckout} 
        disabled={submitting}
        className="btn btn-auth-primary"
        style={{
          padding: '12px 20px',
          width:'100%',
          fontWeight:'bold'
        }}
      >
        {submitting ? 'Processando Pedido...' : 'Confirmar Pedido e Finalizar'}
      </button>
      
    </div>
  );
}