<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Source Waste Submissions</h1>
            <p class="text-gray-600 mt-1">Manage your waste submissions by category</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="statusFilter" class="form-input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="collected">Collected</option>
              <option value="processed">Processed</option>
            </select>
            <button
              @click="showAddSubmissionModal = true"
              class="btn-primary"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Submit Waste
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon class="w-5 h-5 text-emerald-600" />
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
                <div class="w-8 h-8 bg-blood-100 rounded-lg flex items-center justify-center">
                  <XMarkIcon class="w-5 h-5 text-blood-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Rejected</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.rejected }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <TruckIcon class="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Collected</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.collected }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-diamond-100 rounded-lg flex items-center justify-center">
                  <CogIcon class="w-5 h-5 text-diamond-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Processed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.processed }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submissions Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">My Submissions</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              <tr v-for="submission in filteredSubmissions" :key="submission.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div 
                        v-if="submission.image_url"
                        class="relative h-10 w-10"
                      >
                        <img
                          :src="submission.image_url"
                          :alt="submission.title"
                          class="h-10 w-10 object-cover rounded transition-opacity duration-200"
                          :class="{ 'opacity-0': imageLoading[submission.id] }"
                          @load="imageLoading[submission.id] = false"
                          @error="handleImageError($event, submission.id)"
                        />
                        <div 
                          v-if="imageLoading[submission.id]"
                          class="absolute inset-0 bg-gray-200 rounded flex items-center justify-center"
                        >
                          <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div 
                          v-if="imageError[submission.id]"
                          class="absolute inset-0 bg-gray-200 rounded flex items-center justify-center"
                        >
                          <div class="w-6 h-6 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div 
                        v-else
                        class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center"
                      >
                        <CubeIcon class="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ submission.title }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ submission.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div 
                      class="w-4 h-4 rounded-full mr-2"
                      :style="{ backgroundColor: submission.category?.color }"
                    ></div>
                    <span class="text-sm text-gray-900">{{ submission.category?.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ submission.quantity }} {{ submission.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge-warning">{{ submission.condition.replace('_', ' ') }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ submission.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(submission.status)">
                    {{ submission.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(submission.submitted_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewSubmission(submission)"
                      class="text-violet-600 hover:text-violet-900"
                    >
                      View
                    </button>
                    <button
                      v-if="submission.status === 'pending'"
                      @click="editSubmission(submission)"
                      class="text-emerald-600 hover:text-emerald-900"
                    >
                      Edit
                    </button>
                    <button
                      v-if="submission.status === 'pending'"
                      @click="deleteSubmission(submission)"
                      class="text-blood-600 hover:text-blood-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredSubmissions.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
        <p class="text-gray-500 mb-4">Submit your first waste to get started</p>
        <button
          @click="showAddSubmissionModal = true"
          class="btn-primary"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Submit Waste
        </button>
      </div>
    </div>

    <!-- Add/Edit Submission Modal -->
    <div
      v-if="showAddSubmissionModal || showEditSubmissionModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showAddSubmissionModal ? 'Submit New Waste' : 'Edit Submission' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveSubmission" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Title -->
              <div class="form-group">
                <label class="form-label">Title</label>
                <input
                  v-model="submissionForm.title"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Overripe Bananas"
                  required
                />
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label">Category</label>
                <select v-model="submissionForm.category_id" class="form-input" required>
                  <option value="">Select category</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="submissionForm.description"
                class="form-input"
                rows="3"
                placeholder="Describe the waste condition and any relevant details"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Quantity -->
              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input
                  v-model.number="submissionForm.quantity"
                  type="number"
                  min="1"
                  class="form-input"
                  required
                />
              </div>

              <!-- Unit -->
              <div class="form-group">
                <label class="form-label">Unit</label>
                <select v-model="submissionForm.unit" class="form-input" required>
                  <option value="kg">Kilograms</option>
                  <option value="pieces">Pieces</option>
                  <option value="baskets">Baskets</option>
                  <option value="bags">Bags</option>
                  <option value="boxes">Boxes</option>
                  <option value="liters">Liters</option>
                </select>
              </div>

              <!-- Condition -->
              <div class="form-group">
                <label class="form-label">Condition</label>
                <select v-model="submissionForm.condition" class="form-input" required>
                  <option value="fresh">Fresh</option>
                  <option value="slightly_damaged">Slightly Damaged</option>
                  <option value="overripe">Overripe</option>
                  <option value="bruised">Bruised</option>
                  <option value="expired">Expired</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Location -->
              <div class="form-group">
                <label class="form-label">Location</label>
                <input
                  v-model="submissionForm.location"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Public Market, Butuan City"
                  required
                />
              </div>

              <!-- Pickup Date -->
              <div class="form-group">
                <label class="form-label">Pickup Date</label>
                <input
                  v-model="submissionForm.pickup_date"
                  type="date"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Estimated Value -->
            <div class="form-group">
              <label class="form-label">Estimated Value (Optional)</label>
              <input
                v-model.number="submissionForm.estimated_value"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
                placeholder="₱0.00"
              />
            </div>

            <!-- Image Upload -->
            <div class="form-group">
              <label class="form-label">Waste Image (Optional)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500">
                      <span>Upload a file</span>
                      <input
                        ref="imageInput"
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        @change="handleImageChange"
                        class="sr-only"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <div v-if="submissionForm.image_preview" class="mt-4">
                <div class="flex items-center justify-center">
                  <img
                    :src="submissionForm.image_preview"
                    alt="Preview"
                    class="h-48 w-48 object-cover rounded-lg border shadow-sm"
                  />
                </div>
                <div class="mt-2 text-center">
                  <button
                    type="button"
                    @click="removeImage"
                    class="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                {{ loading ? 'Saving...' : (showAddSubmissionModal ? 'Submit Waste' : 'Update Submission') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Submission Modal -->
    <div
      v-if="showViewSubmissionModal && selectedSubmission"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Submission Details</h3>
            <button
              @click="closeViewModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Title</label>
                <p class="text-sm text-gray-900">{{ selectedSubmission.title }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Category</label>
                <div class="flex items-center">
                  <div 
                    class="w-4 h-4 rounded-full mr-2"
                    :style="{ backgroundColor: selectedSubmission.category?.color }"
                  ></div>
                  <p class="text-sm text-gray-900">{{ selectedSubmission.category?.name }}</p>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">Description</label>
              <p class="text-sm text-gray-900">{{ selectedSubmission.description }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Quantity</label>
                <p class="text-sm text-gray-900">{{ selectedSubmission.quantity }} {{ selectedSubmission.unit }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Condition</label>
                <p class="text-sm text-gray-900">{{ selectedSubmission.condition.replace('_', ' ') }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <span :class="getStatusBadgeClass(selectedSubmission.status)">
                  {{ selectedSubmission.status }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Location</label>
                <p class="text-sm text-gray-900">{{ selectedSubmission.location }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Pickup Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubmission.pickup_date) }}</p>
              </div>
            </div>

            <div v-if="selectedSubmission.estimated_value">
              <label class="text-sm font-medium text-gray-500">Estimated Value</label>
              <p class="text-sm text-gray-900">₱{{ selectedSubmission.estimated_value.toLocaleString() }}</p>
            </div>

            <div v-if="selectedSubmission.admin_notes">
              <label class="text-sm font-medium text-gray-500">Admin Notes</label>
              <p class="text-sm text-gray-900">{{ selectedSubmission.admin_notes }}</p>
            </div>

            <div v-if="selectedSubmission.rejection_reason">
              <label class="text-sm font-medium text-gray-500">Rejection Reason</label>
              <p class="text-sm text-gray-900">{{ selectedSubmission.rejection_reason }}</p>
            </div>

            <div v-if="selectedSubmission.image_url">
              <label class="text-sm font-medium text-gray-500">Image</label>
              <div class="mt-2 flex justify-center">
                <img
                  :src="selectedSubmission.image_url"
                  :alt="selectedSubmission.title"
                  class="max-h-64 max-w-full object-contain rounded-lg border shadow-sm"
                />
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
import { useAuthStore } from '@/stores/auth'
import {
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  CogIcon,
  TruckIcon,
  DocumentTextIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import type { SourceWasteSubmission, WasteCategory } from '@/types'

const toast = useToast()
const wasteStore = useWasteStore()
const authStore = useAuthStore()

// State
const submissions = ref<SourceWasteSubmission[]>([])
const categories = ref<WasteCategory[]>([])
const loading = ref(false)
const statusFilter = ref('')
const showAddSubmissionModal = ref(false)
const showEditSubmissionModal = ref(false)
const showViewSubmissionModal = ref(false)
const selectedSubmission = ref<SourceWasteSubmission | null>(null)
const editingSubmission = ref<SourceWasteSubmission | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)

// Image loading states
const imageLoading = ref<Record<string, boolean>>({})
const imageError = ref<Record<string, boolean>>({})

const submissionForm = ref({
  title: '',
  category_id: '',
  description: '',
  quantity: 1,
  unit: 'kg' as 'kg' | 'pieces' | 'baskets' | 'bags' | 'boxes' | 'liters',
  condition: 'fresh' as 'fresh' | 'slightly_damaged' | 'overripe' | 'bruised' | 'expired' | 'other',
  location: '',
  pickup_date: '',
  estimated_value: 0,
  image_file: null as File | null,
  image_preview: ''
})

const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  collected: 0,
  processed: 0
})

// Computed
const filteredSubmissions = computed(() => {
  let filtered = submissions.value

  if (statusFilter.value) {
    filtered = filtered.filter(submission => submission.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
})

// Methods
const loadSubmissions = async () => {
  try {
    loading.value = true
    await Promise.all([
      wasteStore.loadSourceWasteSubmissions(),
      wasteStore.loadWasteCategories()
    ])
    const currentUserId = authStore.user?.id
    if (currentUserId) {
      submissions.value = wasteStore.sourceWasteSubmissions.filter((sub: any) => sub.vendor_id === currentUserId)
      
      // Initialize image loading states for all submissions
      submissions.value.forEach((submission: any) => {
        if (submission.image_url) {
          imageLoading.value[submission.id] = true
          imageError.value[submission.id] = false
        }
      })
    }
    categories.value = wasteStore.wasteCategories.filter((cat: any) => cat.is_active)
    calculateStats()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load submissions')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const userSubmissions = submissions.value
  stats.value = {
    pending: userSubmissions.filter(s => s.status === 'pending').length,
    approved: userSubmissions.filter(s => s.status === 'approved').length,
    rejected: userSubmissions.filter(s => s.status === 'rejected').length,
    collected: userSubmissions.filter(s => s.status === 'collected').length,
    processed: userSubmissions.filter(s => s.status === 'processed').length
  }
}

const viewSubmission = (submission: SourceWasteSubmission) => {
  selectedSubmission.value = submission
  showViewSubmissionModal.value = true
}

const editSubmission = (submission: SourceWasteSubmission) => {
  editingSubmission.value = submission
  submissionForm.value = {
    title: submission.title,
    category_id: submission.category_id,
    description: submission.description,
    quantity: submission.quantity,
    unit: submission.unit,
    condition: submission.condition,
    location: submission.location,
    pickup_date: submission.pickup_date.split('T')[0],
    estimated_value: submission.estimated_value || 0,
    image_file: null,
    image_preview: submission.image_url || ''
  }
  showEditSubmissionModal.value = true
}

const deleteSubmission = async (submission: SourceWasteSubmission) => {
  if (confirm(`Are you sure you want to delete "${submission.title}"?`)) {
    try {
      await (wasteStore as any).deleteSourceWasteSubmission(submission.id)
      toast.success('Submission deleted successfully!')
      await loadSubmissions()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete submission')
    }
  }
}

const saveSubmission = async () => {
  try {
    loading.value = true
    
    const formData = {
      ...submissionForm.value,
      vendor_id: authStore.user?.id || '9',
      vendor: authStore.user, // Include full vendor data
      image_file: submissionForm.value.image_file
    }
    
    if (showAddSubmissionModal.value) {
      await (wasteStore as any).createSourceWasteSubmission(formData)
      toast.success('Waste submitted successfully!')
    } else if (showEditSubmissionModal.value && editingSubmission.value) {
      await (wasteStore as any).updateSourceWasteSubmission(editingSubmission.value.id, formData)
      toast.success('Submission updated successfully!')
    }
    
    closeModal()
    await loadSubmissions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save submission')
  } finally {
    loading.value = false
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    
    submissionForm.value.image_file = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      submissionForm.value.image_preview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  submissionForm.value.image_file = null
  submissionForm.value.image_preview = ''
  // Reset the file input
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const handleImageError = (_event: Event, id: string) => {
  imageLoading.value[id] = false
  imageError.value[id] = true
  console.warn(`Failed to load image for submission ${id}`)
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    collected: 'badge-primary',
    processed: 'badge-success'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const closeModal = () => {
  showAddSubmissionModal.value = false
  showEditSubmissionModal.value = false
  editingSubmission.value = null
  submissionForm.value = {
    title: '',
    category_id: '',
    description: '',
    quantity: 1,
    unit: 'kg',
    condition: 'fresh',
    location: '',
    pickup_date: '',
    estimated_value: 0,
    image_file: null,
    image_preview: ''
  }
  // Reset the file input
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const closeViewModal = () => {
  showViewSubmissionModal.value = false
  selectedSubmission.value = null
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

onMounted(async () => {
  authStore.initializeAuth()
  await loadSubmissions()
})
</script>
