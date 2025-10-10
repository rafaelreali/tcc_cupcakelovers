import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f8bbd0",
        padding: "10px 20px",
        borderRadius: "0 0 10px 10px",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "#3e2723", fontWeight: "bold", fontSize: "18px" }}>
        🧁 Cupcake Lovers
      </Link>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#3e2723" }}>Vitrine</Link>
        <Link to="/cart" style={{ textDecoration: "none", color: "#3e2723" }}>Carrinho</Link>

        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "#3e2723" }}>Login</Link>
            <Link to="/signup" style={{ textDecoration: "none", color: "#3e2723" }}>Cadastro</Link>
          </>
        ) : (
          <button onClick={onLogout} style={{ background: "transparent", border: "none", color: "#3e2723", cursor: "pointer" }}>
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}
