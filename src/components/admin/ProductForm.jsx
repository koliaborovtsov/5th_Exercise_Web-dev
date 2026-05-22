import { useState, useEffect } from "react";

const defaultFormData = {
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        power: "",
        color_temp: "",
        base_type: "",
        luminous_flux: "",
        in_stock: "0",
};

const categories = [
        "Светодиодные",
        "Галогенные",
        "Лампы накаливания",
        "Умные лампы",
        "Декоративные",
        "Люминесцентные",
        "Специальные",
];

function ProductForm({ initialData, onSubmit, onCancel }) {
        const [formData, setFormData] = useState(defaultFormData);
        const [errors, setErrors] = useState({});

        useEffect(() => {
                if (initialData) {
                        setFormData({
                                name: initialData.name || "",
                                category: initialData.category || "",
                                price: initialData.price?.toString() || "",
                                image: initialData.image || "",
                                description: initialData.description || "",
                                power: initialData.power || "",
                                color_temp: initialData.color_temp || "",
                                base_type: initialData.base_type || "",
                                luminous_flux: initialData.luminous_flux || "",
                                in_stock: initialData.in_stock?.toString() || "0",
                        });
                }
        }, [initialData]);

        const validate = () => {
                const newErrors = {};
                if (!formData.name.trim()) newErrors.name = "Обязательное поле";
                if (!formData.category) newErrors.category = "Выберите категорию";
                if (!formData.price || parseFloat(formData.price) <= 0)
                        newErrors.price = "Введите корректную цену";
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
                e.preventDefault();
                if (!validate()) return;

                onSubmit({
                        ...formData,
                        price: parseFloat(formData.price),
                        in_stock: parseInt(formData.in_stock) || 0,
                });
        };

        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
                if (errors[name]) {
                        setErrors((prev) => ({ ...prev, [name]: "" }));
                }
        };

        return (
                <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                                <div className="form-group">
                                        <label>Название товара *</label>
                                        <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={errors.name ? "error" : ""}
                                        />
                                        {errors.name && (
                                                <span className="field-error">{errors.name}</span>
                                        )}
                                </div>

                                <div className="form-group">
                                        <label>Категория *</label>
                                        <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className={errors.category ? "error" : ""}
                                        >
                                                <option value="">Выберите категорию</option>
                                                {categories.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                                {cat}
                                                        </option>
                                                ))}
                                        </select>
                                        {errors.category && (
                                                <span className="field-error">{errors.category}</span>
                                        )}
                                </div>
                        </div>

                        <div className="form-row">
                                <div className="form-group">
                                        <label>Цена (₽) *</label>
                                        <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className={errors.price ? "error" : ""}
                                        />
                                        {errors.price && (
                                                <span className="field-error">{errors.price}</span>
                                        )}
                                </div>

                                <div className="form-group">
                                        <label>Количество на складе</label>
                                        <input
                                                type="number"
                                                name="in_stock"
                                                value={formData.in_stock}
                                                onChange={handleChange}
                                                min="0"
                                        />
                                </div>
                        </div>

                        <div className="form-group">
                                <label>URL изображения</label>
                                <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                />
                                {formData.image && (
                                        <div className="image-preview">
                                                <img src={formData.image} alt="Preview" />
                                        </div>
                                )}
                        </div>

                        <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                />
                        </div>

                        <h3>Характеристики</h3>
                        <div className="form-row">
                                <div className="form-group">
                                        <label>Мощность</label>
                                        <input
                                                type="text"
                                                name="power"
                                                value={formData.power}
                                                onChange={handleChange}
                                                placeholder="Например: 10W"
                                        />
                                </div>

                                <div className="form-group">
                                        <label>Цветовая температура</label>
                                        <input
                                                type="text"
                                                name="color_temp"
                                                value={formData.color_temp}
                                                onChange={handleChange}
                                                placeholder="Например: 2700K"
                                        />
                                </div>
                        </div>

                        <div className="form-row">
                                <div className="form-group">
                                        <label>Цоколь</label>
                                        <input
                                                type="text"
                                                name="base_type"
                                                value={formData.base_type}
                                                onChange={handleChange}
                                                placeholder="Например: E27"
                                        />
                                </div>

                                <div className="form-group">
                                        <label>Световой поток</label>
                                        <input
                                                type="text"
                                                name="luminous_flux"
                                                value={formData.luminous_flux}
                                                onChange={handleChange}
                                                placeholder="Например: 800 лм"
                                        />
                                </div>
                        </div>

                        <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                        {initialData ? "Сохранить изменения" : "Создать товар"}
                                </button>
                                {onCancel && (
                                        <button
                                                type="button"
                                                onClick={onCancel}
                                                className="btn btn-secondary"
                                        >
                                                Отмена
                                        </button>
                                )}
                        </div>
                </form>
        );
}

export default ProductForm;
