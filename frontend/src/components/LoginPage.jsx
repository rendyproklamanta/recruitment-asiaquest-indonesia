import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { loginUser, clearError } from "../store/authSlice"
import { Loader2, ListTodo } from "lucide-react"

const LoginPage = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()
   const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   })

   useEffect(() => {
      if (isAuthenticated) {
         const from = location.state?.from?.pathname || "/"
         navigate(from, { replace: true })
      }
   }, [isAuthenticated, navigate, location])

   useEffect(() => {
      dispatch(clearError())
   }, [dispatch])

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      dispatch(loginUser(formData))
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <div className="flex items-center justify-center gap-2 mb-4">
                  <ListTodo className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Todo App</h2>
               </div>
               <p className="text-gray-600">Sign in to your account to manage your tasks</p>
            </div>

            <div className="bg-white py-8 px-6 shadow rounded-lg">
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                     </label>
                     <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>

                  <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                     </label>
                     <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>

                  {error && (
                     <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">{error}</p>
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Signing in...
                        </>
                     ) : (
                        "Sign In"
                     )}
                  </button>
               </form>

               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">Demo Credential:</p>
                  <p className="text-sm text-blue-700">Email: user@example.com</p>
                  <p className="text-sm text-blue-700">Password: password</p>
               </div>
               <div className="mt-6 text-center text-gray-500">
                  <div className="text-sm">created by <a href="//devrendy.com" target="_blank">www.devrendy.com</a></div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LoginPage
