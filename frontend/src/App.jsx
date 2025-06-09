import { Provider } from "react-redux"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { store } from "./store/store"
import Dashboard from "./components/Dashboard"
import LoginPage from "./components/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import TodosPage from "./pages/TodosPage"
import CompletedPage from "./pages/CompletedPage"
import ActivePage from "./pages/ActivePage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to="/todos" replace />} />
              <Route path="todos" element={<TodosPage />} />
              <Route path="completed" element={<CompletedPage />} />
              <Route path="active" element={<ActivePage />} />
            </Route>
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
