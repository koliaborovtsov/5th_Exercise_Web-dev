from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class ProductSpecifications(BaseModel):
    power: str
    colorTemp: str
    base: str
    luminousFlux: str

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    category: str
    price: float = Field(gt=0)
    image: str
    description: Optional[str] = None
    power: Optional[str] = None
    color_temp: Optional[str] = None
    base_type: Optional[str] = None
    luminous_flux: Optional[str] = None
    in_stock: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image: Optional[str] = None
    description: Optional[str] = None
    power: Optional[str] = None
    color_temp: Optional[str] = None
    base_type: Optional[str] = None
    luminous_flux: Optional[str] = None
    in_stock: Optional[int] = Field(None, ge=0)


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductResponse):
    specifications: Optional[ProductSpecifications] = None


class ProductsListResponse(BaseModel):
    success: bool = True
    data: List[ProductResponse]
    total: int


class ProductSingleResponse(BaseModel):
    success: bool = True
    data: ProductDetailResponse


class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    price: float
    quantity: int = Field(gt=0)


class OrderCustomer(BaseModel):
    name: str
    email: str
    phone: str
    address: str


class OrderCreate(BaseModel):
    customer: OrderCustomer
    items: List[OrderItemBase]
    total: float
    comment: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    comment: Optional[str] = None
    total: float
    status: str
    items: List[OrderItemResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class OrderCreateResponse(BaseModel):
    success: bool = True
    data: dict
    message: str = "Заказ успешно создан"


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|processing|shipped|delivered|cancelled)$")


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    message: str


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    success: bool = True
    access_token: str
    token_type: str = "bearer"
    user: dict


class AdminProductCreate(BaseModel):
    name: str
    category: str
    price: float = Field(gt=0)
    image: Optional[str] = None
    description: Optional[str] = None
    power: Optional[str] = None
    color_temp: Optional[str] = None
    base_type: Optional[str] = None
    luminous_flux: Optional[str] = None
    in_stock: int = Field(default=0, ge=0)


class AdminProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image: Optional[str] = None
    description: Optional[str] = None
    power: Optional[str] = None
    color_temp: Optional[str] = None
    base_type: Optional[str] = None
    luminous_flux: Optional[str] = None
    in_stock: Optional[int] = Field(None, ge=0)
