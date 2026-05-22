import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";

function Orders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const statusFilter = searchParams.get("status") || "";

	useEffect(() => {
		loadOrders();
	}, [statusFilter]);

	const loadOrders = async () => {
		try {
			const response = await adminApi.getOrders(statusFilter);
			setOrders(response.data);
		} catch (error) {
			console.error("Ошибка загрузки заказов:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			await adminApi.updateOrderStatus(orderId, newStatus);
			setOrders(
				orders.map((order) =>
					order.id === orderId
						? { ...order, status: newStatus }
						: order,
				),
			);
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

	return (
		<div className="admin-orders">
			<h1>Заказы ({orders.length})</h1>

			<div className="filter-tabs">
				<button
					onClick={() => navigate("/admin/orders")}
					className={`filter-tab ${!statusFilter ? "active" : ""}`}
				>
					Все
				</button>
				{[
					"pending",
					"processing",
					"shipped",
					"delivered",
					"cancelled",
				].map((status) => (
					<button
						key={status}
						onClick={() =>
							navigate(`/admin/orders?status=${status}`)
						}
						className={`filter-tab ${statusFilter === status ? "active" : ""}`}
					>
						{status === "pending" && "Ожидают"}
						{status === "processing" && "В обработке"}
						{status === "shipped" && "Отправлены"}
						{status === "delivered" && "Доставлены"}
						{status === "cancelled" && "Отменены"}
					</button>
				))}
			</div>

			<div className="admin-table-container">
				<table className="admin-table">
					<thead>
						<tr>
							<th>№ заказа</th>
							<th>Клиент</th>
							<th>Email</th>
							<th>Сумма</th>
							<th>Статус</th>
							<th>Дата</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>#{order.id}</td>
								<td>{order.customer_name}</td>
								<td>{order.customer_email}</td>
								<td>{order.total.toLocaleString()} ₽</td>
								<td>
									<OrderStatusBadge status={order.status} />
								</td>
								<td>
									{new Date(
										order.created_at,
									).toLocaleDateString()}
								</td>
								<td>
									<div className="table-actions">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(
													order.id,
													e.target.value,
												)
											}
											className="status-select"
										>
											<option value="pending">
												Ожидает
											</option>
											<option value="processing">
												В обработке
											</option>
											<option value="shipped">
												Отправлен
											</option>
											<option value="delivered">
												Доставлен
											</option>
											<option value="cancelled">
												Отменен
											</option>
										</select>
										<button
											onClick={() =>
												navigate(
													`/admin/orders/${order.id}`,
												)
											}
											className="btn btn-small btn-secondary"
										>
											👁️
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Orders;
