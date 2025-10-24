import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function handleIncrease(id) {
    const newCart = cart.map(item => 
      item.id_produto === id 
      ? { ...item, quantidade: item.quantidade + 1 } 
      : item
    );
    updateCart(newCart);
  }

  function handleDecrease(id) {
    let newCart = cart.map(item => 
      item.id_produto === id 
      ? { ...item, quantidade: Math.max(0, item.quantidade - 1) } 
      : item
    );
    
    newCart = newCart.filter(item => item.quantidade > 0); 
    updateCart(newCart);
  }

  function removeFromCart(id) {
    const newCart = cart.filter((item) => item.id_produto !== id);
    updateCart(newCart);
  }

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className="app-container" style={{maxWidth:600}}>
      <h2>🛒 Carrinho de Compras</h2>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item) => (
              <li 
                key={item.id_produto} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px', 
                  paddingBottom: '10px',
                  borderBottom: '1px solid #eee'
                }}
              >
                <div>
                  <strong>{item.nome}</strong>
                  <br />
                  <span style={{ fontSize: '0.9em', color: 'var(--color-text-dark)' }}>
                    R$ {item.preco.toFixed(2)} (Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)})
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => handleDecrease(item.id_produto)}
                    className="btn btn-auth-secondary"
                    style={{ padding: '4px 8px' }}
                  >
                    -
                  </button>
                  
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantidade}</span>
                  
                  <button 
                    onClick={() => handleIncrease(item.id_produto)}
                    className="btn btn-auth-secondary"
                    style={{ padding: '4px 8px' }}
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id_produto)}
                    style={{
                      marginLeft: "10px",
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <h3 style={{textAlign:'right', borderTop:'2px solid var(--color-primary)', paddingTop:10}}>
            Total: R$ {total.toFixed(2)}
          </h3>
          
          <a href="/checkout">
            <button
              className="btn btn-auth-primary"
              style={{
                padding: "8px 12px",
                width:'100%'
              }}
            >
              Finalizar Compra
            </button>
          </a>
        </div>
      )}
    </div>
  );
}