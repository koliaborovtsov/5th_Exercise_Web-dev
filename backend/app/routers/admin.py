from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=schemas.LoginResponse)
async def login(login_data: schemas.LoginRequest):
    admin = auth.authenticate_admin(login_data.username, login_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин или пароль"
        )

    access_token = auth.create_access_token(
        data={"sub": admin["username"], "role": admin["role"]}
    )

    return schemas.LoginResponse(access_token=access_token, user=admin)


@router.get("/me")
async def get_me(current_admin: dict = Depends(auth.get_current_admin)):
    return {"success": True, "data": current_admin}


@router.get("/products", response_model=dict)
async def get_all_products(
    db: Session = Depends(get_db), current_admin: dict = Depends(auth.get_current_admin)
):
    products = db.query(models.Product).all()
    return {
        "success": True,
        "data": [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "price": p.price,
                "image": p.image,
                "description": p.description,
                "power": p.power,
                "color_temp": p.color_temp,
                "base_type": p.base_type,
                "luminous_flux": p.luminous_flux,
                "in_stock": p.in_stock,
                "created_at": p.created_at.isoformat() if p.created_at else None,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in products
        ],
        "total": len(products),
    }


@router.post("/products", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: schemas.AdminProductCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    product = models.Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "success": True,
        "data": {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "image": product.image,
            "in_stock": product.in_stock,
        },
        "message": "Товар успешно создан",
    }


@router.get("/products/{product_id}", response_model=dict)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден"
        )

    return {
        "success": True,
        "data": {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "image": product.image,
            "description": product.description,
            "power": product.power,
            "color_temp": product.color_temp,
            "base_type": product.base_type,
            "luminous_flux": product.luminous_flux,
            "in_stock": product.in_stock,
            "created_at": product.created_at.isoformat()
            if product.created_at
            else None,
            "updated_at": product.updated_at.isoformat()
            if product.updated_at
            else None,
        },
    }


@router.put("/products/{product_id}", response_model=dict)
async def update_product(
    product_id: int,
    product_data: schemas.AdminProductUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден"
        )

    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return {
        "success": True,
        "data": {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "in_stock": product.in_stock,
        },
        "message": "Товар успешно обновлен",
    }


@router.delete("/products/{product_id}", response_model=dict)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден"
        )

    db.delete(product)
    db.commit()

    return {"success": True, "message": "Товар успешно удален"}


@router.get("/orders", response_model=dict)
async def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    query = db.query(models.Order)

    if status_filter:
        query = query.filter(models.Order.status == status_filter)

    total = query.count()
    orders = (
        query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()
    )

    return {
        "success": True,
        "data": [
            {
                "id": order.id,
                "customer_name": order.customer_name,
                "customer_email": order.customer_email,
                "customer_phone": order.customer_phone,
                "customer_address": order.customer_address,
                "comment": order.comment,
                "total": order.total,
                "status": order.status,
                "items_count": len(order.items),
                "created_at": order.created_at.isoformat()
                if order.created_at
                else None,
            }
            for order in orders
        ],
        "total": total,
    }


@router.get("/orders/{order_id}", response_model=dict)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден"
        )

    return {
        "success": True,
        "data": {
            "id": order.id,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone,
            "customer_address": order.customer_address,
            "comment": order.comment,
            "total": order.total,
            "status": order.status,
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "price": item.price,
                    "quantity": item.quantity,
                }
                for item in order.items
            ],
            "created_at": order.created_at.isoformat() if order.created_at else None,
        },
    }


@router.put("/orders/{order_id}/status", response_model=dict)
async def update_order_status(
    order_id: int,
    status_data: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(auth.get_current_admin),
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден"
        )

    order.status = status_data.status
    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "data": {"id": order.id, "status": order.status},
        "message": f'Статус заказа изменен на "{order.status}"',
    }


@router.get("/stats", response_model=dict)
async def get_stats(
    db: Session = Depends(get_db), current_admin: dict = Depends(auth.get_current_admin)
):
    total_products = db.query(models.Product).count()
    total_orders = db.query(models.Order).count()
    total_revenue = (
        db.query(models.Order)
        .filter(
            models.Order.status.in_(["pending", "processing", "shipped", "delivered"])
        )
        .with_entities(models.Order.total)
        .all()
    )

    revenue = sum(order.total for order in total_revenue)

    orders_by_status = {}
    statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    for status_name in statuses:
        count = (
            db.query(models.Order).filter(models.Order.status == status_name).count()
        )
        orders_by_status[status_name] = count

    return {
        "success": True,
        "data": {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": revenue,
            "orders_by_status": orders_by_status,
        },
    }
