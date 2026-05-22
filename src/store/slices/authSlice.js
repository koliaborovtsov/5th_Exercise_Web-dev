import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../api/adminApi";

export const loginAdmin = createAsyncThunk(
	"auth/login",
	async ({ username, password }, { rejectWithValue }) => {
		try {
			const response = await adminApi.login(username, password);
			localStorage.setItem("admin_token", response.access_token);
			localStorage.setItem("admin_user", JSON.stringify(response.user));
			return response;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const token = localStorage.getItem("admin_token");
const user = localStorage.getItem("admin_user");

const authSlice = createSlice({
	name: "auth",
	initialState: {
		isAuthenticated: !!token,
		user: user ? JSON.parse(user) : null,
		token: token,
		loading: false,
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			state.token = null;
			state.error = null;
			localStorage.removeItem("admin_token");
			localStorage.removeItem("admin_user");
		},
		clearAuthError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginAdmin.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginAdmin.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.access_token;
			})
			.addCase(loginAdmin.rejected, (state, action) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.error = action.payload;
			});
	},
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
