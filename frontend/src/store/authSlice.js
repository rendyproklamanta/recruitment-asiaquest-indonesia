import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
   try {
      const response = await fetch(`${API_URL}/auth/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
         throw new Error("Invalid credentials")
      }

      const data = await response.json()

      // Store token and user data
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user))

      return data
   } catch (error) {
      // Fallback to mock authentication
      console.warn("API not available, using mock authentication:", error.message)

      // Mock validation
      if (email === "user@example.com" && password === "password") {
         const mockData = {
            token: "mock-jwt-token-" + Date.now(),
            user: {
               id: 1,
               email: email,
               name: "John Doe",
               avatar: "/placeholder.svg?height=32&width=32",
            },
         }
         localStorage.setItem("token", mockData.token)
         localStorage.setItem("user", JSON.stringify(mockData.user))
         return mockData
      } else {
         return rejectWithValue("Invalid credentials")
      }
   }
})

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
   localStorage.removeItem("token")
   localStorage.removeItem("user")
   return null
})

export const checkAuthStatus = createAsyncThunk("auth/checkAuthStatus", async () => {
   const token = localStorage.getItem("token")
   const user = localStorage.getItem("user")

   if (token && user) {
      return {
         token,
         user: JSON.parse(user),
      }
   }
   return null
})

const authSlice = createSlice({
   name: "auth",
   initialState: {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
   },
   reducers: {
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         // Login
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
            state.isAuthenticated = false
         })
         // Logout
         .addCase(logoutUser.fulfilled, (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
         })
         // Check auth status
         .addCase(checkAuthStatus.fulfilled, (state, action) => {
            if (action.payload) {
               state.user = action.payload.user
               state.token = action.payload.token
               state.isAuthenticated = true
            }
         })
   },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
