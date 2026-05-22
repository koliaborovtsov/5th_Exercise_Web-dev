from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .seed_data import seed_products
from .routers import products, orders, admin

app = FastAPI(
    title="LampStore API",
    description="API для интернет-магазина ламп",
    version="1.0.0",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.on_event("startup")
async def startup_event():
    print("Запуск LampStore API...")
    init_db()
    print("База данных инициализирована")
    seed_products()
    print("Запуск завершен!")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "LampStore API работает", "version": "1.0.0"}
