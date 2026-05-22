import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProductById,
  clearSelectedProduct,
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import Loader from '../components/Loader';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="not-found">
        <h2>Ошибка: {error}</h2>
        <Link to="/" className="btn btn-primary">Вернуться в каталог</Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">← Назад в каталог</Link>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <span className="category-badge">{product.category}</span>
          <p className="price">{product.price.toLocaleString()} ₽</p>

          <div className="description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>

          <div className="specifications">
            <h3>Характеристики</h3>
            <table>
              <tbody>
                <tr><td>Мощность:</td><td>{product.specifications.power}</td></tr>
                <tr><td>Цветовая температура:</td><td>{product.specifications.colorTemp}</td></tr>
                <tr><td>Цоколь:</td><td>{product.specifications.base}</td></tr>
                <tr><td>Световой поток:</td><td>{product.specifications.luminousFlux}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="add-to-cart-section">
            <div className="quantity-control">
              <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
