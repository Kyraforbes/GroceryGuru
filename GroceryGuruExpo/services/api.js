import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Authentication token handling
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Auth services
export const authService = {
    register: async (userData) => {
        try {
            console.log('Sending registration request with data:', {
                ...userData,
                password: '[HIDDEN]'
            });
            
            const response = await api.post('/register/', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            
            console.log('Registration response:', {
                ...response.data,
                token: '[HIDDEN]'
            });
            return response;
        } catch (error) {
            console.error('Registration error details:', error.response?.data);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/login/', {
                email: credentials.email,
                password: credentials.password
            });
            
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error.response?.data);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout/');
            setAuthToken(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Clear token even if logout fails
            setAuthToken(null);
            throw error;
        }
    }
};

// Profile services
export const profileService = {
    getProfile: () => api.get('/profile/'),
    updateProfile: (data) => api.put('/profile/', data)
};

// Shopping list services
export const shoppingListService = {
    getList: () => api.get('/shopping-list/'),
    addItem: (item) => api.post('/shopping-list/add_item/', item),
    toggleItem: (itemId) => api.post('/shopping-list/toggle_item/', { 
        item_id: itemId 
    }),
    removeItem: (itemId) => api.delete(`/shopping-list/items/${itemId}/`),
    clearCompleted: () => api.post('/shopping-list/clear_completed/'),
    addItemsFromMeal: (items) => api.post('/shopping-list/update_from_meal_plan/', items),
    updateFromMealPlan: (mealPlanId) => api.post('/shopping-list/update_from_meal_plan/', {
        meal_plan_id: mealPlanId
    })
};

// Meal plan services
export const mealPlanService = {
    getMealPlans: () => api.get('/meal-plans/'),
    createMealPlan: (data) => api.post('/meal-plans/', data),
    updateMealPlan: (id, data) => api.put(`/meal-plans/${id}/`, data),
    deleteMealPlan: (id) => api.delete(`/meal-plans/${id}/`),
    addMeal: (mealPlanId, mealData) => api.post(`/meal-plans/${mealPlanId}/add_meal/`, mealData),
    removeMeal: (mealPlanId, mealId) => api.delete(`/meal-plans/${mealPlanId}/remove_meal/`, {
        data: { meal_id: mealId }
    })
};

// Error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            setAuthToken(null);
        }
        return Promise.reject(error);
    }
);

export default api;