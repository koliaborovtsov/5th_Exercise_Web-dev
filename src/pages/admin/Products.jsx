import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";

function Products() {
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [deleteConfirm, setDeleteConfirm] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
                loadProducts();
        }, []);

        const loadProducts = async () => {
                try {
                        const response = await adminApi.getProducts();
                        setProducts(response.data);
                } catch (error) {
                        console.error("Ошибка загрузки товаров:", error);
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                try {
                        await adminApi.deleteProduct(id);
                        setProducts(products.filter((p) => p.id !== id));
                        setDeleteConfirm(null);
                } catch (error) {
                        console.error("Ошибка удаления:", error);
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
                <div className="admin-products">
                        <div className="admin-header">
                                <h1>Товары ({products.length})</h1>
                                <Link to="/admin/products/new/edit" className="btn btn-primary">
                                        + Добавить товар
                                </Link>
                        </div>

                        <div className="admin-table-container">
                                <table className="admin-table">
                                        <thead>
                                                <tr>
                                                        <th>ID</th>
                                                        <th>Изображение</th>
                                                        <th>Название</th>
                                                        <th>Категория</th>
                                                        <th>Цена</th>
                                                        <th>Склад</th>
                                                        <th>Действия</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {products.map((product) => (
                                                        <tr key={product.id}>
                                                                <td>{product.id}</td>
                                                                <td>
                                                                        <img
                                                                                src={product.image}
                                                                                alt={product.name}
                                                                                className="admin-product-image"
                                                                        />
                                                                </td>
                                                                <td>{product.name}</td>
                                                                <td>{product.category}</td>
                                                                <td>{product.price.toLocaleString()} ₽</td>
                                                                <td>
                                                                        <span
                                                                                className={
                                                                                        product.in_stock > 0
                                                                                                ? "text-success"
                                                                                                : "text-danger"
                                                                                }
                                                                        >
                                                                                {product.in_stock} шт.
                                                                        </span>
                                                                </td>
                                                                <td>
                                                                        <div className="table-actions">
                                                                                <button
                                                                                        onClick={() =>
                                                                                                navigate(
                                                                                                        `/admin/products/${product.id}/edit`,
                                                                                                )
                                                                                        }
                                                                                        className="btn btn-small btn-secondary"
                                                                                >
                                                                                        ✏️
                                                                                </button>
                                                                                <button
                                                                                        onClick={() =>
                                                                                                setDeleteConfirm(product)
                                                                                        }
                                                                                        className="btn btn-small btn-danger"
                                                                                >
                                                                                        🗑️
                                                                                </button>
                                                                        </div>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        {deleteConfirm && (
                                <div className="modal-overlay">
                                        <div className="modal">
                                                <h2>Подтверждение удаления</h2>
                                                <p>
                                                        Вы уверены, что хотите удалить товар "
                                                        {deleteConfirm.name}"?
                                                </p>
                                                <div className="modal-actions">
                                                        <button
                                                                onClick={() => handleDelete(deleteConfirm.id)}
                                                                className="btn btn-danger"
                                                        >
                                                                Удалить
                                                        </button>
                                                        <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="btn btn-secondary"
                                                        >
                                                                Отмена
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
}

export default Products;
