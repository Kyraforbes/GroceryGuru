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
            // Log the request data for debugging
            console.log('Sending registration request with data:', userData);
            
            const response = await api.post('/register/', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            
            console.log('Registration response:', response.data);
            return response;
        } catch (error) {
            console.error('Registration error details:', error.response?.data);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/login/', credentials);
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
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
    updateProfile: (data) => api.put('/profile/', data),
};

// Shopping list services
export const shoppingListService = {
    getList: () => api.get('/shopping-list/'),
    addItem: (item) => api.post('/shopping-list/add_item/', item),
    toggleItem: (itemId) => api.post('/shopping-list/toggle_item/', { item_id: itemId }),
    removeItem: (itemId) => api.delete(`/shopping-list/items/${itemId}/`),
    clearCompleted: () => api.post('/shopping-list/clear_completed/'),
    addItemsFromMeal: (items) => api.post('/shopping-list/update_from_meal_plan/', items),
    updateFromMealPlan: (mealPlanId) => api.post('/shopping-list/update_from_meal_plan/', {
        meal_plan_id: mealPlanId
    }),
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