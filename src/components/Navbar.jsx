import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout, isDarkMode, toggleDarkMode }) {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px 20px', 
            alignItems: 'center', 
            background: 'var(--color-card-bg)', 
            borderBottom: '1px solid var(--color-bg-light)',
            color: 'var(--color-text-dark)'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
      
                <Link to="/">🧁 Cupcake Lovers</Link>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
               
               <label className="dark-mode-toggle">
                  <input 
                      type="checkbox" 
                      checked={isDarkMode} 
                      onChange={toggleDarkMode} 
                  />
                  <span className="slider"></span>
                </label>
                
            
                <Link to="/">Vitrine</Link> 

                <Link to="/cart">🛒 Carrinho</Link>

                {user ? (
                    <>
                        <span style={{ fontSize: '0.9em' }}>Olá, {user.email}</span>
                        <button onClick={onLogout} className="btn btn-auth-secondary">Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Entrar</Link>
                        <Link to="/signup">Cadastrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}