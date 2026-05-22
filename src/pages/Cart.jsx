import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../store/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Корзина ({count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'})</h1>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.price.toLocaleString()} ₽</p>
            </div>
            <div className="cart-item-quantity">
              <button
                className="qty-btn"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
              >-</button>
              <span>{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
              >+</button>
            </div>
            <div className="cart-item-total">
              {(item.price * item.quantity).toLocaleString()} ₽
            </div>
            <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <button className="btn btn-secondary" onClick={() => dispatch(clearCart())}>
          Очистить корзину
        </button>
        <div className="cart-summary">
          <span className="cart-total">Итого: {total.toLocaleString()} ₽</span>
          <Link to="/checkout" className="btn btn-primary">Оформить заказ</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
