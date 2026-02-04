<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Delivery Management</h1>
            <p class="text-gray-600 mt-1">Manage delivery assignments and tracking</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="loadDeliveries"
              class="btn-secondary"
            >
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <TruckIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Deliveries</p>
              <p class="text-2xl font-bold text-gray-900">{{ deliveryStats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ deliveryStats.pending }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Delivered</p>
              <p class="text-2xl font-bold text-gray-900">{{ deliveryStats.delivered }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <XCircleIcon class="w-6 h-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Failed</p>
              <p class="text-2xl font-bold text-gray-900">{{ deliveryStats.failed }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="statusFilter" class="form-input">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Person</label>
              <input
                v-model="deliveryPersonFilter"
                type="text"
                placeholder="Search by delivery person..."
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                v-model="orderIdFilter"
                type="text"
                placeholder="Search by order ID..."
                class="form-input"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Deliveries Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Deliveries ({{ filteredDeliveries.length }})</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Person</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="delivery in paginatedDeliveries" :key="delivery.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ delivery.order_id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ delivery.order?.user?.full_name || 'N/A' }}</span>
                    <span class="text-xs text-gray-500">{{ delivery.order?.user?.email || 'N/A' }}</span>
                    <span class="text-xs text-gray-500">{{ delivery.order?.user?.phone || 'N/A' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ delivery.order?.product?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ delivery.order?.delivery_address || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(delivery.status)" class="badge">
                    {{ delivery.status.replace('_', ' ').toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ delivery.delivery_person || 'Not assigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(delivery.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openDeliveryModal(delivery)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredDeliveries.length) }}</span>
                of
                <span class="font-medium">{{ filteredDeliveries.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Management Modal -->
    <div v-if="showDeliveryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Manage Delivery</h3>
            <button @click="closeDeliveryModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                :value="selectedDelivery?.order_id"
                disabled
                class="form-input bg-gray-100"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <div class="bg-gray-100 p-3 rounded-md">
                <div class="text-sm">
                  <div class="font-medium text-gray-900">{{ selectedDelivery?.order?.user?.full_name || 'N/A' }}</div>
                  <div class="text-gray-600">{{ selectedDelivery?.order?.user?.email || 'N/A' }}</div>
                  <div class="text-gray-600">{{ selectedDelivery?.order?.user?.phone || 'N/A' }}</div>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <textarea
                :value="selectedDelivery?.order?.delivery_address"
                disabled
                rows="2"
                class="form-input bg-gray-100"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="deliveryForm.status" class="form-input">
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Person</label>
              <input
                v-model="deliveryForm.delivery_person"
                type="text"
                placeholder="Enter delivery person name"
                class="form-input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Vehicle</label>
              <input
                v-model="deliveryForm.delivery_vehicle"
                type="text"
                placeholder="Enter vehicle type"
                class="form-input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                v-model="deliveryForm.notes"
                rows="3"
                placeholder="Enter delivery notes"
                class="form-input"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeDeliveryModal" class="btn-secondary">
              Cancel
            </button>
            <button @click="updateDelivery" class="btn-primary" :disabled="loading">
              <span v-if="loading">Updating...</span>
              <span v-else>Update Delivery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useToast } from 'vue-toastification'
import type { Delivery } from '@/types'
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const productsStore = useProductsStore()
const toast = useToast()

// State
const deliveries = ref<Delivery[]>([])
const loading = ref(false)
const showDeliveryModal = ref(false)
const selectedDelivery = ref<Delivery | null>(null)

// Filters
const statusFilter = ref('')
const deliveryPersonFilter = ref('')
const orderIdFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Form
const deliveryForm = ref({
  status: 'pending' as Delivery['status'],
  delivery_person: '',
  delivery_vehicle: '',
  notes: ''
})

// Computed
const filteredDeliveries = computed(() => {
  return deliveries.value.filter(delivery => {
    const matchesStatus = !statusFilter.value || delivery.status === statusFilter.value
    const matchesPerson = !deliveryPersonFilter.value || 
      delivery.delivery_person?.toLowerCase().includes(deliveryPersonFilter.value.toLowerCase())
    const matchesOrderId = !orderIdFilter.value || 
      delivery.order_id.toLowerCase().includes(orderIdFilter.value.toLowerCase())
    
    return matchesStatus && matchesPerson && matchesOrderId
  })
})

const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDeliveries.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredDeliveries.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const deliveryStats = computed(() => {
  return {
    total: deliveries.value.length,
    pending: deliveries.value.filter(d => d.status === 'pending').length,
    delivered: deliveries.value.filter(d => d.status === 'delivered').length,
    failed: deliveries.value.filter(d => d.status === 'failed').length
  }
})

// Methods
const loadDeliveries = async () => {
  try {
    await productsStore.loadDeliveries()
    deliveries.value = productsStore.deliveries
  } catch (error) {
    console.error('Failed to load deliveries:', error)
    toast.error('Failed to load deliveries')
  }
}

const openDeliveryModal = (delivery: Delivery) => {
  selectedDelivery.value = delivery
  deliveryForm.value = {
    status: delivery.status,
    delivery_person: delivery.delivery_person || '',
    delivery_vehicle: delivery.delivery_vehicle || '',
    notes: delivery.notes || ''
  }
  showDeliveryModal.value = true
}

const closeDeliveryModal = () => {
  showDeliveryModal.value = false
  selectedDelivery.value = null
  deliveryForm.value = {
    status: 'pending',
    delivery_person: '',
    delivery_vehicle: '',
    notes: ''
  }
}

const updateDelivery = async () => {
  if (!selectedDelivery.value) return
  
  loading.value = true
  try {
    await productsStore.updateDeliveryStatus(
      selectedDelivery.value.id,
      deliveryForm.value.status,
      deliveryForm.value.delivery_person,
      deliveryForm.value.delivery_vehicle
    )
    
    // Update local delivery
    const delivery = deliveries.value.find(d => d.id === selectedDelivery.value!.id)
    if (delivery) {
      delivery.status = deliveryForm.value.status
      delivery.delivery_person = deliveryForm.value.delivery_person
      delivery.delivery_vehicle = deliveryForm.value.delivery_vehicle
      delivery.notes = deliveryForm.value.notes
      delivery.updated_at = new Date().toISOString()
    }
    
    toast.success('Delivery updated successfully')
    closeDeliveryModal()
  } catch (error) {
    console.error('Failed to update delivery:', error)
    toast.error('Failed to update delivery')
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  statusFilter.value = ''
  deliveryPersonFilter.value = ''
  orderIdFilter.value = ''
  currentPage.value = 1
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    assigned: 'badge-info',
    picked_up: 'badge-primary',
    in_transit: 'badge-secondary',
    delivered: 'badge-success',
    failed: 'badge-danger'
  }
  return classes[status as keyof typeof classes] || 'badge-secondary'
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

// Lifecycle
onMounted(() => {
  loadDeliveries()
})
</script>
