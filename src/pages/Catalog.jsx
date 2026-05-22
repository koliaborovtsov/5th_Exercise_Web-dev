import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  clearError,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function Catalog() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => { dispatch(clearError()); dispatch(fetchProducts()); }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="catalog">
      <h1>Каталог ламп</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск ламп..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <p>По вашему запросу ничего не найдено</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
