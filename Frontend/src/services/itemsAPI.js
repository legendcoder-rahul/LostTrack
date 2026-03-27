import { apiCall } from './api'

// Items API calls
export const itemsAPI = {
  // Get all items
  getAllItems: async () => {
    return apiCall('/items', 'GET')
  },

  // Get items by status
  getItemsByStatus: async (status) => {
    return apiCall(`/items/status/${status}`, 'GET')
  },

  // Get single item
  getItem: async (id) => {
    return apiCall(`/items/${id}`, 'GET')
  },

  // Create item
  createItem: async (itemData) => {
    return apiCall('/items', 'POST', itemData)
  },

  // Update item
  updateItem: async (id, itemData) => {
    return apiCall(`/items/${id}`, 'PUT', itemData)
  },

  // Delete item
  deleteItem: async (id) => {
    return apiCall(`/items/${id}`, 'DELETE')
  },

  // Search items by title
  searchByTitle: async (query) => {
    return apiCall(`/items/search/title?q=${encodeURIComponent(query)}`, 'GET')
  },

  // Search items by location
  searchByLocation: async (query) => {
    return apiCall(`/items/search/location?q=${encodeURIComponent(query)}`, 'GET')
  },

  // ==================== CLAIM VERIFICATION APIs ====================

  // Claim an item
  claimItem: async (itemId) => {
    return apiCall(`/items/${itemId}/claim`, 'POST', {})
  },

  // Get claim requests for current user (as owner)
  getMyClaimRequests: async () => {
    return apiCall('/items/owner/claims', 'GET')
  },

  // Approve a claim
  approveClaim: async (itemId) => {
    return apiCall(`/items/${itemId}/approve-claim`, 'POST', {})
  },

  // Reject a claim
  rejectClaim: async (itemId) => {
    return apiCall(`/items/${itemId}/reject-claim`, 'POST', {})
  },

  // Verify OTP
  verifyOTP: async (itemId, otp) => {
    return apiCall(`/items/${itemId}/verify-otp`, 'POST', { itemId, otp })
  },

  // Get my claim history
  getMyClaimHistory: async () => {
    return apiCall('/items/claimant/history', 'GET')
  }
}

export default itemsAPI
