import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  function removeFromCart(id) {
    const newCart = cart.filter((item) => item.id_produto !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className="app-container" style={{maxWidth:600}}>
      <h2>🛒 Carrinho de Compras</h2>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id_produto} style={{ marginBottom: "10px", listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:20}}>
                <span><strong>{item.nome}</strong> - R${item.preco.toFixed(2)} x {item.quantidade}</span>
                <button
                  onClick={() => removeFromCart(item.id_produto)}
                  className="btn btn-auth-secondary"
                  style={{
                    marginLeft: "10px",
                    padding: "4px 8px",
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <h3 style={{textAlign:'right', borderTop:'2px solid #ccc', paddingTop:10}}>Total: R$ {total.toFixed(2)}</h3>
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