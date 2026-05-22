import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";

function ProductCard({ product }) {
	const dispatch = useDispatch();

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(addToCart({ product, quantity: 1 }));
	};

	return (
		<div className="product-card">
			<Link to={`/product/${product.id}`} className="product-card-link">
				<div className="product-image">
					<img src={product.image} alt={product.name} />
					{product.inStock <= 5 && product.inStock > 0 && (
						<span className="stock-badge low-stock">Мало</span>
					)}
					{product.inStock === 0 && (
						<span className="stock-badge out-of-stock">
							Нет в наличии
						</span>
					)}
				</div>
				<div className="product-info">
					<h3 className="product-name">{product.name}</h3>
					<span className="product-category">{product.category}</span>
					<p className="product-price">
						{product.price.toLocaleString()} ₽
					</p>
				</div>
			</Link>
			<button
				className="add-to-cart-btn"
				onClick={handleAddToCart}
				disabled={product.inStock === 0}
			>
				{product.inStock === 0 ? "Нет в наличии" : "В корзину"}
			</button>
		</div>
	);
}

export default ProductCard;
