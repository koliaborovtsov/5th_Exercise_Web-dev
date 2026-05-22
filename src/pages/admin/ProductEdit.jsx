import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import ProductForm from "../../components/admin/ProductForm";

function ProductEdit() {
        const { id } = useParams();
        const navigate = useNavigate();
        const [product, setProduct] = useState(null);
        const [loading, setLoading] = useState(true);
        const [saveError, setSaveError] = useState(null);
        const isNew = id === "new";

        useEffect(() => {
                if (!isNew) {
                        loadProduct();
                } else {
                        setLoading(false);
                }
        }, [id]);

        const loadProduct = async () => {
                try {
                        const response = await adminApi.getProduct(id);
                        setProduct(response.data);
                } catch (error) {
                        console.error("Ошибка загрузки товара:", error);
                        navigate("/admin/products");
                } finally {
                        setLoading(false);
                }
        };

        const handleSubmit = async (formData) => {
                setSaveError(null);
                try {
                        if (isNew) {
                                await adminApi.createProduct(formData);
                        } else {
                                await adminApi.updateProduct(id, formData);
                        }
                        navigate("/admin/products");
                } catch (error) {
                        console.error("Ошибка сохранения:", error);
                        setSaveError(error.message || "Ошибка сохранения товара");
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
                <div className="admin-product-edit">
                        <h1>{isNew ? "Создание товара" : "Редактирование товара"}</h1>
                        {saveError && (
                                <div className="alert alert-error">{saveError}</div>
                        )}
                        <ProductForm
                                initialData={product}
                                onSubmit={handleSubmit}
                                onCancel={() => navigate("/admin/products")}
                        />
                </div>
        );
}

export default ProductEdit;
