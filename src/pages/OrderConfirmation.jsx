import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentOrder } from '../store/slices/ordersSlice';

function OrderConfirmation() {
  const order = useSelector(selectCurrentOrder);
  const orderId = order?.orderId ?? '—';

  return (
    <div className="order-confirmation">
      <div className="success-icon">✓</div>
      <h1>Заказ успешно оформлен!</h1>
      <p className="order-number">
        Номер вашего заказа: <strong>#{orderId}</strong>
      </p>
      {order?.customer?.email && (
        <p>Подтверждение будет отправлено на <strong>{order.customer.email}</strong></p>
      )}
      <p>Наш менеджер свяжется с вами в ближайшее время.</p>
      <p>Спасибо за покупку!</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
        Вернуться в каталог
      </Link>
    </div>
  );
}

export default OrderConfirmation;
