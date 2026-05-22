import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";

function Dashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const response = await adminApi.getStats();
			setStats(response.data);
		} catch (error) {
			console.error("Ошибка загрузки статистики:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="admin-loader">
				<div className="loader"></div>
				<p>Загрузка...</p>
			</div>
		);
	}

	return (
		<div className="admin-dashboard">
			<h1>Дашборд</h1>

			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-icon">💡</div>
					<div className="stat-info">
						<span className="stat-value">
							{stats?.total_products || 0}
						</span>
						<span className="stat-label">Товаров</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">📦</div>
					<div className="stat-info">
						<span className="stat-value">
							{stats?.total_orders || 0}
						</span>
						<span className="stat-label">Заказов</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">💰</div>
					<div className="stat-info">
						<span className="stat-value">
							{(stats?.total_revenue || 0).toLocaleString()} ₽
						</span>
						<span className="stat-label">Выручка</span>
					</div>
				</div>
			</div>

			<div className="dashboard-section">
				<h2>Заказы по статусам</h2>
				<div className="status-stats">
					{stats?.orders_by_status &&
						Object.entries(stats.orders_by_status).map(
							([status, count]) => (
								<Link
									key={status}
									to={`/admin/orders?status=${status}`}
									className="status-stat-card"
								>
									<span className="status-stat-count">
										{count}
									</span>
									<span className="status-stat-label">
										{status === "pending" && "Ожидают"}
										{status === "processing" &&
											"В обработке"}
										{status === "shipped" && "Отправлены"}
										{status === "delivered" && "Доставлены"}
										{status === "cancelled" && "Отменены"}
									</span>
								</Link>
							),
						)}
				</div>
			</div>

			<div className="dashboard-actions">
				<Link to="/admin/products" className="btn btn-primary">
					Управление товарами
				</Link>
				<Link to="/admin/orders" className="btn btn-secondary">
					Просмотр заказов
				</Link>
			</div>
		</div>
	);
}

export default Dashboard;
