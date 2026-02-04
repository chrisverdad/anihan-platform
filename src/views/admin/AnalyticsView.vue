<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p class="text-gray-600 mt-1">System performance and insights</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="selectedPeriod" class="form-input">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Waste Reduction</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.wasteReduction }}%</p>
                <p class="text-sm text-success-600">+12% from last month</p>
              </div>
              <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Active Users</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.activeUsers }}</p>
                <p class="text-sm text-primary-600">+8% from last month</p>
              </div>
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon class="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Products Created</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.productsCreated }}</p>
                <p class="text-sm text-warning-600">+15% from last month</p>
              </div>
              <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <CubeIcon class="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Revenue Growth</p>
                <p class="text-2xl font-semibold text-gray-900">₱{{ metrics.revenueGrowth.toLocaleString() }}</p>
                <p class="text-sm text-danger-600">+23% from last month</p>
              </div>
              <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Waste Submission Trends -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Waste Submission Trends</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="wasteSubmissionChart"></canvas>
            </div>
          </div>
        </div>

        <!-- User Registration Trends -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">User Registration Trends</h3>
          </div>
          <div class="card-body">
            <div class="h-64">
              <canvas ref="userRegistrationChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Top Waste Types -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Top Waste Types</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="(waste, index) in topWasteTypes"
                :key="waste.type"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ waste.type }}</p>
                    <p class="text-xs text-gray-500">{{ waste.category }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ waste.count }}</p>
                  <p class="text-xs text-gray-500">submissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Distribution -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">User Distribution</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="role in userDistribution"
                :key="role.type"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div :class="role.color" class="w-3 h-3 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-900">{{ role.type }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ role.count }}</p>
                  <p class="text-xs text-gray-500">{{ role.percentage }}%</p>
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
  ChartBarIcon,
  UserGroupIcon,
  CubeIcon,
  CurrencyDollarIcon
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
const wasteSubmissionChart = ref<HTMLCanvasElement>()
const userRegistrationChart = ref<HTMLCanvasElement>()

// State
const selectedPeriod = ref('30')
const loading = ref(false)

const metrics = ref({
  wasteReduction: 0,
  activeUsers: 0,
  productsCreated: 0,
  revenueGrowth: 0
})

const topWasteTypes = ref<Array<{type: string, category: string, count: number}>>([])
const userDistribution = ref<Array<{type: string, count: number, percentage: string, color: string}>>([])

// Methods
const loadAnalytics = async () => {
  loading.value = true
  try {
    // Load data from stores (localStorage-based)
    await Promise.all([
      usersStore.loadUsers(),
      wasteStore.loadSourceWasteSubmissions(),
      productsStore.loadProducts(),
      productsStore.loadOrders()
    ])
    
    // Get data from stores
    const allUsers = usersStore.users
    const allSubmissions = wasteStore.sourceWasteSubmissions
    const allProducts = productsStore.products
    const allOrders = productsStore.orders
    
    // Calculate metrics
    const totalWaste = allSubmissions.length
    const processedWaste = allSubmissions.filter(s => s.status === 'processed').length
    const wasteReduction = totalWaste > 0 ? ((processedWaste / totalWaste) * 100).toFixed(1) : '0'
    
    // Calculate revenue growth
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total_price, 0)
    const revenueGrowth = totalRevenue > 0 ? (totalRevenue / 100).toFixed(1) : '0'
    
    metrics.value = {
      wasteReduction: parseFloat(wasteReduction),
      activeUsers: allUsers.filter(u => u.is_active).length,
      productsCreated: allProducts.length,
      revenueGrowth: parseFloat(revenueGrowth)
    }
    
    // Calculate waste type distribution
    const wasteTypeCount: Record<string, number> = {}
    allSubmissions.forEach(sub => {
      const category = sub.category?.name || 'other'
      wasteTypeCount[category] = (wasteTypeCount[category] || 0) + 1
    })
    
    topWasteTypes.value = Object.entries(wasteTypeCount)
      .map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        category: type,
        count: count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // Calculate user distribution
    const roleCount: Record<string, number> = {}
    allUsers.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1
    })
    
    userDistribution.value = Object.entries(roleCount).map(([role, count]) => ({
      type: role.charAt(0).toUpperCase() + role.slice(1) + 's',
      count: count,
      percentage: allUsers.length > 0 ? ((count / allUsers.length) * 100).toFixed(1) : '0',
      color: getRoleColor(role)
    }))
  } catch (error: any) {
    console.error('Failed to load analytics:', error)
    toast.error('Failed to load analytics data')
  } finally {
    loading.value = false
  }
}

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-danger-500',
    vendor: 'bg-primary-500',
    user: 'bg-success-500'
  }
  return colors[role as keyof typeof colors] || 'bg-gray-500'
}

const createWasteSubmissionChart = () => {
  if (!wasteSubmissionChart.value) return
  const ctx = wasteSubmissionChart.value.getContext('2d')
  if (!ctx) return

  // Generate last 7 days data
  const last7Days = []
  const submissionData = []
  
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
      return subDate >= dayStart && subDate <= dayEnd
    })
    
    submissionData.push(daySubmissions.length)
  }

  new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Waste Submissions',
        data: submissionData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
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
            text: 'Number of Submissions'
          }
        }
      }
    }
  })
}

const createUserRegistrationChart = () => {
  if (!userRegistrationChart.value) return
  const ctx = userRegistrationChart.value.getContext('2d')
  if (!ctx) return

  // Generate last 7 days data
  const last7Days = []
  const registrationData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    // Count user registrations for this day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    
    const dayRegistrations = usersStore.users.filter(user => {
      const regDate = new Date(user.created_at)
      return regDate >= dayStart && regDate <= dayEnd
    })
    
    registrationData.push(dayRegistrations.length)
  }

  new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'User Registrations',
        data: registrationData,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Registrations'
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await loadAnalytics()
  await nextTick() // Ensure canvas elements are rendered
  createWasteSubmissionChart()
  createUserRegistrationChart()
})
</script>
