import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://your-api-url:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const profileService = {
    getProfile: () => api.get('/api/profile/'),
    updateProfile: (data) => api.put('/api/profile/', data),
};

export const shoppingListService = {
    getList: () => api.get('/api/shopping-list/'),
    addItem: (listId, item) => api.post(`/api/shopping-list/${listId}/add_item/`, item),
    toggleItem: (listId, itemId) => api.post(`/api/shopping-list/${listId}/toggle_item/`, { item_id: itemId }),
    removeItem: (listId, itemId) => api.delete(`/api/shopping-list/${listId}/items/${itemId}/`),
};

export const mealPlanService = {
    getMealPlans: () => api.get('/api/meal-plans/'),
    createMealPlan: (data) => api.post('/api/meal-plans/', data),
};