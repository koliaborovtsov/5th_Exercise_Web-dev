import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";

function OrderDetail() {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadOrder();
	}, [id]);

	const loadOrder = async () => {
		try {
			const response = await adminApi.getOrder(id);
			setOrder(response.data);
		} catch (error) {
			console.error("Ошибка загрузки заказа:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (newStatus) => {
		try {
			await adminApi.updateOrderStatus(id, newStatus);
			setOrder({ ...order, status: newStatus });
		} catch (error) {
			console.error("Ошибка обновления статуса:", error);
		}
	};

	if (loading) {
		return (
			<div className="admin-loader">
				<div className="loader"></div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="admin-error">
				<h2>Заказ не найден</h2>
				<Link to="/admin/orders" className="btn btn-primary">
					Назад к заказам
				</Link>
			</div>
		);
	}

	return (
		<div className="admin-order-detail">
			<Link to="/admin/orders" className="back-link">
				← Назад к заказам
			</Link>

			<div className="order-detail-header">
				<h1>Заказ #{order.id}</h1>
				<OrderStatusBadge status={order.status} />
			</div>

			<div className="order-detail-sections">
				<div className="order-detail-section">
					<h2>Информация о клиенте</h2>
					<div className="info-grid">
						<div className="info-item">
							<span className="info-label">Имя</span>
							<span className="info-value">
								{order.customer_name}
							</span>
						</div>
						<div className="info-item">
							<span className="info-label">Email</span>
							<span className="info-value">
								{order.customer_email}
							</span>
						</div>
						<div className="info-item">
							<span className="info-label">Телефон</span>
							<span className="info-value">
								{order.customer_phone}
							</span>
						</div>
						<div className="info-item">
							<span className="info-label">Адрес</span>
							<span className="info-value">
								{order.customer_address}
							</span>
						</div>
						{order.comment && (
							<div className="info-item full-width">
								<span className="info-label">Комментарий</span>
								<span className="info-value">
									{order.comment}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="order-detail-section">
					<h2>Товары в заказе</h2>
					<table className="admin-table">
						<thead>
							<tr>
								<th>Товар</th>
								<th>Цена</th>
								<th>Количество</th>
								<th>Сумма</th>
							</tr>
						</thead>
						<tbody>
							{order.items.map((item) => (
								<tr key={item.id}>
									<td>{item.product_name}</td>
									<td>{item.price.toLocaleString()} ₽</td>
									<td>{item.quantity}</td>
									<td>
										{(
											item.price * item.quantity
										).toLocaleString()}{" "}
										₽
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan="3">
									<strong>Итого</strong>
								</td>
								<td>
									<strong>
										{order.total.toLocaleString()} ₽
									</strong>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div className="order-detail-section">
					<h2>Управление статусом</h2>
					<div className="status-actions">
						{[
							"pending",
							"processing",
							"shipped",
							"delivered",
							"cancelled",
						].map((status) => (
							<button
								key={status}
								onClick={() => handleStatusChange(status)}
								className={`btn status-btn ${order.status === status ? "active" : ""}`}
								disabled={order.status === status}
							>
								{status === "pending" && "Ожидает"}
								{status === "processing" && "В обработке"}
								{status === "shipped" && "Отправлен"}
								{status === "delivered" && "Доставлен"}
								{status === "cancelled" && "Отменен"}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderDetail;
