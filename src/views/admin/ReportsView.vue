<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p class="text-gray-600 mt-1">Comprehensive system reports and analytics</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="reportPeriod" class="form-input">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button @click="generateReport" class="btn-primary">
              <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UsersIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Users</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.totalUsers }}</p>
                <p class="text-xs text-success-600">+{{ metrics.userGrowth }}% from last period</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-5 h-5 text-success-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Waste Processed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.wasteProcessed }} kg</p>
                <p class="text-xs text-success-600">+{{ metrics.wasteGrowth }}% from last period</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon class="w-5 h-5 text-warning-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Orders Completed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.ordersCompleted }}</p>
                <p class="text-xs text-success-600">+{{ metrics.orderGrowth }}% from last period</p>
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
                <p class="text-sm font-medium text-gray-500">Revenue</p>
                <p class="text-2xl font-semibold text-gray-900">₱{{ metrics.revenue.toLocaleString() }}</p>
                <p class="text-xs text-success-600">+{{ metrics.revenueGrowth }}% from last period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Waste Processing Trend -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Waste Processing Trend</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="wasteTrendChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Revenue Trend</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="revenueTrendChart"></canvas>
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
                <UsersIcon class="w-8 h-8 text-primary-600" />
              </div>
              <h4 class="font-medium text-gray-900 mb-1">Total Users</h4>
              <p class="text-2xl font-bold text-primary-600">{{ userStats.totalUsers }}</p>
              <p class="text-sm text-gray-500">All registered users</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CubeIcon class="w-8 h-8 text-success-600" />
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

      <!-- Detailed Reports -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Vendors -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Top Performing Vendors</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="(vendor, index) in topVendors"
                :key="vendor.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ vendor.name }}</p>
                    <p class="text-sm text-gray-500">{{ vendor.submissions }} submissions</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ vendor.wasteProcessed }} kg</p>
                  <p class="text-sm text-gray-500">processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Products -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Most Popular Products</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="(product, index) in popularProducts"
                :key="product.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-success-600">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">{{ product.category }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ product.orders }} orders</p>
                  <p class="text-sm text-gray-500">₱{{ product.revenue.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="mt-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">System Health & Performance</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon class="w-8 h-8 text-success-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">System Uptime</h4>
                <p class="text-2xl font-bold text-success-600">99.9%</p>
                <p class="text-sm text-gray-500">Last 30 days</p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClockIcon class="w-8 h-8 text-primary-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">Avg Response Time</h4>
                <p class="text-2xl font-bold text-primary-600">245ms</p>
                <p class="text-sm text-gray-500">API calls</p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UsersIcon class="w-8 h-8 text-info-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">Active Users</h4>
                <p class="text-2xl font-bold text-info-600">{{ metrics.activeUsers }}</p>
                <p class="text-sm text-gray-500">Currently online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
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
  LineElement,
  PointElement,
  BarController,
  LineController
} from 'chart.js'
import {
  DocumentArrowDownIcon,
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarController,
  LineController
)

const toast = useToast()
const usersStore = useUsersStore()
const wasteStore = useWasteStore()
const productsStore = useProductsStore()

// Chart references
const wasteTrendChart = ref<HTMLCanvasElement>()
const revenueTrendChart = ref<HTMLCanvasElement>()

// State
const reportPeriod = ref('30')
const loading = ref(false)

const metrics = ref({
  totalUsers: 0,
  userGrowth: 0,
  wasteProcessed: 0,
  wasteGrowth: 0,
  ordersCompleted: 0,
  orderGrowth: 0,
  revenue: 0,
  revenueGrowth: 0,
  activeUsers: 0
})

const topVendors = ref<Array<{id: number, name: string, submissions: number, wasteProcessed: number}>>([])
const popularProducts = ref<Array<{name: string, category: string, orders: number, revenue: number, id: string}>>([])

const userStats = ref({
  totalUsers: 0,
  vendors: 0,
  customers: 0,
  activeUsers: 0,
  activePercentage: 0
})

// Methods
const loadMetrics = async () => {
  loading.value = true
  try {
    // Load data from localStorage-based stores
    await Promise.all([
      usersStore.loadUsers(),
      wasteStore.loadSourceWasteSubmissions(),
      productsStore.loadProducts(),
      productsStore.loadOrders()
    ])
    
    const allUsers = usersStore.users
    const allSubmissions = wasteStore.sourceWasteSubmissions
    const allProducts = productsStore.products
    const allOrders = productsStore.orders
    
    // Calculate metrics with more accurate data
    const processedWaste = allSubmissions.filter(s => s.status === 'processed')
    const totalWasteProcessed = processedWaste.reduce((sum, s) => sum + s.quantity, 0)
    
    // Calculate growth percentages based on actual data
    const totalUsers = allUsers.length
    const activeUsers = allUsers.filter(u => u.is_active).length
    const vendors = allUsers.filter(u => u.role === 'vendor').length
    const regularUsers = allUsers.filter(u => u.role === 'user').length
    
    const completedOrders = allOrders.filter(o => o.status === 'delivered').length
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total_price, 0)
    
    // Calculate growth based on recent activity
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentUsers = allUsers.filter(u => new Date(u.created_at) > thirtyDaysAgo).length
    const recentSubmissions = allSubmissions.filter(s => new Date(s.submitted_at || '') > thirtyDaysAgo).length
    const recentOrders = allOrders.filter(o => new Date(o.order_date) > thirtyDaysAgo).length
    
    metrics.value = {
      totalUsers: totalUsers,
      userGrowth: totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100 * 10) / 10 : 0,
      wasteProcessed: totalWasteProcessed,
      wasteGrowth: allSubmissions.length > 0 ? Math.round((recentSubmissions / allSubmissions.length) * 100 * 10) / 10 : 0,
      ordersCompleted: completedOrders,
      orderGrowth: allOrders.length > 0 ? Math.round((recentOrders / allOrders.length) * 100 * 10) / 10 : 0,
      revenue: totalRevenue,
      revenueGrowth: totalRevenue > 0 ? Math.round(Math.random() * 30 + 10) : 0, // Simulated growth
      activeUsers: activeUsers
    }
    
    // Calculate user statistics
    userStats.value = {
      totalUsers: totalUsers,
      vendors: vendors,
      customers: regularUsers,
      activeUsers: activeUsers,
      activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    }
    
    // Calculate top vendors by waste submissions
    const vendorStats: Record<string, { name: string, submissions: number, wasteProcessed: number }> = {}
    allSubmissions.forEach(sub => {
      const vendorId = sub.vendor_id || (typeof sub.vendor === 'object' ? sub.vendor?.id : sub.vendor)
      if (vendorId) {
        if (!vendorStats[vendorId]) {
          const vendor = allUsers.find(u => u.id === vendorId)
          vendorStats[vendorId] = {
            name: vendor?.full_name || 'Unknown Vendor',
            submissions: 0,
            wasteProcessed: 0
          }
        }
        vendorStats[vendorId].submissions++
        vendorStats[vendorId].wasteProcessed += sub.quantity
      }
    })
    
    topVendors.value = Object.entries(vendorStats)
      .map(([, data], index) => ({
        id: index + 1,
        name: data.name,
        submissions: data.submissions,
        wasteProcessed: data.wasteProcessed
      }))
      .sort((a, b) => b.wasteProcessed - a.wasteProcessed)
      .slice(0, 5)
    
    // Get popular products from orders
    const productStats: Record<string, { name: string, category: string, orders: number, revenue: number }> = {}
    allOrders.forEach(order => {
      const product = order.product || allProducts.find(p => p.id === order.product_id)
      if (product) {
        if (!productStats[product.id]) {
          productStats[product.id] = {
            name: product.name,
            category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            orders: 0,
            revenue: 0
          }
        }
        productStats[product.id].orders++
        productStats[product.id].revenue += order.total_price
      }
    })
    
    popularProducts.value = Object.entries(productStats)
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  } catch (error: any) {
    console.error('Failed to load metrics:', error)
    toast.error('Failed to load report data')
  } finally {
    loading.value = false
  }
}

const generateReport = () => {
  toast.success(`Generating report for last ${reportPeriod.value} days...`)
  // In real app, this would trigger report generation and download
}

const createWasteTrendChart = () => {
  if (!wasteTrendChart.value) return
  const ctx = wasteTrendChart.value.getContext('2d')
  if (!ctx) return

  // Generate last 7 days data
  const last7Days = []
  const wasteData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    // Count waste submissions for this day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    
    const daySubmissions = wasteStore.sourceWasteSubmissions.filter(sub => {
      const subDate = new Date(sub.submitted_at || new Date())
      return subDate >= dayStart && subDate <= dayEnd && sub.status === 'processed'
    })
    
    const totalWaste = daySubmissions.reduce((sum, sub) => sum + sub.quantity, 0)
    wasteData.push(totalWaste)
  }

  new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Waste Processed (kg)',
        data: wasteData,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
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
          title: {
            display: true,
            text: 'Waste Processed (kg)'
          }
        }
      }
    }
  })
}

const createRevenueTrendChart = () => {
  if (!revenueTrendChart.value) return
  const ctx = revenueTrendChart.value.getContext('2d')
  if (!ctx) return

  // Generate last 7 days data
  const last7Days = []
  const revenueData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    // Calculate revenue for this day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    
    const dayOrders = productsStore.orders.filter(order => {
      const orderDate = new Date(order.order_date)
      return orderDate >= dayStart && orderDate <= dayEnd && order.status === 'delivered'
    })
    
    const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_price, 0)
    revenueData.push(dayRevenue)
  }

  new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Revenue (₱)',
        data: revenueData,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += `₱${context.parsed.y.toLocaleString()}`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue (₱)'
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await loadMetrics()
  await nextTick() // Ensure canvas elements are rendered
  createWasteTrendChart()
  createRevenueTrendChart()
})
</script>
