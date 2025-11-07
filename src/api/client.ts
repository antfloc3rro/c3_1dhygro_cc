import axios, { AxiosInstance, AxiosError } from 'axios'

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor (add auth token if needed in future)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token when auth is implemented
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (global error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status

      switch (status) {
        case 401:
          // Unauthorized - handle auth redirect in future
          console.error('Unauthorized - authentication required')
          break
        case 403:
          // Forbidden
          console.error('Forbidden - insufficient permissions')
          break
        case 404:
          // Not found
          console.error('Resource not found')
          break
        case 429:
          // Rate limited
          console.error('Rate limit exceeded - too many requests')
          break
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error - please try again later')
          break
        default:
          console.error(`API error: ${status}`)
      }
    } else if (error.request) {
      // No response from server (network error)
      console.error('Network error - no response from server')
    } else {
      // Request setup error
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Export for use in React Query and other API functions
export default apiClient
