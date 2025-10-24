import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";

import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }
    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription?.subscription?.unsubscribe?.();
  }, []);

  return (
    <div className={isDarkMode ? "dark-mode" : ""} style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      <Router>
        <Navbar 
          user={user} 
          onLogout={() => supabase.auth.signOut()} 
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(prev => !prev)}
        />

        <div className="app-container" style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;