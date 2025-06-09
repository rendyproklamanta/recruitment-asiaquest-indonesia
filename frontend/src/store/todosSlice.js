import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = "http://localhost/todos"

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
      title: "Learn React",
      description: "Study React fundamentals and hooks",
      completed: false,
      order: 0,
      createdAt: new Date().toISOString(),
   },
   {
      id: 2,
      title: "Build a Todo App",
      description: "Create a full-featured todo application with authentication",
      completed: true,
      order: 1,
      createdAt: new Date().toISOString(),
   },
   {
      id: 3,
      title: "Master Redux Toolkit",
      description: "Learn advanced state management patterns",
      completed: false,
      order: 2,
      createdAt: new Date().toISOString(),
   },
]

// Async thunks for API calls with JWT authentication
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (_, { getState, rejectWithValue }) => {
   try {
      const response = await fetch(API_URL, {
         headers: getAuthHeaders(getState),
      })
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
   } catch (error) {
      console.warn("API not available, using local mock data:", error.message)
      return mockTodos
   }
})

export const addTodo = createAsyncThunk("todos/addTodo", async (todoData, { getState, rejectWithValue }) => {
   try {
      const response = await fetch(API_URL, {
         method: "POST",
         headers: getAuthHeaders(getState),
         body: JSON.stringify(todoData),
      })
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
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
   async ({ id, ...todoData }, { getState, rejectWithValue }) => {
      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(getState),
            body: JSON.stringify(todoData),
         })
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }
         return await response.json()
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

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id, { getState, rejectWithValue }) => {
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
   async (reorderedTodos, { getState, rejectWithValue }) => {
      try {
         const response = await fetch(`${API_URL}/reorder`, {
            method: "PUT",
            headers: getAuthHeaders(getState),
            body: JSON.stringify({ todos: reorderedTodos }),
         })
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }
         return await response.json()
      } catch (error) {
         console.warn("API not available, using local state:", error.message)
         return reorderedTodos
      }
   },
)

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
            state.items.push(action.payload)
         })
         .addCase(addTodo.rejected, (state, action) => {
            state.error = action.error.message
         })
         // Update todo
         .addCase(updateTodo.fulfilled, (state, action) => {
            const index = state.items.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) {
               state.items[index] = action.payload
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
