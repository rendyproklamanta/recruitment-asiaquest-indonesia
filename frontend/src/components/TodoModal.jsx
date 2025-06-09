import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { addTodo, updateTodo } from "../store/todosSlice"
import { Loader2, X } from "lucide-react"

const TodoModal = ({ isOpen, onClose, todo = null, mode = "create" }) => {
   const dispatch = useDispatch()
   const [isLoading, setIsLoading] = useState(false)
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      completed: false,
   })
   const [errors, setErrors] = useState({})

   useEffect(() => {
      if (todo && mode === "edit") {
         setFormData({
            title: todo.title || "",
            description: todo.description || "",
            completed: todo.completed || false,
         })
      } else {
         setFormData({
            title: "",
            description: "",
            completed: false,
         })
      }
      setErrors({})
   }, [todo, mode, isOpen])

   const validateForm = () => {
      const newErrors = {}

      if (!formData.title.trim()) {
         newErrors.title = "Title is required"
      } else if (formData.title.trim().length < 3) {
         newErrors.title = "Title must be at least 3 characters"
      }

      if (formData.description && formData.description.length > 500) {
         newErrors.description = "Description must be less than 500 characters"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleInputChange = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }))

      if (errors[field]) {
         setErrors((prev) => ({
            ...prev,
            [field]: "",
         }))
      }
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!validateForm()) {
         return
      }

      setIsLoading(true)

      try {
         const todoData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            completed: formData.completed,
         }

         if (mode === "edit" && todo) {
            await dispatch(
               updateTodo({
                  id: todo.id,
                  ...todoData,
               }),
            ).unwrap()
         } else {
            await dispatch(
               addTodo({
                  ...todoData,
                  task_order: 0,
               }),
            ).unwrap()
         }

         onClose()
      } catch (error) {
         console.error("Error saving todo:", error)
         setErrors({ submit: "Failed to save todo. Please try again." })
      } finally {
         setIsLoading(false)
      }
   }

   const handleClose = () => {
      if (!isLoading) {
         onClose()
      }
   }

   if (!isOpen) return null

   return (
      <>
         <div className="relative z-50" aria-labelledby="dialog-title" role="dialog" aria-modal="true">

            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>

            <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
               <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg leading-6 font-medium text-gray-900">
                              {mode === "edit" ? "Edit Task" : "Create New Task"}
                           </h3>
                           <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
                              <X className="h-6 w-6" />
                           </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                           {mode === "edit" ? "Update the task details below." : "Fill in the details to create a new task."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                           <div>
                              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                 Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                 type="text"
                                 id="title"
                                 value={formData.title}
                                 onChange={(e) => handleInputChange("title", e.target.value)}
                                 placeholder="Enter task title..."
                                 className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"
                                    }`}
                                 disabled={isLoading}
                              />
                              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                           </div>

                           <div>
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                 Description
                              </label>
                              <textarea
                                 id="description"
                                 value={formData.description}
                                 onChange={(e) => handleInputChange("description", e.target.value)}
                                 placeholder="Enter task description (optional)..."
                                 rows={4}
                                 className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"
                                    }`}
                                 disabled={isLoading}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                 <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
                                 <span>{formData.description.length}/500</span>
                              </div>
                           </div>

                           {mode === "edit" && (
                              <div className="flex items-center">
                                 <input
                                    type="checkbox"
                                    id="completed"
                                    checked={formData.completed}
                                    onChange={(e) => handleInputChange("completed", e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                 />
                                 <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                                    Mark as completed
                                 </label>
                              </div>
                           )}

                           {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

                           <div className="flex justify-end space-x-3 pt-4">
                              <button
                                 type="button"
                                 onClick={handleClose}
                                 disabled={isLoading}
                                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                 Cancel
                              </button>
                              <button
                                 type="submit"
                                 disabled={isLoading}
                                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                              >
                                 {isLoading ? (
                                    <>
                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                       {mode === "edit" ? "Updating..." : "Creating..."}
                                    </>
                                 ) : mode === "edit" ? (
                                    "Update Task"
                                 ) : (
                                    "Create Task"
                                 )}
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>

   )
}

export default TodoModal
