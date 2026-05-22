import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', comment: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Введите имя';
    if (!formData.email.trim()) errors.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Неверный формат email';
    if (!formData.phone.trim()) errors.phone = 'Введите телефон';
    if (!formData.address.trim()) errors.address = 'Введите адрес';
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setLoading(true);
    setServerError('');

    const orderData = {
      customer: { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address },
      items: items.map((item) => ({ product_id: item.id, product_name: item.name, price: item.price, quantity: item.quantity })),
      total,
      comment: formData.comment,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate('/order-confirmation');
    } catch (err) {
      setServerError('Не удалось оформить заказ. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, required = false }) => (
    <div className="form-group">
      <label>{label}{required && ' *'}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={formErrors[name] ? 'error' : ''}
      />
      {formErrors[name] && <span className="field-error">{formErrors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout">
      <h1>Оформление заказа</h1>

      {serverError && <div className="error-message">{serverError}</div>}

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Контактные данные</h2>
          <Field name="name" label="Имя" placeholder="Введите ваше имя" required />
          <Field name="email" label="Email" type="email" placeholder="example@mail.ru" required />
          <Field name="phone" label="Телефон" type="tel" placeholder="+7 (999) 999-99-99" required />
          <Field name="address" label="Адрес доставки" placeholder="Введите адрес доставки" required />
          <div className="form-group">
            <label>Комментарий к заказу</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Дополнительная информация"
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
            {loading ? 'Оформление...' : 'Подтвердить заказ'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Ваш заказ</h2>
          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Итого: {total.toLocaleString()} ₽</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
