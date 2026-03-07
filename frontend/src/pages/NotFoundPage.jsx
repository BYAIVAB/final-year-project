import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-arc-navy flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-arc-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-arc-text mb-4">
          Page Not Found
        </h2>
        <p className="text-arc-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-arc-blue hover:bg-arc-blue-light text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
