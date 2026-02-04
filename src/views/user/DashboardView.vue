<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="mb-2 sm:mb-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">User Dashboard</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Welcome to AniHan Platform</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-xs sm:text-sm text-gray-500">Welcome, {{ user?.full_name }}</p>
              <p class="text-xs sm:text-sm text-gray-500">General User</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon class="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Orders</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{{ stats.totalOrders }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-diamond-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon class="w-3 h-3 sm:w-5 sm:h-5 text-diamond-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Completed Orders</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{{ stats.completedOrders }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <ClockIcon class="w-3 h-3 sm:w-5 sm:h-5 text-warning-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Pending Orders</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{{ stats.pendingOrders }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon class="w-3 h-3 sm:w-5 sm:h-5 text-danger-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Spent</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">₱{{ stats.totalSpent.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        <div class="card">
          <div class="card-header p-3 sm:p-4 lg:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <router-link
                to="/user/products"
                class="flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ShoppingBagIcon class="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
                <div class="ml-2 sm:ml-3">
                  <p class="text-xs sm:text-sm font-medium text-gray-900">Browse Products</p>
                  <p class="text-xs sm:text-sm text-gray-500">Shop repurposed items</p>
                </div>
              </router-link>
              
              <router-link
                to="/user/orders"
                class="flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <DocumentTextIcon class="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
                <div class="ml-2 sm:ml-3">
                  <p class="text-xs sm:text-sm font-medium text-gray-900">My Orders</p>
                  <p class="text-xs sm:text-sm text-gray-500">View order history</p>
                </div>
              </router-link>
              
              <router-link
                to="/user/profile"
                class="flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <UserIcon class="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
                <div class="ml-2 sm:ml-3">
                  <p class="text-xs sm:text-sm font-medium text-gray-900">Profile</p>
                  <p class="text-xs sm:text-sm text-gray-500">Manage account</p>
                </div>
              </router-link>
              
              <router-link
                to="/user/favorites"
                class="flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <HeartIcon class="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
                <div class="ml-2 sm:ml-3">
                  <p class="text-xs sm:text-sm font-medium text-gray-900">Favorites</p>
                  <p class="text-xs sm:text-sm text-gray-500">Saved products</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card">
          <div class="card-header p-3 sm:p-4 lg:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="space-y-3 sm:space-y-4">
              <div
                v-for="order in recentOrders"
                :key="order.id"
                class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img
                      v-if="order.product.image_url && !imageErrors[order.id]"
                      :src="getSafeImageUrl(order.product.image_url)"
                      :alt="order.product.name"
                      class="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                      @error="handleImageError(order.id)"
                      loading="lazy"
                    />
                    <div v-else class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center">
                      <CubeIcon class="w-3 h-3 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-900">{{ order.product.name }}</p>
                    <p class="text-xs text-gray-500">Order #{{ order.id }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span :class="getStatusBadgeClass(order.status)" class="text-xs sm:text-sm">
                    {{ order.status }}
                  </span>
                  <p class="text-xs sm:text-sm font-medium text-gray-900 mt-1">₱{{ order.total_price }}</p>
                </div>
              </div>
            </div>
            <div class="mt-3 sm:mt-4">
              <router-link
                to="/user/orders"
                class="text-primary-600 hover:text-primary-900 text-xs sm:text-sm font-medium"
              >
                View all orders →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Products -->
      <div class="card">
        <div class="card-header p-3 sm:p-4 lg:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">Featured Products</h3>
        </div>
        <div class="card-body p-3 sm:p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div
              v-for="product in featuredProducts"
              :key="product.id"
              class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div class="w-full h-24 sm:h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  v-if="product.image_url && !imageErrors[product.id]"
                  :src="getSafeImageUrl(product.image_url)"
                  :alt="product.name"
                  class="w-full h-24 sm:h-32 object-cover"
                  @error="handleImageError(product.id)"
                  loading="lazy"
                />
                <div v-else class="w-full h-24 sm:h-32 bg-gray-200 flex items-center justify-center">
                  <CubeIcon class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
              </div>
              <div class="p-3 sm:p-4">
                <h4 class="font-medium text-gray-900 text-sm sm:text-base">{{ product.name }}</h4>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ product.description }}</p>
                <div class="flex items-center justify-between mt-2 sm:mt-3">
                  <span class="text-sm sm:text-lg font-semibold text-primary-600">₱{{ product.price }}</span>
                  <button class="btn-primary text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { getSafeImageUrl } from '@/utils/imageUtils'
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserIcon,
  HeartIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const productsStore = useProductsStore()

const user = computed(() => authStore.user)

const imageErrors = ref<Record<string, boolean>>({})

const stats = ref({
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  totalSpent: 0
})

const recentOrders = ref([
  {
    id: 'ORD-001',
    product: {
      name: 'Organic Banana Compost',
      image_url: '/images/banana-compost.jpg'
    },
    status: 'delivered',
    total_price: 300
  },
  {
    id: 'ORD-002',
    product: {
      name: 'Mango Jam',
      image_url: '/images/mango-jam.jpg'
    },
    status: 'shipped',
    total_price: 80
  }
])

const featuredProducts = ref([
  {
    id: '1',
    name: 'Organic Banana Compost',
    description: 'Rich compost made from overripe bananas',
    price: 150,
    image_url: '/images/banana-compost.jpg'
  },
  {
    id: '2',
    name: 'Tomato Fertilizer',
    description: 'Natural fertilizer derived from bruised tomatoes',
    price: 200,
    image_url: '/images/tomato-fertilizer.jpg'
  },
  {
    id: '3',
    name: 'Mango Jam',
    description: 'Delicious jam made from damaged mangoes',
    price: 80,
    image_url: '/images/mango-jam.jpg'
  },
  {
    id: '4',
    name: 'Rice Husk Fertilizer',
    description: 'Eco-friendly fertilizer made from excess rice husks',
    price: 90,
    image_url: '/images/rice-fertilizer.jpg'
  }
])

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    confirmed: 'badge-primary',
    processing: 'badge-primary',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const handleImageError = (orderId: string) => {
  imageErrors.value[orderId] = true
}

const loadStats = async () => {
  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, using fallback data')
      // Use fallback data
      stats.value = {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalSpent: 0
      }
      
      recentOrders.value = []
      featuredProducts.value = []
      return
    }
    
    // Debug: Check if user is authenticated
    console.log('Loading dashboard for user:', user.value)
    console.log('User ID:', user.value?.id)
    
    // Load products and orders
    await Promise.all([
      productsStore.loadProducts(),
      productsStore.loadOrders()
    ])
    
    console.log('All orders from store:', productsStore.orders)
    
    // Filter orders for current user
    const userOrders = productsStore.orders.filter(order => order.user_id === user.value?.id)
    
    console.log('Filtered orders for user:', userOrders)
    
    // Calculate stats from actual data
    stats.value = {
      totalOrders: userOrders.length,
      completedOrders: userOrders.filter(order => order.status === 'delivered').length,
      pendingOrders: userOrders.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)).length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.total_price, 0)
    }
    
    // Update recent orders with actual data
    recentOrders.value = userOrders.slice(0, 5).map(order => ({
      id: order.id,
      product: {
        name: order.product?.name || 'Unknown Product',
        image_url: order.product?.image_url || '/images/placeholder.jpg'
      },
      status: order.status,
      total_price: order.total_price
    }))
    
    // Update featured products with actual data
    featuredProducts.value = productsStore.products.slice(0, 4).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || '/images/placeholder.jpg'
    }))
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>
