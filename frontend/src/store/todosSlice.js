import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = import.meta.env.VITE_API_URL + '/todos';

// Helper function to generate unique IDs
const generateId = () => Date.now() + Math.random()

// Helper function to get auth headers
const getAuthHeaders = (getState) => {
   const token = getState().auth.token
   return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
   }
}

// Mock data for fallback
const mockTodos = [
   {
      id: 1,
      title: "Task 1",
      description: "This is sample task 1",
      completed: false,
      task_order: 0,
      createdAt: new Date().toISOString(),
   },
   {
      id: 2,
      title: "Task 2",
      description: "This is sample task 2",
      completed: true,
      task_order: 1,
      createdAt: new Date().toISOString(),
   },
   {
      id: 3,
      title: "Task 3",
      description: "This is sample task 3",
      completed: false,
      task_order: 2,
      createdAt: new Date().toISOString(),
   },
]

// Async thunks for API calls with JWT authentication
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (_, { getState }) => {
   try {
      const response = await fetch(API_URL, {
         headers: getAuthHeaders(getState),
      })
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      const res = await response.json()
      return res.data
   } catch (error) {
      console.warn("API not available, using local mock data:", error.message)
      return mockTodos
   }
})

export const addTodo = createAsyncThunk("todos/addTodo", async (todoData, { getState }) => {
   try {
      const response = await fetch(API_URL, {
         method: "POST",
         headers: getAuthHeaders(getState),
         body: JSON.stringify(todoData),
      })
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }

      const res = await response.json()
      return res.data
   } catch (error) {
      console.warn("API not available, using local state:", error.message)
      return {
         ...todoData,
         id: generateId(),
         createdAt: new Date().toISOString(),
      }
   }
})

export const updateTodo = createAsyncThunk(
   "todos/updateTodo",
   async ({ id, ...todoData }, { getState }) => {
      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(getState),
            body: JSON.stringify(todoData),
         })
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const res = await response.json()

         return {
            ...todoData,
            id,
            createdAt: res.data.createdAt || new Date().toISOString(),
         };
      } catch (error) {
         console.warn("API not available, using local state:", error.message)
         return {
            id,
            ...todoData,
            updatedAt: new Date().toISOString(),
         }
      }
   },
)

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id, { getState }) => {
   try {
      const response = await fetch(`${API_URL}/${id}`, {
         method: "DELETE",
         headers: getAuthHeaders(getState),
      })
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return id
   } catch (error) {
      console.warn("API not available, using local state:", error.message)
      return id
   }
})

export const reorderTodos = createAsyncThunk(
   "todos/reorderTodos",
   async (reorderedTodos, { getState, dispatch }) => {
      try {
         const response = await fetch(`${API_URL}/task/reorder`, {
            method: "PUT",
            headers: getAuthHeaders(getState),
            body: JSON.stringify({ todos: reorderedTodos }),
         });
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         // const res = await response.json();
         // after successful reorder, fetch updated todos list
         const fetchResponse = await dispatch(fetchTodos());
         // fetchResponse.payload will be the updated todos array
         return fetchResponse.payload;
      } catch (error) {
         console.warn("API not available, using local state:", error.message);
         return reorderedTodos; // fallback to local reorderedTodos
      }
   }
);


const todosSlice = createSlice({
   name: "todos",
   initialState: {
      items: [],
      status: "idle",
      error: null,
      isOffline: false,
   },
   reducers: {
      reorderTodosLocal: (state, action) => {
         state.items = action.payload
      },
      clearError: (state) => {
         state.error = null
      },
      setOfflineStatus: (state, action) => {
         state.isOffline = action.payload
      },
   },
   extraReducers: (builder) => {
      builder
         // Fetch todos
         .addCase(fetchTodos.pending, (state) => {
            state.status = "loading"
            state.error = null
         })
         .addCase(fetchTodos.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.items = action.payload
            state.isOffline = false
         })
         .addCase(fetchTodos.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.error.message
            state.isOffline = true
         })
         // Add todo
         .addCase(addTodo.fulfilled, (state, action) => {
            state.items.push(action.payload);
         })
         .addCase(addTodo.rejected, (state, action) => {
            state.error = action.error.message
         })
         // Update todo
         .addCase(updateTodo.fulfilled, (state, action) => {
            const updatedTodo = action.payload;
            if (!updatedTodo) return;

            const index = state.items.findIndex(todo => todo.id === updatedTodo.id);
            if (index !== -1) {
               state.items[index] = updatedTodo;
            }
         })
         .addCase(updateTodo.rejected, (state, action) => {
            state.error = action.error.message
         })
         // Delete todo
         .addCase(deleteTodo.fulfilled, (state, action) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload)
         })
         .addCase(deleteTodo.rejected, (state, action) => {
            state.error = action.error.message
         })
         // Reorder todos
         .addCase(reorderTodos.fulfilled, (state, action) => {
            state.items = action.payload
         })
         .addCase(reorderTodos.rejected, (state, action) => {
            state.error = action.error.message
         })
   },
})

export const { reorderTodosLocal, clearError, setOfflineStatus } = todosSlice.actions
export default todosSlice.reducer
