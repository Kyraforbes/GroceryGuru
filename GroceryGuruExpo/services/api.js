import axios from 'axios';

// Use your EC2 instance's public IP or domain
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token handling
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: (credentials) => api.post('/login/', credentials),
    register: (userData) => api.post('/register/', userData),
    logout: () => api.post('/logout/'),
};

// Profile services
export const profileService = {
    getProfile: () => api.get('/profile/'),
    updateProfile: (data) => api.put('/profile/', data),
};

// Shopping list services
export const shoppingListService = {
    getList: () => api.get('/shopping-list/'),
    addItem: (listId, item) => api.post(`/shopping-list/${listId}/add_item/`, item),
    toggleItem: (listId, itemId) => api.post(`/shopping-list/${listId}/toggle_item/`, { item_id: itemId }),
    removeItem: (listId, itemId) => api.delete(`/shopping-list/${listId}/items/${itemId}/`),
    clearCompleted: (listId) => api.post(`/shopping-list/${listId}/clear_completed/`),
    updateFromMealPlan: (listId, mealPlanId) => api.post(`/shopping-list/${listId}/update_from_meal_plan/`, { meal_plan_id: mealPlanId }),
};

// Meal plan services
export const mealPlanService = {
    getMealPlans: () => api.get('/meal-plans/'),
    createMealPlan: (data) => api.post('/meal-plans/', data),
    updateMealPlan: (id, data) => api.put(`/meal-plans/${id}/`, data),
    deleteMealPlan: (id) => api.delete(`/meal-plans/${id}/`),
    addMeal: (mealPlanId, mealData) => api.post(`/meal-plans/${mealPlanId}/add_meal/`, mealData),
    removeMeal: (mealPlanId, mealId) => api.delete(`/meal-plans/${mealPlanId}/meals/${mealId}/`),
};

// Meal services
export const mealService = {
    getMeals: () => api.get('/meals/'),
    getMealById: (id) => api.get(`/meals/${id}/`),
    createMeal: (data) => api.post('/meals/', data),
    updateMeal: (id, data) => api.put(`/meals/${id}/`, data),
    deleteMeal: (id) => api.delete(`/meals/${id}/`),
};

// Error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., clear token and redirect to login)
            AsyncStorage.removeItem('userToken');
        }
        return Promise.reject(error);
    }
);

export default api;