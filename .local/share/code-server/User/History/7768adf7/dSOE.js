import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Instead of importing from @env, use process.env directly
const PRIVATE_IP = process.env.EXPO_PUBLIC_PRIVATE_IP;

// Thunk for fetching habits
export const fetchHabits = createAsyncThunk(
    'habits/fetchHabits',
    async () => {
        const response = await fetch(`http://${PRIVATE_IP}:8000/api/habits/`);
        const data = await response.json();
        return data.habits;
    }
);

// Thunk for creating a new habit
export const createHabit = createAsyncThunk(
    'habits/createHabit',
    async (habitData) => {
        const response = await fetch(`http://${PRIVATE_IP}:8000/api/habits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(habitData),
        });
        const data = await response.json();
        return data;
    }
);

// Thunk for logging habit completion
export const logHabitCompletion = createAsyncThunk(
    'habits/logCompletion',
    async ({ habitId, completed, notes }) => {
        const response = await fetch(`http://${EXPO_PUBLIC_PRIVATE_IP}:8000/api/habits/${habitId}/log/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed, notes }),
        });
        const data = await response.json();
        return { habitId, data };
    }
);

const habitSlice = createSlice({
    name: 'habits',
    initialState: {
        habits: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabits.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createHabit.fulfilled, (state, action) => {
                state.habits.push(action.payload);
            })
            .addCase(logHabitCompletion.fulfilled, (state, action) => {
                const habit = state.habits.find(h => h.id === action.payload.habitId);
                if (habit) {
                    habit.lastLog = action.payload.data;
                }
            });
    },
});

export default habitSlice.reducer;