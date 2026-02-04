<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Waste Management</h1>
            <p class="text-gray-600 mt-1">Manage waste submissions and processing</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="statusFilter" class="form-input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processed">Processed</option>
              <option value="rejected">Rejected</option>
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
                  <CheckCircleIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Approved</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.approved }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <CogIcon class="w-5 h-5 text-success-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Processed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.processed }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <XMarkIcon class="w-5 h-5 text-danger-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Rejected</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.rejected }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Waste Submissions Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">
            Waste Submissions ({{ filteredSubmissions.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="submission in paginatedSubmissions" :key="submission.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          v-if="submission.image_url"
                          :src="submission.image_url"
                          :alt="submission.title"
                          class="h-10 w-10 object-cover rounded-lg"
                          @error="handleImageError(submission.id)"
                        />
                        <div v-else class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <CubeIcon class="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ submission.title || 'Waste Submission' }}</div>
                      <div class="text-sm text-gray-500">{{ submission.category?.name || submission.description || 'No description' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ submission.vendor?.full_name || 'Unknown Vendor' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ submission.vendor?.email || 'Unknown Email' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ submission.quantity }} {{ submission.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(submission.status)">
                    {{ submission.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(submission.submitted_at || '') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="submission.status === 'pending'"
                      @click="updateStatus(submission.id, 'approved')"
                      class="text-success-600 hover:text-success-900"
                    >
                      Approve
                    </button>
                    <button
                      v-if="submission.status === 'approved'"
                      @click="updateStatus(submission.id, 'processed')"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Process
                    </button>
                    <button
                      v-if="submission.status === 'pending'"
                      @click="updateStatus(submission.id, 'rejected')"
                      class="text-danger-600 hover:text-danger-900"
                    >
                      Reject
                    </button>
                    <button
                      @click="viewSubmission(submission)"
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
              {{ Math.min(currentPage * itemsPerPage, filteredSubmissions.length) }} of 
              {{ filteredSubmissions.length }} results
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

    <!-- Submission Details Modal -->
    <div
      v-if="selectedSubmission"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Submission Details</h3>
            <button
              @click="selectedSubmission = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Submission Info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Submission ID</label>
                <p class="text-sm text-gray-900">#{{ selectedSubmission.id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <span :class="getStatusBadgeClass(selectedSubmission.status)">
                  {{ selectedSubmission.status }}
                </span>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Submitted</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubmission.submitted_at || '') }}</p>
              </div>
              <div v-if="selectedSubmission.processed_at">
                <label class="text-sm font-medium text-gray-500">Processed</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubmission.processed_at) }}</p>
              </div>
            </div>
            
            <!-- Waste Information -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">Waste Information</h4>
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    v-if="selectedSubmission.image_url"
                    :src="selectedSubmission.image_url"
                    :alt="selectedSubmission.title"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <CubeIcon v-else class="w-8 h-8 text-gray-400" />
                </div>
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900">{{ selectedSubmission.title }}</h5>
                  <p class="text-sm text-gray-500">{{ selectedSubmission.description }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="text-sm text-gray-500">Category: {{ selectedSubmission.category?.name || 'Unknown' }}</span>
                    <span class="text-sm text-gray-500">Condition: {{ selectedSubmission.condition }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quantity and Description -->
            <div class="border-t pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Quantity</label>
                  <p class="text-sm text-gray-900">{{ selectedSubmission.quantity }} {{ selectedSubmission.unit }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Vendor</label>
                  <p class="text-sm text-gray-900">{{ selectedSubmission.vendor?.full_name || 'Unknown Vendor' }}</p>
                </div>
              </div>
              <div v-if="selectedSubmission.description" class="mt-4">
                <label class="text-sm font-medium text-gray-500">Description</label>
                <p class="text-sm text-gray-900">{{ selectedSubmission.description }}</p>
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
import { useWasteStore } from '@/stores/waste'
import {
  ClockIcon,
  CheckCircleIcon,
  CogIcon,
  XMarkIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import type { SourceWasteSubmission } from '@/types'

const toast = useToast()
const wasteStore = useWasteStore()

// State
const submissions = ref<SourceWasteSubmission[]>([])
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedSubmission = ref<SourceWasteSubmission | null>(null)

const stats = ref({
  pending: 0,
  approved: 0,
  processed: 0,
  rejected: 0
})

// Remove unused imageErrors

// Computed
const filteredSubmissions = computed(() => {
  let filtered = submissions.value

  if (statusFilter.value) {
    filtered = filtered.filter(submission => submission.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.submitted_at || '').getTime() - new Date(a.submitted_at || '').getTime())
})

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSubmissions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSubmissions.value.length / itemsPerPage.value)
})

// Methods
const loadSubmissions = async () => {
  try {
    // Load source waste submissions instead of old submissions
    await wasteStore.loadSourceWasteSubmissions()
    submissions.value = wasteStore.sourceWasteSubmissions
  } catch (error: any) {
    console.error('Error loading submissions:', error)
    toast.error(error.message || 'Failed to load waste submissions')
  }
}

const loadStats = async () => {
  try {
    // Load source waste submissions instead of old submissions
    await wasteStore.loadSourceWasteSubmissions()
    
    // Calculate stats from source waste submissions
    const allSubmissions = wasteStore.sourceWasteSubmissions
    stats.value = {
      pending: allSubmissions.filter((s: SourceWasteSubmission) => s.status === 'pending').length,
      approved: allSubmissions.filter((s: SourceWasteSubmission) => s.status === 'approved').length,
      processed: allSubmissions.filter((s: SourceWasteSubmission) => s.status === 'processed').length,
      rejected: allSubmissions.filter((s: SourceWasteSubmission) => s.status === 'rejected').length
    }
  } catch (error: any) {
    console.error('Failed to load stats:', error)
  }
}

const updateStatus = async (id: string, status: string) => {
  try {
    // Update using source waste submission store
    await wasteStore.updateSourceWasteSubmission(id, { status: status as any })
    
    // Update the submission in the list
    const index = submissions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      submissions.value[index].status = status as any
      if (status === 'processed') {
        submissions.value[index].processed_at = new Date().toISOString()
      }
    }
    
    toast.success(`Waste submission ${status} successfully`)
    await loadStats() // Reload stats
  } catch (error: any) {
    toast.error(error.message || 'Failed to update status')
  }
}

const viewSubmission = (submission: SourceWasteSubmission) => {
  selectedSubmission.value = submission
}

const handleImageError = (submissionId: string) => {
  // Handle image loading errors
  console.log(`Image failed to load for submission ${submissionId}`)
}

// Remove unused function

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    approved: 'badge-primary',
    processed: 'badge-success',
    rejected: 'badge-danger'
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
  loadSubmissions()
  loadStats()
})
</script>
