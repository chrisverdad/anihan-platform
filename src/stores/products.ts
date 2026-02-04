import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Order, Delivery } from '@/types'
import { useAuthStore } from './auth'
import { useUsersStore } from './users'
import apiService from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const orders = ref<Order[]>([])
  const deliveries = ref<Delivery[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Organic Banana Compost',
      description: 'Rich compost made from overripe bananas, perfect for organic gardening',
      price: 150,
      category: 'compost',
      image_url: '/images/banana-compost.jpg',
      stock_quantity: 25,
      unit: 'kg',
      is_available: true,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Tomato Fertilizer',
      description: 'Natural fertilizer derived from bruised tomatoes, rich in nutrients',
      price: 200,
      category: 'fertilizer',
      image_url: '/images/tomato-fertilizer.jpg',
      stock_quantity: 15,
      unit: 'bags',
      is_available: true,
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Mango Jam',
      description: 'Delicious jam made from damaged mangoes, sweet and natural',
      price: 80,
      category: 'preserved_food',
      image_url: '/images/mango-jam.jpg',
      stock_quantity: 30,
      unit: 'bottles',
      is_available: true,
      created_at: '2024-03-05T00:00:00Z',
      updated_at: '2024-03-05T00:00:00Z'
    },
    {
      id: '4',
      name: 'Vegetable Compost',
      description: 'Mixed vegetable compost from various damaged produce',
      price: 120,
      category: 'compost',
      image_url: '/images/vegetable-compost.jpg',
      stock_quantity: 20,
      unit: 'kg',
      is_available: true,
      created_at: '2024-04-01T00:00:00Z',
      updated_at: '2024-04-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Fruit Fertilizer',
      description: 'Nutrient-rich fertilizer made from fruit waste',
      price: 180,
      category: 'fertilizer',
      image_url: '/images/fruit-fertilizer.jpg',
      stock_quantity: 12,
      unit: 'bags',
      is_available: true,
      created_at: '2024-05-15T00:00:00Z',
      updated_at: '2024-05-15T00:00:00Z'
    },
    {
      id: '6',
      name: 'Apple Preserves',
      description: 'Sweet preserves made from bruised apples',
      price: 90,
      category: 'preserved_food',
      image_url: '/images/apple-preserves.jpg',
      stock_quantity: 0,
      unit: 'jars',
      is_available: false,
      created_at: '2024-06-01T00:00:00Z',
      updated_at: '2024-06-01T00:00:00Z'
    }
  ]

  const mockOrders: Order[] = []

  const loadProducts = async () => {
    loading.value = true
    try {
      // Try API first
      try {
        const response = await apiService.getProducts()
        if (response.success && response.data) {
          products.value = response.data as Product[]
          // Save to localStorage as backup
          localStorage.setItem('anihan_products', JSON.stringify(products.value))
          return
        }
      } catch (apiError: any) {
        console.warn('API load failed, using localStorage:', apiError.message)
      }
      
      // Fallback to localStorage
      const storedProducts = localStorage.getItem('anihan_products')
      if (storedProducts) {
        products.value = JSON.parse(storedProducts)
      } else {
        // Fallback to mock data
        products.value = [...mockProducts]
        localStorage.setItem('anihan_products', JSON.stringify(products.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load products'
      // Fallback to mock data
      products.value = [...mockProducts]
      localStorage.setItem('anihan_products', JSON.stringify(products.value))
    } finally {
      loading.value = false
    }
  }

  const loadOrders = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedOrders = localStorage.getItem('anihan_orders')
      if (storedOrders) {
        orders.value = JSON.parse(storedOrders)
        // Sync user data for existing orders
        await syncOrderUserData()
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 200))
        orders.value = [...mockOrders]
        // Save to localStorage
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
      }
      
      // Ensure data is always available
      if (orders.value.length === 0) {
        orders.value = [...mockOrders]
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load orders'
      // Fallback to mock data
      orders.value = [...mockOrders]
      localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
    } finally {
      loading.value = false
    }
  }

  const syncOrderUserData = async () => {
    try {
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      const allUsers = usersStore.users
      
      let hasUpdates = false
      
      for (const order of orders.value) {
        // If order has hardcoded user data, try to find the real user
        if (order.user && (order.user.email === 'user@anihan.com' || order.user.full_name === 'User')) {
          const realUser = allUsers.find(u => u.id === order.user_id)
          if (realUser) {
            order.user = {
              id: realUser.id,
              email: realUser.email,
              full_name: realUser.full_name,
              role: realUser.role,
              phone: realUser.phone,
              address: realUser.address,
              created_at: realUser.created_at,
              updated_at: realUser.updated_at,
              is_active: realUser.is_active
            }
            hasUpdates = true
          }
        }
      }
      
      if (hasUpdates) {
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
      }
    } catch (error) {
      console.error('Failed to sync order user data:', error)
    }
  }

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => {
    loading.value = true
    try {
      // Try API first
      try {
        const response = await apiService.createProduct(productData, imageFile)
        if (response.success && response.data) {
          const newProduct = response.data as Product
          products.value.unshift(newProduct)
          localStorage.setItem('anihan_products', JSON.stringify(products.value))
          return newProduct
        }
      } catch (apiError: any) {
        console.warn('API create failed, using localStorage:', apiError.message)
      }
      
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Auto out-of-stock logic: if stock_quantity is 0, set is_available to false
      const processedProductData = {
        ...productData,
        is_available: productData.stock_quantity > 0 ? productData.is_available : false
      }
      
      const newProduct: Product = {
        ...processedProductData,
        id: (products.value.length + 1).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      products.value.unshift(newProduct)
      // Save to localStorage
      localStorage.setItem('anihan_products', JSON.stringify(products.value))
      return newProduct
    } catch (err: any) {
      error.value = err.message || 'Failed to add product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>, imageFile?: File) => {
    loading.value = true
    try {
      // Try API first
      try {
        const response = await apiService.updateProduct(id, updates, imageFile)
        if (response.success && response.data) {
          const updatedProduct = response.data as Product
          const index = products.value.findIndex(product => product.id === id)
          if (index !== -1) {
            products.value[index] = updatedProduct
          } else {
            products.value.unshift(updatedProduct)
          }
          localStorage.setItem('anihan_products', JSON.stringify(products.value))
          return updatedProduct
        }
      } catch (apiError: any) {
        console.warn('API update failed, using localStorage:', apiError.message)
      }
      
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = products.value.findIndex(product => product.id === id)
      if (index !== -1) {
        // Auto out-of-stock logic: if stock_quantity is 0, set is_available to false
        const updatedProduct = {
          ...products.value[index],
          ...updates,
          updated_at: new Date().toISOString()
        }
        
        // Check if stock quantity is being updated and is 0
        if (updates.stock_quantity !== undefined && updates.stock_quantity === 0) {
          updatedProduct.is_available = false
        }
        
        products.value[index] = updatedProduct
        // Save to localStorage
        localStorage.setItem('anihan_products', JSON.stringify(products.value))
        return products.value[index]
      }
      throw new Error('Product not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    try {
      // Try API first
      try {
        await apiService.deleteProduct(id)
        // Remove from local state
        const index = products.value.findIndex(product => product.id === id)
        if (index !== -1) {
          products.value.splice(index, 1)
        }
        localStorage.setItem('anihan_products', JSON.stringify(products.value))
        return true
      } catch (apiError: any) {
        console.warn('API delete failed, using localStorage:', apiError.message)
      }
      
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = products.value.findIndex(product => product.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('anihan_products', JSON.stringify(products.value))
        return true
      }
      throw new Error('Product not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const placeOrder = async (orderData: Omit<Order, 'id' | 'order_date' | 'status' | 'user' | 'product'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const product = products.value.find(p => p.id === orderData.product_id)
      if (!product) throw new Error('Product not found')
      
      // Check if enough stock
      if (product.stock_quantity < orderData.quantity) {
        throw new Error('Insufficient stock')
      }
      
      // Decrease product quantity
      product.stock_quantity -= orderData.quantity
      product.updated_at = new Date().toISOString()
      
      // Get actual user data from auth store
      const authStore = useAuthStore()
      const currentUser = authStore.user
      
      if (!currentUser) {
        throw new Error('User not authenticated')
      }
      
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${String(orders.value.length + 1).padStart(3, '0')}`,
        status: 'pending',
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'cash',
        payment_reference: orderData.payment_reference || '',
        delivery_status: orderData.delivery_status || 'pending',
        delivery_address: orderData.delivery_address || '',
        delivery_notes: orderData.delivery_notes || '',
        order_date: new Date().toISOString(),
        user: {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.full_name,
          role: currentUser.role,
          phone: currentUser.phone,
          address: currentUser.address,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
          is_active: currentUser.is_active
        },
        product
      }
      
      orders.value.unshift(newOrder)
      
      // Create delivery record
      const newDelivery: Delivery = {
        id: `DEL-${newOrder.id}`,
        order_id: newOrder.id,
        status: newOrder.delivery_status,
        notes: newOrder.delivery_notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order: newOrder
      }
      deliveries.value.unshift(newDelivery)
      
      // Save to localStorage
      localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
      localStorage.setItem('anihan_products', JSON.stringify(products.value))
      localStorage.setItem('anihan_deliveries', JSON.stringify(deliveries.value))
      return newOrder
    } catch (err: any) {
      error.value = err.message || 'Failed to place order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = orders.value.findIndex(order => order.id === id)
      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          status,
          delivery_date: status === 'delivered' ? new Date().toISOString() : orders.value[index].delivery_date
        }
        // Save to localStorage
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
        return orders.value[index]
      }
      throw new Error('Order not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update order status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateOrderPaymentStatus = async (id: string, paymentStatus: Order['payment_status']) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = orders.value.findIndex(order => order.id === id)
      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          payment_status: paymentStatus
        }
        // Save to localStorage
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
        return orders.value[index]
      }
      throw new Error('Order not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update payment status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateOrderDeliveryStatus = async (id: string, deliveryStatus: Order['delivery_status']) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = orders.value.findIndex(order => order.id === id)
      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          delivery_status: deliveryStatus
        }
        
        // Update corresponding delivery record
        const deliveryIndex = deliveries.value.findIndex(delivery => delivery.order_id === id)
        if (deliveryIndex !== -1) {
          deliveries.value[deliveryIndex] = {
            ...deliveries.value[deliveryIndex],
            status: deliveryStatus,
            updated_at: new Date().toISOString()
          }
          localStorage.setItem('anihan_deliveries', JSON.stringify(deliveries.value))
        }
        
        // Save to localStorage
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
        return orders.value[index]
      }
      throw new Error('Order not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update delivery status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProductStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        total: products.value.length,
        available: products.value.filter(p => p.is_available).length,
        outOfStock: products.value.filter(p => !p.is_available).length,
        totalStock: products.value.reduce((sum, p) => sum + p.stock_quantity, 0),
        byCategory: products.value.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product stats'
      throw err
    }
  }

  const getOrderStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        total: orders.value.length,
        pending: orders.value.filter(o => o.status === 'pending').length,
        confirmed: orders.value.filter(o => o.status === 'confirmed').length,
        processing: orders.value.filter(o => o.status === 'processing').length,
        shipped: orders.value.filter(o => o.status === 'shipped').length,
        delivered: orders.value.filter(o => o.status === 'delivered').length,
        cancelled: orders.value.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.value.reduce((sum, o) => sum + o.total_price, 0)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch order stats'
      throw err
    }
  }

  // Delivery Management
  const loadDeliveries = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedDeliveries = localStorage.getItem('anihan_deliveries')
      if (storedDeliveries) {
        deliveries.value = JSON.parse(storedDeliveries)
        // Sync order user data for deliveries
        await syncDeliveryOrderData()
      } else {
        // Generate deliveries from orders
        const mockDeliveries: Delivery[] = orders.value.map(order => ({
          id: `DEL-${order.id}`,
          order_id: order.id,
          delivery_person: order.delivery_status === 'delivered' ? 'Juan Dela Cruz' : undefined,
          delivery_vehicle: order.delivery_status === 'delivered' ? 'Motorcycle' : undefined,
          pickup_time: order.delivery_status === 'delivered' ? '2024-12-12T08:00:00Z' : undefined,
          delivery_time: order.delivery_status === 'delivered' ? order.delivery_date : undefined,
          status: order.delivery_status,
          notes: order.delivery_notes,
          created_at: order.order_date,
          updated_at: order.order_date,
          order: order
        }))
        
        deliveries.value = mockDeliveries
        localStorage.setItem('anihan_deliveries', JSON.stringify(deliveries.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load deliveries'
      throw err
    } finally {
      loading.value = false
    }
  }

  const syncDeliveryOrderData = async () => {
    try {
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      const allUsers = usersStore.users
      
      let hasUpdates = false
      
      for (const delivery of deliveries.value) {
        if (delivery.order) {
          // If order has hardcoded user data, try to find the real user
          if (delivery.order.user && (delivery.order.user.email === 'user@anihan.com' || delivery.order.user.full_name === 'User')) {
            const realUser = allUsers.find(u => u.id === delivery.order!.user_id)
            if (realUser) {
              delivery.order.user = {
                id: realUser.id,
                email: realUser.email,
                full_name: realUser.full_name,
                role: realUser.role,
                phone: realUser.phone,
                address: realUser.address,
                created_at: realUser.created_at,
                updated_at: realUser.updated_at,
                is_active: realUser.is_active
              }
              hasUpdates = true
            }
          }
        }
      }
      
      if (hasUpdates) {
        localStorage.setItem('anihan_deliveries', JSON.stringify(deliveries.value))
      }
    } catch (error) {
      console.error('Failed to sync delivery order data:', error)
    }
  }

  const updateDeliveryStatus = async (deliveryId: string, status: Delivery['status'], deliveryPerson?: string, deliveryVehicle?: string) => {
    loading.value = true
    try {
      const delivery = deliveries.value.find(d => d.id === deliveryId)
      if (delivery) {
        delivery.status = status
        delivery.delivery_person = deliveryPerson || delivery.delivery_person
        delivery.delivery_vehicle = deliveryVehicle || delivery.delivery_vehicle
        delivery.updated_at = new Date().toISOString()
        
        // Update corresponding order
        const order = orders.value.find(o => o.id === delivery.order_id)
        if (order) {
          order.delivery_status = status
          if (status === 'delivered') {
            order.delivery_date = new Date().toISOString()
          }
        }
        
        localStorage.setItem('anihan_deliveries', JSON.stringify(deliveries.value))
        localStorage.setItem('anihan_orders', JSON.stringify(orders.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update delivery status'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    orders,
    deliveries,
    loading,
    error,
    loadProducts,
    loadOrders,
    loadDeliveries,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderDeliveryStatus,
    updateDeliveryStatus,
    getProductStats,
    getOrderStats
  }
})