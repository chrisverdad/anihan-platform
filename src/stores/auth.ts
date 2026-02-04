import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { useUsersStore } from './users'
import apiService from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isVendor = computed(() => user.value?.role === 'vendor')

  // Initialize auth from localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('anihan_user')
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        localStorage.removeItem('anihan_user')
        localStorage.removeItem('anihan_token')
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      // Try API first
      const response = await apiService.login(credentials.email, credentials.password)
      
      if (response.success && response.data && response.data.user && response.data.token) {
        user.value = response.data.user as User
        apiService.setToken(response.data.token)
        localStorage.setItem('anihan_user', JSON.stringify(response.data.user))
        return response.data.user
      } else {
        throw new Error(response.message || 'Login failed - invalid response')
      }
    } catch (apiError: any) {
      // Log the error for debugging
      console.error('API login error:', apiError)
      
      // Don't fallback to localStorage with plain passwords - passwords are hashed in database
      error.value = apiError.message || 'Login failed. Please check your credentials.'
      throw new Error(apiError.message || 'Invalid email or password')
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData, file?: File) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Load users to check if email already exists
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      
      // Check if user already exists
      const existingUser = usersStore.users.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUserData = {
        ...userData,
        is_active: userData.role === 'user' ? true : false, // Vendors need approval
        vendor_status: userData.role === 'vendor' ? 'pending' as const : undefined,
        business_license: file ? URL.createObjectURL(file) : undefined
      }
      
      const newUser = await usersStore.createUser(newUserData)
      
      // For regular users, log them in immediately
      if (userData.role === 'user') {
        const { password, ...userWithoutPassword } = newUser
        user.value = userWithoutPassword as User
        
        // Store user in localStorage
        localStorage.setItem('anihan_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('anihan_token', 'mock-jwt-token-' + Date.now())
      }
      
      return newUser
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      user.value = null
      localStorage.removeItem('anihan_user')
      localStorage.removeItem('anihan_token')
    } catch (err: any) {
      error.value = err.message || 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return

    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update user in users store
      const usersStore = useUsersStore()
      const updatedUser = await usersStore.updateUser(user.value.id, updates)
      
      // Update current user
      const { password, ...userWithoutPassword } = updatedUser
      user.value = userWithoutPassword as User
      
      // Update localStorage
      localStorage.setItem('anihan_user', JSON.stringify(userWithoutPassword))
      
      return userWithoutPassword
    } catch (err: any) {
      error.value = err.message || 'Profile update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshUser = async () => {
    if (!isAuthenticated.value) return

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Load fresh user data from users store
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      
      const freshUser = usersStore.users.find(u => u.id === user.value?.id)
      if (freshUser) {
        const { password, ...userWithoutPassword } = freshUser
        user.value = userWithoutPassword as User
        localStorage.setItem('anihan_user', JSON.stringify(userWithoutPassword))
      } else {
        // User not found, logout
        await logout()
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err)
      // If refresh fails, logout user
      await logout()
    }
  }

  // Admin methods
  const getAllUsers = async () => {
    if (!isAdmin.value) throw new Error('Unauthorized')
    
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      return usersStore.users
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = async (userId: string, statusData: any) => {
    if (!isAdmin.value) throw new Error('Unauthorized')
    
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const usersStore = useUsersStore()
      const updatedUser = await usersStore.updateUser(userId, statusData)
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Failed to update user status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string, userData: any, profilePhoto?: File) => {
    if (!isAdmin.value) throw new Error('Unauthorized')
    
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const usersStore = useUsersStore()
      
      // Handle profile photo if provided
      const updates = { ...userData }
      if (profilePhoto) {
        updates.profile_photo = URL.createObjectURL(profilePhoto)
      }
      
      const updatedUser = await usersStore.updateUser(userId, updates)
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string) => {
    if (!isAdmin.value) throw new Error('Unauthorized')
    
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const usersStore = useUsersStore()
      const result = await usersStore.deleteUser(userId)
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isVendor,
    login,
    register,
    logout,
    initializeAuth,
    updateProfile,
    refreshUser,
    // Admin methods
    getAllUsers,
    updateUserStatus,
    updateUser,
    deleteUser
  }
})
