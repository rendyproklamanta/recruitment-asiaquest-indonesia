import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { fetchTodos, reorderTodos, reorderTodosLocal, clearError } from "../store/todosSlice"
import TodoItem from "./TodoItem"
import TodoModal from "./TodoModal"
import { Plus, ListTodo } from "lucide-react"

const TodoList = ({ filter = "all" }) => {
   const dispatch = useDispatch()
   const { items: todos, status, error, isOffline } = useSelector((state) => state.todos)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [editingTodo, setEditingTodo] = useState(null)
   const [modalMode, setModalMode] = useState("create")

   useEffect(() => {
      if (status === "idle") {
         dispatch(fetchTodos())
      }
   }, [status, error, dispatch])

   const handleCreateTodo = () => {
      setEditingTodo(null)
      setModalMode("create")
      setIsModalOpen(true)
   }

   const handleEditTodo = (todo) => {
      setEditingTodo(todo)
      setModalMode("edit")
      setIsModalOpen(true)
   }

   const handleCloseModal = () => {
      setIsModalOpen(false)
      setEditingTodo(null)
   }

   const filteredTodos = todos
      ?.filter((todo) => {
         switch (filter) {
            case "completed":
               return todo.completed
            case "active":
               return !todo.completed
            default:
               return true
         }
      })
      .sort((a, b) => a.task_order - b.task_order) // sort by task_order ascending

   const handleDragEnd = (result) => {
      if (!result.destination) return

      const items = Array.from(filteredTodos)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      dispatch(reorderTodosLocal(items))

      const reorderedTodos = items.map((item, index) => ({
         ...item,
         task_order: index,
      }))

      dispatch(reorderTodos(reorderedTodos))
   }

   const completedCount = todos?.filter((todo) => todo.completed).length
   const totalCount = todos?.length
   const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

   if (status === "loading") {
      return (
         <div className="flex items-center justify-center h-96">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-gray-600">Loading todos...</p>
            </div>
         </div>
      )
   }

   if (status === "failed") {
      return (
         <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
               <div className="text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                     <h3 className="text-lg font-semibold text-yellow-800 mb-2">API Not Available</h3>
                     <p className="text-yellow-700 mb-4">
                        The todo API is not accessible. The app is running in offline mode with sample data.
                     </p>
                     <button
                        onClick={() => {
                           dispatch(clearError())
                           dispatch(fetchTodos())
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                     >
                        Try Again
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="space-y-6">
         {/* Header with Stats */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {filter === "completed" ? "Completed Tasks" : filter === "active" ? "Active Tasks" : "All Tasks"}
               </h1>
               <p className="text-gray-600">
                  {completedCount} of {totalCount} tasks completed
               </p>
            </div>
            <div className="flex items-center gap-2">
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {filteredTodos?.length} tasks
               </span>
               {isOffline && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700">
                     Offline
                  </span>
               )}
            </div>
         </div>

         {/* Progress */}
         {totalCount > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
               <div className="p-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">Progress</span>
                        <span className="text-gray-600">{progressPercentage}%</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                           className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                           style={{ width: `${progressPercentage}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Create Task Button */}
         <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Todo List</h2>
                  <button
                     onClick={handleCreateTodo}
                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                     <Plus className="w-4 h-4 mr-2" />
                     New Task
                  </button>
               </div>
            </div>
            <div className="p-6">
               {/* Todo List */}
               {filteredTodos?.length === 0 ? (
                  <div className="text-center py-12">
                     <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                     <p className="text-lg font-medium text-gray-500">
                        {filter === "completed"
                           ? "No completed tasks"
                           : filter === "active"
                              ? "No active tasks"
                              : "No tasks yet"}
                     </p>
                     <p className="text-gray-500 mb-4">{filter === "all" ? "Create your first task to get started!" : ""}</p>
                     {filter === "all" && (
                        <button
                           onClick={handleCreateTodo}
                           className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                           <Plus className="w-4 h-4 mr-2" />
                           Create Task
                        </button>
                     )}
                  </div>
               ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                     <Droppable droppableId="todos">
                        {(provided) => (
                           <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {filteredTodos?.map((todo, index) => (
                                 <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                       <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`transition-transform ${snapshot.isDragging ? "rotate-1 scale-105" : ""}`}
                                       >
                                          <TodoItem
                                             todo={todo}
                                             index={index}
                                             dragHandleProps={todo.completed ? null : provided.dragHandleProps} // disable draggable if task completed
                                             onEdit={handleEditTodo}
                                          />
                                       </div>
                                    )}
                                 </Draggable>
                              ))}
                              {provided.placeholder}
                           </div>
                        )}
                     </Droppable>
                  </DragDropContext>
               )}
            </div>
         </div>

         {/* Todo Modal */}



         <TodoModal isOpen={isModalOpen} onClose={handleCloseModal} todo={editingTodo} mode={modalMode} onSuccess={() => dispatch(fetchTodos())} todos={todos} />
      </div>
   )
}

export default TodoList
