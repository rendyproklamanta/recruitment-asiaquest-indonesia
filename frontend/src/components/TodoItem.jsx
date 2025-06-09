import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateTodo, deleteTodo } from "../store/todosSlice"
import { Trash2, Edit3, GripVertical, Calendar } from "lucide-react"

const TodoItem = ({ todo, index, dragHandleProps, onEdit }) => {
   const dispatch = useDispatch()
   const [showDeleteModal, setShowDeleteModal] = useState(false)

   const handleToggleComplete = (e) => {
      dispatch(
         updateTodo({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: e.target.checked,
            task_order: todo.task_order,
         }),
      )
   }

   const handleDelete = () => {
      dispatch(deleteTodo(todo.id))
      setShowDeleteModal(false)
   }

   const handleEdit = () => {
      onEdit(todo)
   }

   const formatDate = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      })
   }

   return (
      <>
         <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 ${todo.completed ? "bg-gray-50" : "hover:shadow-md"}`}
         >
            <div className="p-4">
               <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div
                     {...dragHandleProps}
                     className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
                  >
                     <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Checkbox */}
                  <input
                     type="checkbox"
                     checked={todo.completed}
                     onChange={handleToggleComplete}
                     className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                           <h3
                              className={`font-medium text-sm cursor-pointer hover:text-blue-600 transition-colors ${todo.completed ? "line-through text-gray-500" : "text-gray-900"
                                 }`}
                              onClick={handleEdit}
                           >
                              {todo.title}
                           </h3>
                           {todo.description && (
                              <p
                                 className={`text-sm mt-1 cursor-pointer hover:text-blue-600 transition-colors ${todo.completed ? "line-through text-gray-400" : "text-gray-600"
                                    }`}
                                 onClick={handleEdit}
                              >
                                 {todo.description}
                              </p>
                           )}
                           <div className="flex items-center gap-2 mt-2">
                              {todo.completed && (
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                 </span>
                              )}
                              {todo.createdAt && (
                                 <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(todo.createdAt)}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                           <button
                              onClick={handleEdit}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md flex items-center justify-center"
                           >
                              <Edit3 className="w-4 h-4" />
                           </button>

                           <button
                              onClick={() => setShowDeleteModal(true)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md flex items-center justify-center"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Delete Confirmation Modal */}
         {showDeleteModal && (
            <>
               <div className="relative z-50" aria-labelledby="dialog-title" role="dialog" aria-modal="true">

                  <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}></div>

                  <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                              <div className="sm:flex sm:items-start">
                                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                 </div>
                                 <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Task</h3>
                                    <div className="mt-2">
                                       <p className="text-sm text-gray-500">
                                          Are you sure you want to delete &quot;{todo.title}&quot; ? This action cannot be undone.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                 <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                 >
                                    Delete
                                 </button>
                                 <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )}
      </>
   )
}

export default TodoItem
