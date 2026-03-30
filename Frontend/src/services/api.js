// Construct full API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('token')

// Helper function to save token to localStorage
const saveToken = (token) => localStorage.setItem('token', token)

// Helper function to remove token
const removeToken = () => localStorage.removeItem('token')

// Helper function to set authorization header
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Generic API call function
export const apiCall = async (endpoint, method = 'GET', data = null, includeAuth = true) => {
  try {
    const config = {
      method,
      headers: getHeaders(includeAuth),
    }
    
    if (data) {
      config.body = JSON.stringify(data)
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const contentType = response.headers.get('content-type') || ''
    const result = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() }
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong')
    }
    
    return result
  } catch (error) {
    throw error
  }
}

// Authentication API calls
export const authAPI = {
  register: async (userData) => {
    const response = await apiCall('/auth/register', 'POST', userData, false)
    if (response.token) {
      saveToken(response.token)
    }
    return response
  },

  login: async (credentials) => {
    const response = await apiCall('/auth/login', 'POST', credentials, false)
    if (response.token) {
      saveToken(response.token)
    }
    return response
  },

  logout: () => {
    removeToken()
  },

  getToken: getToken,

  isAuthenticated: () => {
    return !!getToken()
  }
}

// Export for use in other modules
export default authAPI
