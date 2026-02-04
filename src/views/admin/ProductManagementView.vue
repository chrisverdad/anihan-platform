<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Product Management</h1>
            <p class="text-gray-600 mt-1">Manage repurposed products and inventory</p>
          </div>
          <button
            @click="showProductForm = true"
            class="btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Add New Product
          </button>
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
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Products</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalProducts }}</p>
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
                <p class="text-sm font-medium text-gray-500">Available</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.available }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon class="w-5 h-5 text-warning-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Low Stock</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.lowStock }}</p>
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
                <p class="text-sm font-medium text-gray-500">Total Value</p>
                <p class="text-2xl font-semibold text-gray-900">₱{{ stats.totalValue.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Products ({{ filteredProducts.length }})
            </h3>
            <div class="flex items-center space-x-4">
              <select v-model="categoryFilter" class="form-input">
                <option value="">All Categories</option>
                <option 
                  v-for="category in wasteStore.productCategories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="form-input pl-10"
                />
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          v-if="product.image_url && !imageErrors[product.id]"
                          :src="getImageUrl(product.image_url)"
                          :alt="product.name"
                          class="h-10 w-10 object-cover rounded"
                          @error="handleImageError(product.id)"
                          loading="lazy"
                        />
                        <div v-else class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <CubeIcon class="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge-primary">{{ product.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ product.price.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.stock_quantity }} {{ product.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="product.is_available ? 'badge-success' : 'badge-danger'">
                    {{ product.is_available ? 'Available' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(product.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editProduct(product)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="toggleProductStatus(product)"
                      :class="product.is_available ? 'text-warning-600 hover:text-warning-900' : 'text-success-600 hover:text-success-900'"
                    >
                      {{ product.is_available ? 'Disable' : 'Enable' }}
                    </button>
                    <button
                      @click="deleteProduct(product.id)"
                      class="text-danger-600 hover:text-danger-900"
                    >
                      Delete
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
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of 
              {{ filteredProducts.length }} results
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

    <!-- Product Form Modal -->
    <div
      v-if="showProductForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>
            <button
              @click="closeProductForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveProduct" class="space-y-6">
            <!-- Product Image -->
            <div class="form-group">
              <label class="form-label">Product Image</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        class="sr-only" 
                        accept="image/*"
                        @change="handleImageUpload"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <div v-if="productForm.image_file" class="mt-2">
                <img :src="productForm.image_preview" alt="Preview" class="h-20 w-20 object-cover rounded" />
                <p class="text-sm text-gray-500 mt-1">{{ productForm.image_file.name }}</p>
              </div>
            </div>

            <!-- Product Name -->
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <input
                v-model="productForm.name"
                type="text"
                class="form-input"
                placeholder="Enter product name"
                required
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                class="form-input"
                placeholder="Enter product description"
                required
              ></textarea>
            </div>

            <!-- Category and Price -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select v-model="productForm.category" class="form-input" required>
                  <option value="">Select Category</option>
                  <option 
                    v-for="category in wasteStore.productCategories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Price (₱)</label>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <!-- Stock and Unit -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Stock Quantity</label>
                <input
                  v-model.number="productForm.stock_quantity"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="0"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Unit</label>
                <select v-model="productForm.unit" class="form-input" required>
                  <option value="">Select Unit</option>
                  <option value="kg">Kilograms</option>
                  <option value="pieces">Pieces</option>
                  <option value="bags">Bags</option>
                  <option value="bottles">Bottles</option>
                  <option value="jars">Jars</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>

            <!-- Availability -->
            <div class="form-group">
              <label class="flex items-center">
                <input
                  v-model="productForm.is_available"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Product is available for purchase</span>
              </label>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="closeProductForm"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                {{ editingProduct ? 'Update Product' : 'Add Product' }}
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
import { useProductsStore } from '@/stores/products'
import { useWasteStore } from '@/stores/waste'
import {
  PlusIcon,
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { getImageUrl } from '@/utils/imageUtils'
import type { Product } from '@/types'

const toast = useToast()
const productsStore = useProductsStore()
const wasteStore = useWasteStore()

// State
const searchQuery = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showProductForm = ref(false)
const editingProduct = ref<Product | null>(null)

const productForm = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  image_url: '',
  image_file: null as File | null,
  image_preview: '',
  stock_quantity: 0,
  unit: '',
  is_available: true
})

const stats = ref({
  totalProducts: 0,
  available: 0,
  lowStock: 0,
  totalValue: 0
})

const imageErrors = ref<Record<string, boolean>>({})

// Computed
const filteredProducts = computed(() => {
  let filtered = productsStore.products

  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

// Methods
const loadProducts = async () => {
  try {
    await productsStore.loadProducts()
    await wasteStore.loadProductCategories()
    calculateStats()
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const calculateStats = () => {
  const products = productsStore.products
  stats.value = {
    totalProducts: products.length,
    available: products.filter(p => p.is_available).length,
    lowStock: products.filter(p => p.stock_quantity < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  }
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image_url: product.image_url || '',
    image_file: null,
    image_preview: product.image_url || '',
    stock_quantity: product.stock_quantity,
    unit: product.unit,
    is_available: product.is_available
  }
  showProductForm.value = true
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    productForm.value.image_file = file
    productForm.value.image_preview = URL.createObjectURL(file)
    productForm.value.image_url = URL.createObjectURL(file) // Use object URL for now
  }
}

const saveProduct = async () => {
  try {
    const productData = {
      name: productForm.value.name,
      description: productForm.value.description,
      price: productForm.value.price,
      category: productForm.value.category as 'compost' | 'fertilizer' | 'preserved_food' | 'processed_food' | 'other',
      image_url: productForm.value.image_url, // Will be updated by backend if file is uploaded
      stock_quantity: productForm.value.stock_quantity,
      unit: productForm.value.unit as 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes',
      is_available: productForm.value.is_available
    }

    // Only include image_url if no file is being uploaded
    if (!productForm.value.image_file) {
      // Keep existing image_url if no new file
      if (!productForm.value.image_url || productForm.value.image_url.startsWith('blob:')) {
        productData.image_url = editingProduct.value?.image_url || ''
      }
    }

    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productData, productForm.value.image_file || undefined)
      toast.success('Product updated successfully')
    } else {
      await productsStore.addProduct(productData, productForm.value.image_file || undefined)
      toast.success('Product added successfully')
    }
    
    closeProductForm()
    loadProducts()
  } catch (error) {
    toast.error('Failed to save product')
  }
}

const toggleProductStatus = async (product: Product) => {
  try {
    await productsStore.updateProduct(product.id, { is_available: !product.is_available })
    toast.success(`Product ${product.is_available ? 'disabled' : 'enabled'} successfully`)
    loadProducts()
  } catch (error) {
    toast.error('Failed to update product status')
  }
}

const deleteProduct = async (productId: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(productId)
      toast.success('Product deleted successfully')
      loadProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    image_file: null,
    image_preview: '',
    stock_quantity: 0,
    unit: '',
    is_available: true
  }
}

const handleImageError = (productId: string) => {
  imageErrors.value[productId] = true
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadProducts()
})
</script>
