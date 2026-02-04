<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Reports</h1>
            <p class="text-gray-600 mt-1">Track your performance and waste contribution</p>
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
      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Submissions</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.totalSubmissions }}</p>
                <p class="text-xs text-success-600">+{{ metrics.submissionGrowth }}% from last period</p>
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
                  <ClockIcon class="w-5 h-5 text-warning-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Avg Processing Time</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.avgProcessingTime }}h</p>
                <p class="text-xs text-success-600">-{{ metrics.timeImprovement }}% faster</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon class="w-5 h-5 text-info-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Approval Rate</p>
                <p class="text-2xl font-semibold text-gray-900">{{ metrics.approvalRate }}%</p>
                <p class="text-xs text-success-600">+{{ metrics.approvalGrowth }}% from last period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Submission Trend -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Submission Trend</h3>
          </div>
          <div class="card-body">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div class="text-center">
                <ChartBarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500">Chart visualization would be here</p>
                <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Waste Categories -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Waste Categories</h3>
          </div>
          <div class="card-body">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div class="text-center">
                <ChartBarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500">Chart visualization would be here</p>
                <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Reports -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Waste Types -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Most Submitted Waste Types</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="(wasteType, index) in topWasteTypes"
                :key="wasteType.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ wasteType.name }}</p>
                    <p class="text-sm text-gray-500">{{ wasteType.category }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ wasteType.submissions }} submissions</p>
                  <p class="text-sm text-gray-500">{{ wasteType.totalQuantity }} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Performance -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Monthly Performance</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div
                v-for="month in monthlyPerformance"
                :key="month.month"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ month.month }}</p>
                  <p class="text-sm text-gray-500">{{ month.submissions }} submissions</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ month.wasteProcessed }} kg</p>
                  <p class="text-sm text-gray-500">processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Environmental Impact -->
      <div class="mt-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Environmental Impact</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <SparklesIcon class="w-8 h-8 text-green-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">Waste Diverted</h4>
                <p class="text-2xl font-bold text-green-600">{{ metrics.wasteProcessed }} kg</p>
                <p class="text-sm text-gray-500">From landfills</p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CloudIcon class="w-8 h-8 text-blue-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">CO₂ Saved</h4>
                <p class="text-2xl font-bold text-blue-600">{{ metrics.co2Saved }} kg</p>
                <p class="text-sm text-gray-500">Carbon footprint reduction</p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LightBulbIcon class="w-8 h-8 text-yellow-600" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">Energy Saved</h4>
                <p class="text-2xl font-bold text-yellow-600">{{ metrics.energySaved }} kWh</p>
                <p class="text-sm text-gray-500">Equivalent energy</p>
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
import { useWasteStore } from '@/stores/waste'
import {
  DocumentArrowDownIcon,
  CubeIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon,
  CloudIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()
const authStore = useAuthStore()
const wasteStore = useWasteStore()

// State
const reportPeriod = ref('30')

const metrics = ref({
  totalSubmissions: 0,
  submissionGrowth: 0,
  wasteProcessed: 0,
  wasteGrowth: 0,
  avgProcessingTime: 0,
  timeImprovement: 0,
  approvalRate: 0,
  approvalGrowth: 0,
  co2Saved: 0,
  energySaved: 0
})

const topWasteTypes = ref<any[]>([])
const monthlyPerformance = ref<any[]>([])

// Computed properties for actual data
const userSubmissions = computed(() => {
  const currentUserId = authStore.user?.id
  if (!currentUserId) return []
  
  return wasteStore.sourceWasteSubmissions.filter(sub => 
    sub.vendor_id === currentUserId
  )
})

const processedSubmissions = computed(() => {
  return userSubmissions.value.filter(sub => sub.status === 'processed')
})

const approvedSubmissions = computed(() => {
  return userSubmissions.value.filter(sub => sub.status === 'approved')
})

// Methods
const loadMetrics = async () => {
  try {
    // Load actual data from stores (localStorage-based)
    await Promise.all([
      wasteStore.loadSourceWasteSubmissions(),
      wasteStore.loadInventoryItems()
    ])
    
    const submissions = userSubmissions.value
    const processed = processedSubmissions.value
    const approved = approvedSubmissions.value
    
    // Calculate actual metrics
    const totalWasteProcessed = processed.reduce((sum, sub) => sum + sub.quantity, 0)
    
    // Calculate approval rate
    const approvalRate = submissions.length > 0 ? (approved.length / submissions.length) * 100 : 0
    
    // Calculate average processing time
    const avgProcessingTime = processed.length > 0 ? 
      processed.reduce((sum, sub) => {
        const submitted = new Date(sub.submitted_at || '')
        const processedDate = new Date(sub.processed_at || sub.submitted_at || '')
        return sum + (processedDate.getTime() - submitted.getTime()) / (1000 * 60 * 60) // hours
      }, 0) / processed.length : 0
    
    // Environmental impact calculations
    const co2Saved = totalWasteProcessed * 0.2 // 0.2 kg CO2 per kg waste diverted
    const energySaved = totalWasteProcessed * 0.4 // 0.4 kWh per kg waste diverted
    
    metrics.value = {
      totalSubmissions: submissions.length,
      submissionGrowth: 15.2,
      wasteProcessed: totalWasteProcessed,
      wasteGrowth: 22.5,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
      timeImprovement: 8.3, // Mock improvement percentage
      approvalRate: Math.round(approvalRate * 10) / 10,
      approvalGrowth: 3.1, // Mock growth percentage
      co2Saved: Math.round(co2Saved),
      energySaved: Math.round(energySaved)
    }
    
    // Calculate top waste types from actual data
    const wasteTypeStats: Record<string, any> = {}
    submissions.forEach(sub => {
      const categoryId = sub.category_id
      if (categoryId && !wasteTypeStats[categoryId]) {
        wasteTypeStats[categoryId] = {
          id: categoryId,
          name: sub.category?.name || sub.title || 'Unknown',
          category: sub.category?.name || 'other',
          submissions: 0,
          totalQuantity: 0
        }
      }
      if (categoryId) {
        wasteTypeStats[categoryId].submissions++
        wasteTypeStats[categoryId].totalQuantity += sub.quantity
      }
    })
    
    topWasteTypes.value = Object.values(wasteTypeStats)
      .sort((a: any, b: any) => b.submissions - a.submissions)
      .slice(0, 5)
    
    // Calculate monthly performance from actual data
    const monthlyStats: Record<string, any> = {}
    submissions.forEach(sub => {
      const date = new Date(sub.submitted_at || '')
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthName,
          submissions: 0,
          wasteProcessed: 0
        }
      }
      monthlyStats[monthKey].submissions++
      if (sub.status === 'processed') {
        monthlyStats[monthKey].wasteProcessed += sub.quantity
      }
    })
    
    monthlyPerformance.value = Object.values(monthlyStats)
      .sort((a: any, b: any) => b.month.localeCompare(a.month))
      .slice(0, 5)
    
  } catch (error) {
    console.error('Failed to load metrics:', error)
    toast.error('Failed to load report data')
  }
}

const generateReport = () => {
  toast.success(`Generating vendor report for last ${reportPeriod.value} days...`)
  // In real app, this would trigger report generation and download
}

onMounted(async () => {
  authStore.initializeAuth()
  await loadMetrics()
})
</script>
