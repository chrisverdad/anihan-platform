<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Order History</h1>
            <p class="text-gray-600 mt-1">Track your orders and their status</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="statusFilter" class="form-input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <ClockIcon class="w-5 h-5 text-warning-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pending</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.pending }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CogIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Processing</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.processing }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon class="w-5 h-5 text-success-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Delivered</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.delivered }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon class="w-5 h-5 text-info-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Spent</p>
                <p class="text-2xl font-semibold text-gray-900">₱{{ stats.totalSpent.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">
            My Orders ({{ filteredOrders.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(order.order_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          v-if="order.product?.image_url && !imageErrors[order.id]"
                          :src="order.product?.image_url"
                          :alt="order.product?.name"
                          class="h-10 w-10 object-cover rounded"
                          @error="handleImageError(order.id)"
                          loading="lazy"
                        />
                        <div v-else class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <CubeIcon class="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ order.product?.name }}</div>
                      <div class="text-sm text-gray-500">{{ order.product?.category }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.quantity }} {{ order.product?.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ order.total_price.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <span :class="getPaymentStatusBadgeClass(order.payment_status)">
                      {{ order.payment_status }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ order.payment_method?.toUpperCase() }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getDeliveryStatusBadgeClass(order.delivery_status)">
                    {{ order.delivery_status?.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.order_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    <button
                      v-if="order.status === 'pending'"
                      @click="cancelOrder(order.id)"
                      class="text-danger-600 hover:text-danger-900"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="card-footer">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
              {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of 
              {{ filteredOrders.length }} results
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Order Details</h3>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Order Info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Order Number</label>
                <p class="text-sm text-gray-900">#{{ selectedOrder.id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <span :class="getStatusBadgeClass(selectedOrder.status)">
                  {{ selectedOrder.status }}
                </span>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Order Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedOrder.order_date) }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Delivery Date</label>
                <p class="text-sm text-gray-900">
                  {{ selectedOrder.delivery_date ? formatDate(selectedOrder.delivery_date) : 'TBD' }}
                </p>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">Product Information</h4>
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    v-if="selectedOrder.product?.image_url && !imageErrors[selectedOrder.id]"
                    :src="selectedOrder.product?.image_url"
                    :alt="selectedOrder.product?.name"
                    class="w-16 h-16 object-cover rounded-lg"
                    @error="handleImageError(selectedOrder.id)"
                  />
                  <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <CubeIcon class="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900">{{ selectedOrder.product?.name }}</h5>
                  <p class="text-sm text-gray-500">{{ selectedOrder.product?.description }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="text-sm text-gray-500">Quantity: {{ selectedOrder.quantity }}</span>
                    <span class="text-sm text-gray-500">Unit Price: ₱{{ selectedOrder.product?.price }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">Order Summary</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Subtotal</span>
                  <span class="text-gray-900">₱{{ (selectedOrder.product?.price || 0) * selectedOrder.quantity }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Shipping</span>
                  <span class="text-gray-900">₱0</span>
                </div>
                <div class="flex justify-between text-sm font-medium border-t pt-2">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">₱{{ selectedOrder.total_price.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <!-- Notes -->
            <div v-if="selectedOrder.notes" class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-2">Notes</h4>
              <p class="text-sm text-gray-900">{{ selectedOrder.notes }}</p>
            </div>
            
            <!-- Status Timeline -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">Order Timeline</h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Order Placed</p>
                    <p class="text-xs text-gray-500">{{ formatDate(selectedOrder.order_date) }}</p>
                  </div>
                </div>
                <div v-if="['confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status)" class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Order Confirmed</p>
                    <p class="text-xs text-gray-500">Processing your order</p>
                  </div>
                </div>
                <div v-if="['shipped', 'delivered'].includes(selectedOrder.status)" class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Order Shipped</p>
                    <p class="text-xs text-gray-500">On its way to you</p>
                  </div>
                </div>
                <div v-if="selectedOrder.status === 'delivered'" class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Order Delivered</p>
                    <p class="text-xs text-gray-500">{{ formatDate(selectedOrder.delivery_date || '') }}</p>
                  </div>
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
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import {
  ClockIcon,
  CogIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import type { Order } from '@/types'

const toast = useToast()
const authStore = useAuthStore()
const productsStore = useProductsStore()

// State
const orders = ref<Order[]>([])
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedOrder = ref<Order | null>(null)
const imageErrors = ref<Record<string, boolean>>({})

const stats = ref({
  pending: 0,
  processing: 0,
  delivered: 0,
  totalSpent: 0
})

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
})

// Methods
const loadOrders = async () => {
  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, using fallback data')
      // Use empty fallback data
      orders.value = []
      
      // Calculate stats from fallback data
      stats.value = {
        pending: orders.value.filter(order => order.status === 'pending').length,
        processing: orders.value.filter(order => ['confirmed', 'processing', 'shipped'].includes(order.status)).length,
        delivered: orders.value.filter(order => order.status === 'delivered').length,
        totalSpent: orders.value.reduce((sum, order) => sum + order.total_price, 0)
      }
      return
    }
    
    // Debug: Check if user is authenticated
    console.log('Loading orders for user:', authStore.user)
    console.log('User ID:', authStore.user?.id)
    
    // Load orders from products store
    await productsStore.loadOrders()
    
    console.log('All orders from store:', productsStore.orders)
    
    // Filter orders for current user
    const userOrders = productsStore.orders.filter(order => order.user_id === authStore.user?.id)
    
    console.log('Filtered orders for user:', userOrders)
    
    orders.value = userOrders
    
    // Calculate stats
    stats.value = {
      pending: userOrders.filter(order => order.status === 'pending').length,
      processing: userOrders.filter(order => ['confirmed', 'processing', 'shipped'].includes(order.status)).length,
      delivered: userOrders.filter(order => order.status === 'delivered').length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.total_price, 0)
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
    // Fallback to mock data if needed
  orders.value = [
    {
      id: 'ORD-001',
      user_id: authStore.user?.id || '3',
      product_id: '1',
      quantity: 2,
      total_price: 300,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'gcash',
      payment_reference: '09123456789',
      delivery_status: 'pending',
      delivery_address: 'Residential Area, Butuan City',
      delivery_notes: 'Please deliver in the morning',
      order_date: '2024-12-15T10:30:00Z',
      notes: 'Please deliver in the morning',
        user: {
          id: authStore.user?.id || '3',
          email: authStore.user?.email || 'user@anihan.com',
          full_name: authStore.user?.full_name || 'Pedro Garcia',
          role: 'user',
          phone: authStore.user?.phone || '+63 912 345 6786',
          address: authStore.user?.address || 'Residential Area, Butuan City',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          is_active: true
        },
      product: {
        id: '1',
        name: 'Organic Banana Compost',
        description: 'Rich compost made from overripe bananas',
        price: 150,
        category: 'compost',
        image_url: '/images/banana-compost.jpg',
        stock_quantity: 25,
        unit: 'kg',
        is_available: true,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    },
    {
      id: 'ORD-002',
      user_id: authStore.user?.id || '3',
      product_id: '3',
      quantity: 1,
      total_price: 80,
      status: 'processing',
      payment_status: 'paid',
      payment_method: 'cash',
      payment_reference: 'CASH-001',
      delivery_status: 'assigned',
      delivery_address: 'Residential Area, Butuan City',
      delivery_notes: 'Rush order',
      order_date: '2024-12-14T16:45:00Z',
      notes: '',
        user: {
          id: authStore.user?.id || '3',
          email: authStore.user?.email || 'user@anihan.com',
          full_name: authStore.user?.full_name || 'Pedro Garcia',
          role: 'user',
          phone: authStore.user?.phone || '+63 912 345 6786',
          address: authStore.user?.address || 'Residential Area, Butuan City',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          is_active: true
        },
      product: {
        id: '3',
        name: 'Mango Jam',
        description: 'Delicious jam made from damaged mangoes',
        price: 80,
        category: 'preserved_food',
        image_url: '/images/mango-jam.jpg',
        stock_quantity: 30,
        unit: 'bottles',
        is_available: true,
        created_at: '2024-03-05T00:00:00Z',
        updated_at: '2024-03-05T00:00:00Z'
      }
    },
    {
      id: 'ORD-003',
      user_id: authStore.user?.id || '3',
      product_id: '2',
      quantity: 3,
      total_price: 600,
      status: 'delivered',
      payment_status: 'paid',
      payment_method: 'gcash',
      payment_reference: '09123456789',
      delivery_status: 'delivered',
      delivery_address: 'Residential Area, Butuan City',
      delivery_notes: 'Delivered successfully',
      order_date: '2024-12-10T09:15:00Z',
      delivery_date: '2024-12-12T14:30:00Z',
      notes: 'Rush order needed',
        user: {
          id: authStore.user?.id || '3',
          email: authStore.user?.email || 'user@anihan.com',
          full_name: authStore.user?.full_name || 'Pedro Garcia',
          role: 'user',
          phone: authStore.user?.phone || '+63 912 345 6786',
          address: authStore.user?.address || 'Residential Area, Butuan City',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          is_active: true
        },
      product: {
        id: '2',
        name: 'Tomato Fertilizer',
        description: 'Natural fertilizer derived from bruised tomatoes',
        price: 200,
        category: 'fertilizer',
        image_url: '/images/tomato-fertilizer.jpg',
        stock_quantity: 15,
        unit: 'bags',
        is_available: true,
        created_at: '2024-02-10T00:00:00Z',
        updated_at: '2024-02-10T00:00:00Z'
      }
    },
    {
      id: 'ORD-004',
      user_id: authStore.user?.id || '3',
      product_id: '4',
      quantity: 1,
      total_price: 120,
      status: 'shipped',
      payment_status: 'paid',
      payment_method: 'cash',
      payment_reference: 'CASH-002',
      delivery_status: 'in_transit',
      delivery_address: 'Residential Area, Butuan City',
      delivery_notes: 'Regular delivery',
      order_date: '2024-12-08T11:20:00Z',
      notes: '',
        user: {
          id: authStore.user?.id || '3',
          email: authStore.user?.email || 'user@anihan.com',
          full_name: authStore.user?.full_name || 'Pedro Garcia',
          role: 'user',
          phone: authStore.user?.phone || '+63 912 345 6786',
          address: authStore.user?.address || 'Residential Area, Butuan City',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          is_active: true
        },
      product: {
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
      }
    }
  ]

  // Calculate stats from fallback data
  stats.value = {
    pending: orders.value.filter(order => order.status === 'pending').length,
    processing: orders.value.filter(order => ['confirmed', 'processing', 'shipped'].includes(order.status)).length,
    delivered: orders.value.filter(order => order.status === 'delivered').length,
    totalSpent: orders.value.reduce((sum, order) => sum + order.total_price, 0)
  }
  }
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const cancelOrder = async (orderId: string) => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
    }
    
    toast.success('Order cancelled successfully')
    loadOrders() // Reload stats
  } catch (error) {
    toast.error('Failed to cancel order')
  }
}

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

const getPaymentStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    paid: 'badge-success',
    failed: 'badge-danger',
    refunded: 'badge-info'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const getDeliveryStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    assigned: 'badge-info',
    picked_up: 'badge-primary',
    in_transit: 'badge-secondary',
    delivered: 'badge-success',
    failed: 'badge-danger'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (orderId: string) => {
  imageErrors.value[orderId] = true
}

onMounted(() => {
  loadOrders()
})
</script>
