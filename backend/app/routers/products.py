from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/", response_model=schemas.ProductsListResponse)
async def get_products(
    category: str = None, search: str = None, db: Session = Depends(get_db)
):
    """
    Получение списка всех товаров

    - **category**: Фильтр по категории
    - **search**: Поиск по названию и описанию
    """
    query = db.query(models.Product)

    if category:
        query = query.filter(models.Product.category == category)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Product.name.ilike(search_term))
            | (models.Product.description.ilike(search_term))
        )

    products = query.all()

    return schemas.ProductsListResponse(
        data=[
            schemas.ProductResponse(
                id=p.id,
                name=p.name,
                category=p.category,
                price=p.price,
                image=p.image,
                description=p.description,
                power=p.power,
                color_temp=p.color_temp,
                base_type=p.base_type,
                luminous_flux=p.luminous_flux,
                in_stock=p.in_stock,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
            for p in products
        ],
        total=len(products),
    )


@router.get("/{product_id}", response_model=schemas.ProductSingleResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Получение детальной информации о товаре по ID
    """
    product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден"
        )

    # Характеристики
    specifications = schemas.ProductSpecifications(
        power=product.power or "Не указано",
        colorTemp=product.color_temp or "Не указано",
        base=product.base_type or "Не указано",
        luminousFlux=product.luminous_flux or "Не указано",
    )

    return schemas.ProductSingleResponse(
        data=schemas.ProductDetailResponse(
            id=product.id,
            name=product.name,
            category=product.category,
            price=product.price,
            image=product.image,
            description=product.description,
            power=product.power,
            color_temp=product.color_temp,
            base_type=product.base_type,
            luminous_flux=product.luminous_flux,
            in_stock=product.in_stock,
            created_at=product.created_at,
            updated_at=product.updated_at,
            specifications=specifications,
        )
    )


@router.get("/categories/list", response_model=dict)
async def get_categories(db: Session = Depends(get_db)):
    """
    Получение списка всех категорий
    """
    categories = db.query(models.Product.category).distinct().all()
    return {"success": True, "data": [cat[0] for cat in categories]}
