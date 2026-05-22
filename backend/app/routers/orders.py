from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=schemas.OrderCreateResponse)
async def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    for item in order_data.items:
        product = (
            db.query(models.Product)
            .filter(models.Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Товар с ID {item.product_id} не найден",
            )

        if product.in_stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Недостаточно товара "{product.name}" на складе. '
                f"Доступно: {product.in_stock}, запрошено: {item.quantity}",
            )

    order = models.Order(
        customer_name=order_data.customer.name,
        customer_email=order_data.customer.email,
        customer_phone=order_data.customer.phone,
        customer_address=order_data.customer.address,
        comment=order_data.comment,
        total=order_data.total,
        status="pending",
    )

    db.add(order)
    db.flush()  # ID заказа

    for item in order_data.items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            price=item.price,
            quantity=item.quantity,
        )
        db.add(order_item)

        product = (
            db.query(models.Product)
            .filter(models.Product.id == item.product_id)
            .first()
        )
        product.in_stock -= item.quantity

    db.commit()
    db.refresh(order)

    return schemas.OrderCreateResponse(
        data={"order_id": order.id, "status": order.status, "total": order.total},
        message=f"Заказ #{order.id} успешно создан",
    )


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден"
        )

    return {
        "success": True,
        "data": {
            "id": order.id,
            "customer": {
                "name": order.customer_name,
                "email": order.customer_email,
                "phone": order.customer_phone,
                "address": order.customer_address,
            },
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
            "total": order.total,
            "status": order.status,
            "comment": order.comment,
            "created_at": order.created_at.isoformat(),
        },
    }


@router.get("/", response_model=dict)
async def get_orders(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    total = db.query(models.Order).count()

    return {
        "success": True,
        "data": [
            {
                "id": order.id,
                "customer_name": order.customer_name,
                "customer_email": order.customer_email,
                "total": order.total,
                "status": order.status,
                "items_count": len(order.items),
                "created_at": order.created_at.isoformat(),
            }
            for order in orders
        ],
        "total": total,
        "skip": skip,
        "limit": limit,
    }
