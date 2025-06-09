import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser } from "../store/authSlice"
import { ListTodo, CheckSquare, Calendar, Settings, User, LogOut, ChevronDown, AlertCircle, X } from "lucide-react"

const AppSidebar = ({ activePath, isOpen, onClose }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
   const [userMenuOpen, setUserMenuOpen] = useState(false)

   const handleLogout = () => {
      dispatch(logoutUser())
      navigate("/login")
   }

   const menuItems = [
      {
         title: "All Tasks",
         icon: ListTodo,
         path: "todos",
      },
      {
         title: "Completed",
         icon: CheckSquare,
         path: "completed",
      },
      {
         title: "Active",
         icon: AlertCircle,
         path: "active",
      },
   ]

   return (
      <>
         {/* Mobile overlay */}
         {isOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
               <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
            </div>
         )}

         {/* Sidebar */}
         <div
            className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
               }`}
         >
            <div className="flex flex-col h-full">
               {/* Header */}
               <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <Link to="/todos" className="flex items-center space-x-3">
                     <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                        <ListTodo className="w-5 h-5 text-white" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-gray-900">Todo App</div>
                        <div className="text-xs text-gray-500">Task Management</div>
                     </div>
                  </Link>
                  <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600">
                     <X className="h-5 w-5" />
                  </button>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4">
                  <div className="space-y-1">
                     <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</div>
                     {menuItems.map((item) => (
                        <Link
                           key={item.path}
                           to={`/${item.path}`}
                           className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activePath === item.path
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                           onClick={() => onClose()}
                        >
                           <item.icon className="w-5 h-5 mr-3" />
                           {item.title}
                        </Link>
                     ))}
                  </div>
               </nav>

               {/* User Menu */}
               <div className="border-t border-gray-200 p-4">
                  <div className="relative">
                     <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                     >
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full mr-3">
                           <span className="text-sm font-medium text-gray-700">
                              {user?.name
                                 ?.split(" ")
                                 .map((n) => n[0])
                                 .join("") || "U"}
                           </span>
                        </div>
                        <div className="flex-1 text-left">
                           <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                           <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                     </button>

                     {userMenuOpen && (
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-md shadow-lg">
                           <button
                              onClick={() => {
                                 navigate("/settings")
                                 setUserMenuOpen(false)
                                 onClose()
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                           >
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                           </button>
                           <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                           >
                              <LogOut className="w-4 h-4 mr-2" />
                              Log out
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AppSidebar
