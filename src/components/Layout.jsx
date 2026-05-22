import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearLastAdded } from '../store/slices/cartSlice';
import CartBadge from './CartBadge';

function Layout() {
  const dispatch = useDispatch();
  const lastAdded = useSelector((state) => state.cart.lastAddedProduct);

  useEffect(() => {
    if (lastAdded) {
      const timer = setTimeout(() => dispatch(clearLastAdded()), 2500);
      return () => clearTimeout(timer);
    }
  }, [lastAdded, dispatch]);

  return (
    <div className="app">
      {lastAdded && (
        <div className="notification">
          <span className="notification-icon">✓</span>
          «{lastAdded}» добавлен в корзину
        </div>
      )}

      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">💡</span>
              <span className="logo-text">LampStore</span>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">Каталог</Link>
              <Link to="/cart" className="nav-link cart-link">
                Корзина
                <CartBadge />
              </Link>
              <Link to="/admin/login" className="nav-link nav-link-admin">Войти</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
