import { createSlice } from "@reduxjs/toolkit";

// Загружаем корзину из localStorage при инициализации
const loadCartFromStorage = () => {
	try {
		const savedCart = localStorage.getItem("lampStore_cart");
		return savedCart ? JSON.parse(savedCart) : [];
	} catch {
		return [];
	}
};

// Сохраняем корзину в localStorage
const saveCartToStorage = (cart) => {
	try {
		localStorage.setItem("lampStore_cart", JSON.stringify(cart));
	} catch {
		console.error("Не удалось сохранить корзину");
	}
};

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: loadCartFromStorage(),
		lastAddedProduct: null,
	},
	reducers: {
		addToCart: (state, action) => {
			const { product, quantity = 1 } = action.payload;
			const existingItem = state.items.find(
				(item) => item.id === product.id,
			);

			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				state.items.push({
					id: product.id,
					name: product.name,
					price: product.price,
					image: product.image,
					quantity,
				});
			}

			state.lastAddedProduct = product.name;
			saveCartToStorage(state.items);
		},

		removeFromCart: (state, action) => {
			state.items = state.items.filter(
				(item) => item.id !== action.payload,
			);
			saveCartToStorage(state.items);
		},

		updateQuantity: (state, action) => {
			const { id, quantity } = action.payload;
			const item = state.items.find((item) => item.id === id);

			if (item) {
				if (quantity <= 0) {
					state.items = state.items.filter((item) => item.id !== id);
				} else {
					item.quantity = quantity;
				}
			}

			saveCartToStorage(state.items);
		},

		clearCart: (state) => {
			state.items = [];
			saveCartToStorage(state.items);
		},

		clearLastAdded: (state) => {
			state.lastAddedProduct = null;
		},
	},
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
	state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) =>
	state.cart.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);

export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	clearLastAdded,
} = cartSlice.actions;

export default cartSlice.reducer;
