const statusConfig = {
	pending: { label: "Ожидает", color: "#f39c12", bg: "#fef3cd" },
	processing: { label: "В обработке", color: "#3498db", bg: "#d1ecf1" },
	shipped: { label: "Отправлен", color: "#9b59b6", bg: "#e8daef" },
	delivered: { label: "Доставлен", color: "#27ae60", bg: "#d4edda" },
	cancelled: { label: "Отменен", color: "#e74c3c", bg: "#f8d7da" },
};

function OrderStatusBadge({ status }) {
	const config = statusConfig[status] || statusConfig.pending;

	return (
		<span
			className="status-badge"
			style={{
				backgroundColor: config.bg,
				color: config.color,
				border: `1px solid ${config.color}`,
			}}
		>
			{config.label}
		</span>
	);
}

export default OrderStatusBadge;
