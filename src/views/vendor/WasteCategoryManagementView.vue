<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Waste Category Management</h1>
            <p class="text-gray-600 mt-1">Manage waste categories for submissions</p>
          </div>
          <button
            @click="showAddCategoryModal = true"
            class="btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: category.color + '20', color: category.color }"
                >
                  <component :is="getIconComponent(category.icon)" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.description }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="category.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ category.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                Created: {{ formatDate(category.created_at) }}
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editCategory(category)"
                  class="text-violet-600 hover:text-violet-900 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  @click="deleteCategory(category)"
                  class="text-blood-600 hover:text-blood-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CubeIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
        <p class="text-gray-500 mb-4">Create your first waste category to get started</p>
        <button
          @click="showAddCategoryModal = true"
          class="btn-primary"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div
      v-if="showAddCategoryModal || showEditCategoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showAddCategoryModal ? 'Add New Category' : 'Edit Category' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveCategory" class="space-y-4">
            <!-- Category Name -->
            <div class="form-group">
              <label class="form-label">Category Name</label>
              <input
                v-model="categoryForm.name"
                type="text"
                class="form-input"
                placeholder="e.g., Fruits, Vegetables, Grains"
                required
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="categoryForm.description"
                class="form-input"
                rows="3"
                placeholder="Describe this waste category"
                required
              ></textarea>
            </div>

            <!-- Color -->
            <div class="form-group">
              <label class="form-label">Color</label>
              <div class="flex items-center space-x-4">
                <input
                  v-model="categoryForm.color"
                  type="color"
                  class="w-12 h-12 rounded border border-gray-300"
                />
                <span class="text-sm text-gray-500">{{ categoryForm.color }}</span>
              </div>
            </div>

            <!-- Icon -->
            <div class="form-group">
              <label class="form-label">Icon</label>
              <select v-model="categoryForm.icon" class="form-input" required>
                <option value="">Select an icon</option>
                <option value="CubeIcon">Cube</option>
                <option value="SunIcon">Sun</option>
                <option value="HeartIcon">Heart</option>
                <option value="StarIcon">Star</option>
                <option value="FireIcon">Fire</option>
                <option value="BoltIcon">Bolt</option>
                <option value="SparklesIcon">Sparkles</option>
              </select>
            </div>

            <!-- Active Status -->
            <div class="form-group">
              <label class="flex items-center">
                <input
                  v-model="categoryForm.is_active"
                  type="checkbox"
                  class="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span class="ml-2 text-sm text-gray-700">Active</span>
              </label>
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
                {{ loading ? 'Saving...' : (showAddCategoryModal ? 'Add Category' : 'Update Category') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useWasteStore } from '@/stores/waste'
import {
  PlusIcon,
  XMarkIcon,
  CubeIcon,
  SunIcon,
  HeartIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import type { WasteCategory } from '@/types'

const toast = useToast()
const wasteStore = useWasteStore()

// State
const categories = ref<WasteCategory[]>([])
const loading = ref(false)
const showAddCategoryModal = ref(false)
const showEditCategoryModal = ref(false)
const editingCategory = ref<WasteCategory | null>(null)

const categoryForm = ref({
  name: '',
  description: '',
  color: '#10b981',
  icon: 'CubeIcon',
  is_active: true
})

// Methods
const loadCategories = async () => {
  try {
    loading.value = true
    await wasteStore.loadWasteCategories()
    categories.value = wasteStore.wasteCategories
  } catch (error: any) {
    toast.error(error.message || 'Failed to load categories')
  } finally {
    loading.value = false
  }
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    CubeIcon,
    SunIcon,
    HeartIcon,
    StarIcon,
    FireIcon,
    BoltIcon,
    SparklesIcon
  }
  return icons[iconName] || CubeIcon
}

const editCategory = (category: WasteCategory) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description,
    color: category.color,
    icon: category.icon,
    is_active: category.is_active
  }
  showEditCategoryModal.value = true
}

const deleteCategory = async (category: WasteCategory) => {
  if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
    try {
      await wasteStore.deleteWasteCategory(category.id)
      toast.success('Category deleted successfully!')
      await loadCategories()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category')
    }
  }
}

const saveCategory = async () => {
  try {
    loading.value = true
    
    if (showAddCategoryModal.value) {
      await wasteStore.createWasteCategory(categoryForm.value)
      toast.success('Category created successfully!')
    } else if (showEditCategoryModal.value && editingCategory.value) {
      await wasteStore.updateWasteCategory(editingCategory.value.id, categoryForm.value)
      toast.success('Category updated successfully!')
    }
    
    closeModal()
    await loadCategories()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save category')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddCategoryModal.value = false
  showEditCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: '',
    color: '#10b981',
    icon: 'CubeIcon',
    is_active: true
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadCategories()
})
</script>
