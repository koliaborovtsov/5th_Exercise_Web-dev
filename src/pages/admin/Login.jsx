import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginAdmin, clearAuthError } from "../../store/slices/authSlice";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated, loading, error } = useSelector(
		(state) => state.auth,
	);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/admin");
		}
		return () => {
			dispatch(clearAuthError());
		};
	}, [isAuthenticated, navigate, dispatch]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginAdmin({ username, password }));
	};

	return (
		<div className="admin-login">
			<div className="admin-login-card">
				<div className="admin-login-header">
					<span className="admin-login-icon">💡</span>
					<h1>LampStore</h1>
					<p>Панель управления</p>
				</div>

				<form onSubmit={handleSubmit} className="admin-login-form">
					{error && (
						<div className="error-message">
							<span>⚠️</span> {error}
						</div>
					)}

					<div className="form-group">
						<label>Логин</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							placeholder="Введите логин"
						/>
					</div>

					<div className="form-group">
						<label>Пароль</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="Введите пароль"
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary btn-block"
						disabled={loading}
					>
						{loading ? "Вход..." : "Войти"}
					</button>
				</form>

				<div className="admin-login-hint">
					<p>Демо-доступ: admin / admin123</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
