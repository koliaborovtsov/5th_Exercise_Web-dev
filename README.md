# LampStore — Интернет-магазин ламп

React-приложение интернет-магазина с каталогом товаров, корзиной и оформлением заказа.

- Каталог товаров с поиском и фильтрацией по категориям
- Страница детального просмотра товара с характеристиками
- Корзина с управлением количеством и удалением товаров
- Оформление заказа с формой данных покупателя
- Swagger UI по адресу `/api/docs`

## Требования

- [Node.js] версии 18 или выше
- Python 3.11+

### Запуск бэк

```bash
python3 -m pip install -r backend/requirements.txt
```

```bash
cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Запуск фронт

```bash
npm install
```
Далее

```bash
npm run dev
```

Приложение: [http://localhost:5000](http://localhost:5000)
Документация API: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
