<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
            <p class="text-gray-600 mt-1">Manage customer orders and fulfillment</p>
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
                <div class="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon class="w-5 h-5 text-danger-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Revenue</p>
                <p class="text-2xl font-semibold text-gray-900">₱{{ stats.revenue.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">
            Orders ({{ filteredOrders.length }})
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
                  Customer
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
                  Date
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
                  <div class="text-sm text-gray-500">Qty: {{ order.quantity }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ order.user?.full_name }}</div>
                  <div class="text-sm text-gray-500">{{ order.user?.email }}</div>
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
                      v-if="order.status === 'pending'"
                      @click="updateOrderStatus(order.id, 'confirmed')"
                      class="text-success-600 hover:text-success-900"
                    >
                      Confirm
                    </button>
                    <button
                      v-if="order.status === 'confirmed'"
                      @click="updateOrderStatus(order.id, 'processing')"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Process
                    </button>
                    <button
                      v-if="order.status === 'processing'"
                      @click="updateOrderStatus(order.id, 'shipped')"
                      class="text-warning-600 hover:text-warning-900"
                    >
                      Ship
                    </button>
                    <button
                      v-if="order.status === 'shipped'"
                      @click="updateOrderStatus(order.id, 'delivered')"
                      class="text-success-600 hover:text-success-900"
                    >
                      Deliver
                    </button>
                    <button
                      @click="viewOrder(order)"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      View
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
            
            <!-- Customer Info -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Name</label>
                  <p class="text-sm text-gray-900">{{ selectedOrder.user?.full_name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Email</label>
                  <p class="text-sm text-gray-900">{{ selectedOrder.user?.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Phone</label>
                  <p class="text-sm text-gray-900">{{ selectedOrder.user?.phone || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Address</label>
                  <p class="text-sm text-gray-900">{{ selectedOrder.user?.address || 'N/A' }}</p>
                </div>
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
            
            <!-- Payment & Delivery Status Management -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-4">Status Management</h4>
              
              <!-- Payment Status -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <div class="flex items-center space-x-2">
                  <span :class="getPaymentStatusBadgeClass(selectedOrder.payment_status)" class="mr-2">
                    {{ selectedOrder.payment_status }}
                  </span>
                  <select 
                    v-model="selectedOrder.payment_status" 
                    @change="updatePaymentStatus(selectedOrder.id, selectedOrder.payment_status)"
                    class="form-input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div v-if="selectedOrder.payment_method" class="mt-1 text-xs text-gray-500">
                  Method: {{ selectedOrder.payment_method.toUpperCase() }}
                  <span v-if="selectedOrder.payment_reference"> - {{ selectedOrder.payment_reference }}</span>
                </div>
              </div>

              <!-- Delivery Status -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                <div class="flex items-center space-x-2">
                  <span :class="getDeliveryStatusBadgeClass(selectedOrder.delivery_status)" class="mr-2">
                    {{ selectedOrder.delivery_status?.replace('_', ' ') }}
                  </span>
                  <select 
                    v-model="selectedOrder.delivery_status" 
                    @change="updateDeliveryStatus(selectedOrder.id, selectedOrder.delivery_status)"
                    class="form-input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div v-if="selectedOrder.delivery_address" class="mt-1 text-xs text-gray-500">
                  Address: {{ selectedOrder.delivery_address }}
                </div>
                <div v-if="selectedOrder.delivery_notes" class="mt-1 text-xs text-gray-500">
                  Notes: {{ selectedOrder.delivery_notes }}
                </div>
              </div>

              <!-- Order Status -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusBadgeClass(selectedOrder.status)" class="mr-2">
                    {{ selectedOrder.status }}
                  </span>
                  <select 
                    v-model="selectedOrder.status" 
                    @change="updateOrderStatus(selectedOrder.id, selectedOrder.status)"
                    class="form-input text-sm"
                  >
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

            <!-- Notes -->
            <div v-if="selectedOrder.notes" class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-2">Notes</h4>
              <p class="text-sm text-gray-900">{{ selectedOrder.notes }}</p>
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
const productsStore = useProductsStore()

// State
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedOrder = ref<Order | null>(null)

const stats = ref({
  pending: 0,
  processing: 0,
  delivered: 0,
  revenue: 0
})

const imageErrors = ref<Record<string, boolean>>({})

// Computed
const orders = computed(() => productsStore.orders)

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
    await productsStore.loadOrders()
    calculateStats()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
}

const calculateStats = () => {
  const orderList = orders.value
  stats.value = {
    pending: orderList.filter(o => o.status === 'pending').length,
    processing: orderList.filter(o => o.status === 'processing').length,
    delivered: orderList.filter(o => o.status === 'delivered').length,
    revenue: orderList.reduce((sum, o) => sum + o.total_price, 0)
  }
}

const updateOrderStatus = async (id: string, status: string) => {
  try {
    await productsStore.updateOrderStatus(id, status as any)
    toast.success(`Order status updated to ${status}`)
    calculateStats() // Reload stats
  } catch (error) {
    toast.error('Failed to update order status')
  }
}

const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  try {
    await productsStore.updateOrderPaymentStatus(id, paymentStatus as any)
    toast.success(`Payment status updated to ${paymentStatus}`)
    calculateStats() // Reload stats
  } catch (error) {
    toast.error('Failed to update payment status')
  }
}

const updateDeliveryStatus = async (id: string, deliveryStatus: string) => {
  try {
    await productsStore.updateOrderDeliveryStatus(id, deliveryStatus as any)
    toast.success(`Delivery status updated to ${deliveryStatus.replace('_', ' ')}`)
    calculateStats() // Reload stats
  } catch (error) {
    toast.error('Failed to update delivery status')
  }
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const handleImageError = (orderId: string) => {
  imageErrors.value[orderId] = true
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

onMounted(() => {
  loadOrders()
})
</script>
