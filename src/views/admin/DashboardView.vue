<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="mb-2 sm:mb-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">System administration and monitoring</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-xs sm:text-sm text-gray-500">Welcome, {{ user?.full_name }}</p>
              <p class="text-xs sm:text-sm text-gray-500">Administrator</p>
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
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon class="w-3 h-3 sm:w-5 sm:h-5 text-violet-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon class="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Waste Submissions</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{{ stats.wasteSubmissions }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-diamond-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon class="w-3 h-3 sm:w-5 sm:h-5 text-diamond-600" />
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
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-blood-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon class="w-3 h-3 sm:w-5 sm:h-5 text-blood-600" />
                </div>
              </div>
              <div class="ml-2 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">₱{{ stats.totalRevenue.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Statistics -->
      <div class="card mb-8">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">User Statistics</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserGroupIcon class="w-8 h-8 text-primary-600" />
              </div>
              <h4 class="font-medium text-gray-900 mb-1">Total Users</h4>
              <p class="text-2xl font-bold text-primary-600">{{ userStats.totalUsers }}</p>
              <p class="text-sm text-gray-500">All registered users</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DocumentTextIcon class="w-8 h-8 text-success-600" />
              </div>
              <h4 class="font-medium text-gray-900 mb-1">Vendors</h4>
              <p class="text-2xl font-bold text-success-600">{{ userStats.vendors }}</p>
              <p class="text-sm text-gray-500">Waste suppliers</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBagIcon class="w-8 h-8 text-warning-600" />
              </div>
              <h4 class="font-medium text-gray-900 mb-1">Customers</h4>
              <p class="text-2xl font-bold text-warning-600">{{ userStats.customers }}</p>
              <p class="text-sm text-gray-500">Product buyers</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon class="w-8 h-8 text-info-600" />
              </div>
              <h4 class="font-medium text-gray-900 mb-1">Active Users</h4>
              <p class="text-2xl font-bold text-info-600">{{ userStats.activeUsers }}</p>
              <p class="text-sm text-gray-500">{{ userStats.activePercentage }}% of total</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Waste Processing Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Waste Processing Status</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="wasteChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- Orders Status Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Orders Status Distribution</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="ordersChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Trend Chart -->
      <div class="card mb-8">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Revenue Trend (Last 7 Days)</h3>
        </div>
        <div class="card-body">
          <div class="h-80">
            <canvas ref="revenueChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <router-link
                to="/admin/users"
                class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <UserGroupIcon class="w-6 h-6 text-primary-600" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Manage Users</p>
                  <p class="text-sm text-gray-500">User management panel</p>
                </div>
              </router-link>
              
              <router-link
                to="/admin/analytics"
                class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChartBarIcon class="w-6 h-6 text-primary-600" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Analytics</p>
                  <p class="text-sm text-gray-500">View system analytics</p>
                </div>
              </router-link>
              
              <router-link
                to="/admin/waste"
                class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <DocumentTextIcon class="w-6 h-6 text-primary-600" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Waste Management</p>
                  <p class="text-sm text-gray-500">Manage waste submissions</p>
                </div>
              </router-link>
              
              <router-link
                to="/admin/orders"
                class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ShoppingBagIcon class="w-6 h-6 text-primary-600" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Order Management</p>
                  <p class="text-sm text-gray-500">Manage orders</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <component :is="activity.icon" class="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">System Status</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon class="w-8 h-8 text-green-600" />
              </div>
              <h4 class="text-lg font-semibold text-gray-900">System Online</h4>
              <p class="text-sm text-gray-500">All services operational</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ServerIcon class="w-8 h-8 text-blue-600" />
              </div>
              <h4 class="text-lg font-semibold text-gray-900">Database</h4>
              <p class="text-sm text-gray-500">Connected and healthy</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CloudIcon class="w-8 h-8 text-purple-600" />
              </div>
              <h4 class="text-lg font-semibold text-gray-900">Storage</h4>
              <p class="text-sm text-gray-500">85% capacity used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useWasteStore } from '@/stores/waste'
import { useProductsStore } from '@/stores/products'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  DoughnutController,
  BarController,
  LineController
} from 'chart.js'
import {
  UserGroupIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ServerIcon,
  CloudIcon
} from '@heroicons/vue/24/outline'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  DoughnutController,
  BarController,
  LineController
)

const authStore = useAuthStore()
const usersStore = useUsersStore()
const wasteStore = useWasteStore()
const productsStore = useProductsStore()

const user = computed(() => authStore.user)
const loading = ref(false)

// Chart references
const wasteChart = ref<HTMLCanvasElement>()
const ordersChart = ref<HTMLCanvasElement>()
const revenueChart = ref<HTMLCanvasElement>()

const stats = ref({
  totalUsers: 0,
  wasteSubmissions: 0,
  totalOrders: 0,
  totalRevenue: 0
})

const userStats = ref({
  totalUsers: 0,
  vendors: 0,
  customers: 0,
  activeUsers: 0,
  activePercentage: 0
})

const recentActivities = ref<Array<{
  id: string | number;
  description: string;
  timestamp: string;
  icon: any;
}>>([
  {
    id: 1,
    description: 'New user registered: Maria Santos',
    timestamp: '2 hours ago',
    icon: UserGroupIcon
  },
  {
    id: 2,
    description: 'Waste submission approved: Overripe Bananas',
    timestamp: '4 hours ago',
    icon: DocumentTextIcon
  },
  {
    id: 3,
    description: 'Order #ORD-003 processed successfully',
    timestamp: '6 hours ago',
    icon: ShoppingBagIcon
  },
  {
    id: 4,
    description: 'System backup completed',
    timestamp: '8 hours ago',
    icon: ServerIcon
  }
])

const loadStats = async () => {
  loading.value = true
  try {
    // Load data from stores
    await Promise.all([
      usersStore.loadUsers(),
      wasteStore.loadSourceWasteSubmissions(),
      productsStore.loadOrders()
    ])
    
    // Calculate stats from real data
    stats.value = {
      totalUsers: usersStore.users.length,
      wasteSubmissions: wasteStore.sourceWasteSubmissions.length,
      totalOrders: productsStore.orders.length,
      totalRevenue: productsStore.orders.reduce((sum, order) => sum + order.total_price, 0)
    }
    
    // Calculate user statistics
    const allUsers = usersStore.users
    const vendors = allUsers.filter(u => u.role === 'vendor').length
    const customers = allUsers.filter(u => u.role === 'user').length
    const activeUsers = allUsers.filter(u => u.is_active).length
    
    userStats.value = {
      totalUsers: allUsers.length,
      vendors: vendors,
      customers: customers,
      activeUsers: activeUsers,
      activePercentage: allUsers.length > 0 ? Math.round((activeUsers / allUsers.length) * 100) : 0
    }
    
    // Update recent activities with actual data
    const recentUsers = usersStore.users.slice(0, 2)
    const recentSubmissions = wasteStore.sourceWasteSubmissions.slice(0, 2)
    const recentOrders = productsStore.orders.slice(0, 2)
    
    recentActivities.value = [
      ...recentUsers.map((user: any, index: number) => ({
        id: `user-${index}`,
        description: `New user registered: ${user.full_name}`,
        timestamp: new Date(user.created_at).toLocaleDateString(),
        icon: UserGroupIcon
      })),
      ...recentSubmissions.map((submission: any, index: number) => ({
        id: `submission-${index}`,
        description: `Waste submission ${submission.status}: ${submission.title || 'Unknown'}`,
        timestamp: new Date(submission.submitted_at).toLocaleDateString(),
        icon: DocumentTextIcon
      })),
      ...recentOrders.map((order: any, index: number) => ({
        id: `order-${index}`,
        description: `Order ${order.status}: ${order.product?.name || 'Unknown Product'}`,
        timestamp: new Date(order.order_date).toLocaleDateString(),
        icon: ShoppingBagIcon
      }))
    ].slice(0, 5) // Limit to 5 recent activities
    
  } catch (error) {
    console.error('Failed to load admin dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const createWasteChart = () => {
  if (!wasteChart.value) return
  
  const ctx = wasteChart.value.getContext('2d')
  if (!ctx) return
  
  const wasteData = wasteStore.sourceWasteSubmissions
  const statusCounts = {
    pending: wasteData.filter(s => s.status === 'pending').length,
    approved: wasteData.filter(s => s.status === 'approved').length,
    processed: wasteData.filter(s => s.status === 'processed').length,
    rejected: wasteData.filter(s => s.status === 'rejected').length
  }
  
  new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Approved', 'Processed', 'Rejected'],
      datasets: [{
        data: [statusCounts.pending, statusCounts.approved, statusCounts.processed, statusCounts.rejected],
        backgroundColor: [
          '#F59E0B', // Amber for pending
          '#10B981', // Emerald for approved
          '#3B82F6', // Blue for processed
          '#EF4444'  // Red for rejected
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const createOrdersChart = () => {
  if (!ordersChart.value) return
  
  const ctx = ordersChart.value.getContext('2d')
  if (!ctx) return
  
  const ordersData = productsStore.orders
  const statusCounts = {
    pending: ordersData.filter(o => o.status === 'pending').length,
    confirmed: ordersData.filter(o => o.status === 'confirmed').length,
    processing: ordersData.filter(o => o.status === 'processing').length,
    shipped: ordersData.filter(o => o.status === 'shipped').length,
    delivered: ordersData.filter(o => o.status === 'delivered').length,
    cancelled: ordersData.filter(o => o.status === 'cancelled').length
  }
  
  new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      datasets: [{
        label: 'Orders',
        data: [statusCounts.pending, statusCounts.confirmed, statusCounts.processing, statusCounts.shipped, statusCounts.delivered, statusCounts.cancelled],
        backgroundColor: [
          '#F59E0B', // Amber for pending
          '#10B981', // Emerald for confirmed
          '#3B82F6', // Blue for processing
          '#8B5CF6', // Purple for shipped
          '#059669', // Green for delivered
          '#EF4444'  // Red for cancelled
        ],
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

const createRevenueChart = () => {
  if (!revenueChart.value) return
  
  const ctx = revenueChart.value.getContext('2d')
  if (!ctx) return
  
  // Generate last 7 days data
  const ordersData = productsStore.orders
  const last7Days = []
  const revenueData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayRevenue = ordersData
      .filter(order => order.order_date.startsWith(dateStr))
      .reduce((sum, order) => sum + order.total_price, 0)
    
    last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    revenueData.push(dayRevenue)
  }
  
  new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Revenue (₱)',
        data: revenueData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₱' + value.toLocaleString()
            }
          }
        }
      }
    }
  })
}

const createCharts = async () => {
  await nextTick()
  createWasteChart()
  createOrdersChart()
  createRevenueChart()
}

onMounted(async () => {
  await loadStats()
  await createCharts()
})
</script>
