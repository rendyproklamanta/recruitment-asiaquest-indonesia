import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
         <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
            <p className="text-muted-foreground mt-2 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <Button asChild>
               <Link to="/">Go Home</Link>
            </Button>
         </div>
      </div>
   )
}

export default NotFoundPage
