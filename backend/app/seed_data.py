from .database import SessionLocal, init_db
from .models import Product


def seed_products():
	db = SessionLocal()

	try:
		# Проверяем, есть ли уже товары
		if db.query(Product).count() > 0:
			print("База данных уже содержит товары, пропускаем заполнение")
			return

		products = [
			Product(
				name="Светодиодная лампа EcoLight 10W",
				category="Светодиодные",
				price=350,
				image="https://placehold.co/400x400/FDB813/FFFFFF?text=EcoLight+10W",
				description="Энергосберегающая LED-лампа с теплым светом 2700K. Срок службы 25000 часов.",
				power="10W",
				color_temp="2700K",
				base_type="E27",
				luminous_flux="800 лм",
				in_stock=25
			),
			Product(
				name="Галогенная лампа BrightPro 50W",
				category="Галогенные",
				price=180,
				image="https://placehold.co/400x400/FF6B35/FFFFFF?text=BrightPro+50W",
				description="Яркая галогенная лампа с естественной цветопередачей. Идеальна для чтения и работы.",
				power="50W",
				color_temp="3000K",
				base_type="GU5.3",
				luminous_flux="900 лм",
				in_stock=15
			),
			Product(
				name="Умная лампа SmartGlow RGB",
				category="Умные лампы",
				price=1200,
				image="https://placehold.co/400x400/8E44AD/FFFFFF?text=SmartGlow+RGB",
				description="Wi-Fi лампа с поддержкой RGB и управлением через приложение. Совместима с Алисой и Google Home.",
				power="9W",
				color_temp="2700-6500K",
				base_type="E27",
				luminous_flux="800 лм",
				in_stock=8
			),
			Product(
				name="Лампа накаливания Classic 60W",
				category="Лампы накаливания",
				price=45,
				image="https://placehold.co/400x400/FFD700/333333?text=Classic+60W",
				description="Классическая лампа накаливания с теплым, уютным светом. Ретро-дизайн.",
				power="60W",
				color_temp="2700K",
				base_type="E27",
				luminous_flux="710 лм",
				in_stock=100
			),
			Product(
				name="Светодиодная лампа UltraBright 15W",
				category="Светодиодные",
				price=450,
				image="https://placehold.co/400x400/3498DB/FFFFFF?text=UltraBright+15W",
				description="Мощная LED-лампа для больших помещений. Холодный белый свет 5000K.",
				power="15W",
				color_temp="5000K",
				base_type="E27",
				luminous_flux="1500 лм",
				in_stock=30
			),
			Product(
				name="Декоративная лампа Filament LED",
				category="Декоративные",
				price=550,
				image="https://placehold.co/400x400/E67E22/FFFFFF?text=Filament+LED",
				description="Светодиодная лампа с филаментными нитями в стиле ретро. Энергопотребление всего 6W.",
				power="6W",
				color_temp="2200K",
				base_type="E27",
				luminous_flux="600 лм",
				in_stock=12
			)
		]

		for product in products:
			db.add(product)

		db.commit()
		print(f"Успешно добавлено {len(products)} товаров")

	except Exception as e:
		db.rollback()
		print(f"Ошибка при заполнении базы: {e}")
	finally:
		db.close()