<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Product Category Management</h1>
            <p class="text-gray-600 mt-1">Manage product categories for inventory</p>
          </div>
          <button
            @click="showCategoryForm = true"
            class="btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Add New Category
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TagIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Categories</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCategories }}</p>
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
                <p class="text-sm font-medium text-gray-500">Active</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.activeCategories }}</p>
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
                <p class="text-sm font-medium text-gray-500">Products Using</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.productsUsing }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in productCategories"
          :key="category.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-100">
                  <TagIcon class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.description }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editCategory(category)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-danger-600 hover:text-danger-900"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="badge-success">Active</span>
              <span class="text-xs text-gray-500">
                {{ getCategoryUsage(category.id) }} products
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Form Modal -->
    <div
      v-if="showCategoryForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
            </h3>
            <button
              @click="closeCategoryForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveCategory" class="space-y-6">
            <!-- Category Name -->
            <div class="form-group">
              <label class="form-label">Category Name</label>
              <input
                v-model="categoryForm.name"
                type="text"
                class="form-input"
                placeholder="Enter category name"
                required
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="form-input"
                placeholder="Enter category description"
                required
              ></textarea>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="closeCategoryForm"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                {{ editingCategory ? 'Update Category' : 'Add Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useWasteStore } from '@/stores/waste'
import { useProductsStore } from '@/stores/products'
import {
  PlusIcon,
  TagIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()
const wasteStore = useWasteStore()
const productsStore = useProductsStore()

// State
const showCategoryForm = ref(false)
const editingCategory = ref<{id: string, name: string, description: string} | null>(null)

const categoryForm = ref({
  name: '',
  description: ''
})

const stats = ref({
  totalCategories: 0,
  activeCategories: 0,
  productsUsing: 0
})

// Computed
const productCategories = computed(() => wasteStore.productCategories)

// Methods
const loadCategories = async () => {
  try {
    await wasteStore.loadProductCategories()
    await productsStore.loadProducts()
    calculateStats()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const calculateStats = () => {
  const categoryList = productCategories.value
  const products = productsStore.products
  stats.value = {
    totalCategories: categoryList.length,
    activeCategories: categoryList.length, // All product categories are active
    productsUsing: products.length
  }
}

const editCategory = (category: {id: string, name: string, description: string}) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description
  }
  showCategoryForm.value = true
}

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await wasteStore.updateProductCategory(editingCategory.value.id, categoryForm.value)
      toast.success('Category updated successfully')
    } else {
      await wasteStore.createProductCategory(categoryForm.value)
      toast.success('Category created successfully')
    }
    
    closeCategoryForm()
    loadCategories()
  } catch (error) {
    toast.error('Failed to save category')
  }
}

const deleteCategory = async (categoryId: string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await wasteStore.deleteProductCategory(categoryId)
      toast.success('Category deleted successfully')
      loadCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }
}

const getCategoryUsage = (categoryId: string) => {
  return productsStore.products.filter(product => product.category === categoryId).length
}

const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: ''
  }
}

onMounted(() => {
  loadCategories()
})
</script>
