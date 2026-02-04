import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useUsersStore } from '@/stores/users'
import { useWasteStore } from '@/stores/waste'

export class DataPersistenceManager {
  private static instance: DataPersistenceManager
  private initialized = false

  public static getInstance(): DataPersistenceManager {
    if (!DataPersistenceManager.instance) {
      DataPersistenceManager.instance = new DataPersistenceManager()
    }
    return DataPersistenceManager.instance
  }

  public async initializeAllStores(): Promise<void> {
    if (this.initialized) return

    try {
      const authStore = useAuthStore()
      const productsStore = useProductsStore()
      const usersStore = useUsersStore()
      const wasteStore = useWasteStore()

      // Initialize auth first
      authStore.initializeAuth()

      // Load all data in parallel for better performance
      await Promise.all([
        productsStore.loadProducts(),
        productsStore.loadOrders(),
        usersStore.loadUsers(),
        wasteStore.loadWasteTypes(),
        wasteStore.loadSubmissions(),
        wasteStore.loadInventoryItems(),
        wasteStore.loadWasteCategories(),
        wasteStore.loadSourceWasteSubmissions()
      ])

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize stores:', error)
      // Even if initialization fails, mark as initialized to prevent infinite loops
      this.initialized = true
    }
  }

  public async refreshAllData(): Promise<void> {
    try {
      const productsStore = useProductsStore()
      const usersStore = useUsersStore()
      const wasteStore = useWasteStore()

      // Only refresh if data is not already loaded
      const promises = []
      
      if (productsStore.products.length === 0) {
        promises.push(productsStore.loadProducts())
      }
      if (productsStore.orders.length === 0) {
        promises.push(productsStore.loadOrders())
      }
      if (usersStore.users.length === 0) {
        promises.push(usersStore.loadUsers())
      }
      if (wasteStore.wasteTypes.length === 0) {
        promises.push(wasteStore.loadWasteTypes())
      }
      if (wasteStore.submissions.length === 0) {
        promises.push(wasteStore.loadSubmissions())
      }
      if (wasteStore.inventoryItems.length === 0) {
        promises.push(wasteStore.loadInventoryItems())
      }
      if (wasteStore.wasteCategories.length === 0) {
        promises.push(wasteStore.loadWasteCategories())
      }
      if (wasteStore.sourceWasteSubmissions.length === 0) {
        promises.push(wasteStore.loadSourceWasteSubmissions())
      }

      if (promises.length > 0) {
        await Promise.all(promises)
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  public saveAllData(): void {
    try {
      const productsStore = useProductsStore()
      const usersStore = useUsersStore()
      const wasteStore = useWasteStore()

      // Save all data to localStorage
      localStorage.setItem('anihan_products', JSON.stringify(productsStore.products))
      localStorage.setItem('anihan_orders', JSON.stringify(productsStore.orders))
      localStorage.setItem('anihan_users', JSON.stringify(usersStore.users))
      localStorage.setItem('anihan_waste_types', JSON.stringify(wasteStore.wasteTypes))
      localStorage.setItem('anihan_submissions', JSON.stringify(wasteStore.submissions))
      localStorage.setItem('anihan_inventory', JSON.stringify(wasteStore.inventoryItems))
      localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteStore.wasteCategories))
      localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(wasteStore.sourceWasteSubmissions))

      console.log('All data saved successfully')
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  public clearAllData(): void {
    try {
      // Clear all localStorage data
      localStorage.removeItem('anihan_products')
      localStorage.removeItem('anihan_orders')
      localStorage.removeItem('anihan_users')
      localStorage.removeItem('anihan_waste_types')
      localStorage.removeItem('anihan_submissions')
      localStorage.removeItem('anihan_inventory')
      localStorage.removeItem('anihan_waste_categories')
      localStorage.removeItem('anihan_source_waste_submissions')
      localStorage.removeItem('anihan_user')
      localStorage.removeItem('anihan_token')

      console.log('All data cleared successfully')
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  public getDataStatus(): Record<string, boolean> {
    return {
      products: !!localStorage.getItem('anihan_products'),
      orders: !!localStorage.getItem('anihan_orders'),
      users: !!localStorage.getItem('anihan_users'),
      wasteTypes: !!localStorage.getItem('anihan_waste_types'),
      submissions: !!localStorage.getItem('anihan_submissions'),
      inventory: !!localStorage.getItem('anihan_inventory'),
      wasteCategories: !!localStorage.getItem('anihan_waste_categories'),
      sourceWasteSubmissions: !!localStorage.getItem('anihan_source_waste_submissions'),
      auth: !!localStorage.getItem('anihan_user'),
      token: !!localStorage.getItem('anihan_token')
    }
  }
}

// Export singleton instance
export const dataPersistenceManager = DataPersistenceManager.getInstance()
