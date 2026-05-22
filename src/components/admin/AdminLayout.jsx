import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

function AdminLayout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/admin/login");
	};

	return (
		<div className="admin-layout">
			<aside className="admin-sidebar">
				<div className="admin-sidebar-header">
					<h2>LampStore</h2>
					<span className="admin-badge">Админ-панель</span>
				</div>
				<nav className="admin-nav">
					<Link to="/admin" className="admin-nav-link">
						<span className="nav-icon">📊</span>
						Дашборд
					</Link>
					<Link to="/admin/products" className="admin-nav-link">
						<span className="nav-icon">💡</span>
						Товары
					</Link>
					<Link to="/admin/orders" className="admin-nav-link">
						<span className="nav-icon">📦</span>
						Заказы
					</Link>
					<Link to="/" className="admin-nav-link" target="_blank">
						<span className="nav-icon">🏪</span>
						Магазин
					</Link>
				</nav>
				<div className="admin-sidebar-footer">
					<div className="admin-user-info">
						<span className="admin-user-icon">👤</span>
						<span>{user?.username}</span>
					</div>
					<button onClick={handleLogout} className="admin-logout-btn">
						<span className="nav-icon">🚪</span>
						Выйти
					</button>
				</div>
			</aside>
			<main className="admin-content">
				<Outlet />
			</main>
		</div>
	);
}

export default AdminLayout;
