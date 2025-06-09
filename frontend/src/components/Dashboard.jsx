import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { checkAuthStatus } from "../store/authSlice"
import AppSidebar from "./AppSidebar"
import { Menu } from "lucide-react"

const Dashboard = () => {
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()
   // const { isAuthenticated } = useSelector((state) => state.auth)
   const [sidebarOpen, setSidebarOpen] = useState(false)

   useEffect(() => {
      dispatch(checkAuthStatus())
   }, [dispatch])

   const currentPath = location.pathname.split("/")[1] || "todos"

   const getBreadcrumbTitle = () => {
      switch (currentPath) {
         case "completed":
            return "Completed Tasks"
         case "active":
            return "Active Tasks"
         case "settings":
            return "Settings"
         case "todos":
         default:
            return "All Tasks"
      }
   }

   return (
      <div className="flex min-h-screen bg-gray-50">
         {/* Sidebar */}
         <AppSidebar activePath={currentPath} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

         {/* Main Content */}
         <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => setSidebarOpen(true)}
                     className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                     <Menu className="h-5 w-5" />
                  </button>

                  <nav className="flex" aria-label="Breadcrumb">
                     <ol className="flex items-center space-x-2">
                        <li>
                           <button
                              onClick={() => navigate("/todos")}
                              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                           >
                              Todo App
                           </button>
                        </li>
                        <li>
                           <span className="text-gray-400">/</span>
                        </li>
                        <li>
                           <span className="text-gray-900 text-sm font-medium">{getBreadcrumbTitle()}</span>
                        </li>
                     </ol>
                  </nav>
               </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-4">
               <Outlet />
            </main>
         </div>
      </div>
   )
}

export default Dashboard
