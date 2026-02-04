<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <p class="text-gray-600 mt-1">Browse repurposed products from agricultural waste</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="categoryFilter" class="form-input">
              <option value="">All Categories</option>
              <option v-for="category in wasteStore.wasteCategories" :key="category.id" :value="category.name">
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
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Products -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="card hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewProduct(product)"
          >
            <div class="relative">
              <div class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  v-if="product.image_url && !imageErrors[product.id]"
                  :src="getImageUrl(product.image_url)"
                  :alt="product.name"
                  class="w-full h-48 object-cover"
                  @error="handleImageError(product.id)"
                  loading="lazy"
                />
                <div v-else class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div class="absolute top-2 right-2">
                <span class="badge-success">Featured</span>
              </div>
            </div>
            <div class="card-body">
              <h3 class="font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-primary-600">₱{{ product.price }}</span>
                <span class="text-sm text-gray-500">{{ product.stock_quantity }} {{ product.unit }} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Products -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">
            All Products ({{ filteredProducts.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-md',
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <Squares2X2Icon class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-md',
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <ListBulletIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="card hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewProduct(product)"
          >
            <div class="relative">
              <div class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  v-if="product.image_url && !imageErrors[product.id]"
                  :src="getImageUrl(product.image_url)"
                  :alt="product.name"
                  class="w-full h-48 object-cover"
                  @error="handleImageError(product.id)"
                  loading="lazy"
                />
                <div v-else class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div v-if="!product.is_available" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span class="badge-danger">Out of Stock</span>
              </div>
            </div>
            <div class="card-body">
              <h3 class="font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-primary-600">₱{{ product.price }}</span>
                <span class="text-sm text-gray-500">{{ product.stock_quantity }} {{ product.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="card hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewProduct(product)"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    v-if="product.image_url && !imageErrors[product.id]"
                    :src="product.image_url"
                    :alt="product.name"
                    class="w-32 h-32 object-cover"
                    @error="handleImageError(product.id)"
                    loading="lazy"
                  />
                  <div v-else class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <CubeIcon class="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              </div>
              <div class="card-body flex-1">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
                    <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
                    <div class="flex items-center space-x-4">
                      <span class="text-lg font-bold text-primary-600">₱{{ product.price }}</span>
                      <span class="text-sm text-gray-500">{{ product.stock_quantity }} {{ product.unit }} available</span>
                      <span class="badge-primary">{{ product.category }}</span>
                    </div>
                  </div>
                  <div v-if="!product.is_available" class="ml-4">
                    <span class="badge-danger">Out of Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 px-4">
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

    <!-- Product Details Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Product Details</h3>
            <button
              @click="selectedProduct = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Product Image -->
            <div class="text-center">
              <div class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  v-if="selectedProduct.image_url && !imageErrors[selectedProduct.id]"
                  :src="selectedProduct.image_url"
                  :alt="selectedProduct.name"
                  class="w-full h-64 object-cover"
                  @error="handleImageError(selectedProduct.id)"
                />
                <div v-else class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CubeIcon class="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="space-y-4">
              <div>
                <h4 class="text-xl font-semibold text-gray-900">{{ selectedProduct.name }}</h4>
                <p class="text-gray-600 mt-2">{{ selectedProduct.description }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Price</label>
                  <p class="text-lg font-bold text-primary-600">₱{{ selectedProduct.price }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Category</label>
                  <p class="text-sm text-gray-900">{{ selectedProduct.category }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Stock</label>
                  <p class="text-sm text-gray-900">{{ selectedProduct.stock_quantity }} {{ selectedProduct.unit }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Availability</label>
                  <span :class="selectedProduct.is_available ? 'badge-success' : 'badge-danger'">
                    {{ selectedProduct.is_available ? 'Available' : 'Out of Stock' }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Order Form -->
            <div v-if="selectedProduct.is_available" class="border-t pt-6">
              <h4 class="font-medium text-gray-900 mb-4">Place Order</h4>
              <form @submit.prevent="placeOrder" class="space-y-4">
                <div class="form-group">
                  <label class="form-label">Quantity</label>
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      @click="orderQuantity = Math.max(1, orderQuantity - 1)"
                      class="btn-outline w-10 h-10 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      v-model.number="orderQuantity"
                      type="number"
                      min="1"
                      :max="selectedProduct.stock_quantity"
                      class="form-input text-center w-20"
                    />
                    <button
                      type="button"
                      @click="orderQuantity = Math.min(selectedProduct.stock_quantity, orderQuantity + 1)"
                      class="btn-outline w-10 h-10 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    Maximum: {{ selectedProduct.stock_quantity }} {{ selectedProduct.unit }}
                  </p>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Total Amount</label>
                  <p class="text-lg font-bold text-primary-600">
                    ₱{{ (selectedProduct.price * orderQuantity).toLocaleString() }}
                  </p>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Payment Method</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="paymentMethod"
                        type="radio"
                        value="cash"
                        class="mr-2"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="paymentMethod"
                        type="radio"
                        value="gcash"
                        class="mr-2"
                      />
                      <span>GCash</span>
                    </label>
                  </div>
                </div>
                
                <div v-if="paymentMethod === 'gcash'" class="form-group">
                  <label class="form-label">GCash Number</label>
                  <input
                    v-model="paymentReference"
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    class="form-input"
                    pattern="09[0-9]{9}"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Delivery Address</label>
                  <textarea
                    v-model="deliveryAddress"
                    rows="3"
                    placeholder="Enter your complete delivery address"
                    class="form-input"
                    required
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Delivery Notes (Optional)</label>
                  <textarea
                    v-model="deliveryNotes"
                    rows="2"
                    placeholder="Any special instructions for delivery"
                    class="form-input"
                  ></textarea>
                </div>
                
                <div class="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    @click="selectedProduct = null"
                    class="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-primary"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useWasteStore } from '@/stores/waste'
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import { getImageUrl } from '@/utils/imageUtils'
import type { Product } from '@/types'

const toast = useToast()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const wasteStore = useWasteStore()

// State
const products = ref<Product[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const selectedProduct = ref<Product | null>(null)
const orderQuantity = ref(1)
const paymentMethod = ref<'cash' | 'gcash'>('cash')
const paymentReference = ref('')
const deliveryAddress = ref('')
const deliveryNotes = ref('')
const imageErrors = ref<Record<string, boolean>>({})

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  return filtered
})

const featuredProducts = computed(() => {
  return filteredProducts.value.slice(0, 3)
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
    await Promise.all([
      productsStore.loadProducts(),
      wasteStore.loadWasteCategories()
    ])
    products.value = productsStore.products
  } catch (error) {
    console.error('Failed to load products:', error)
    // Fallback to mock data if needed
    products.value = [
      {
        id: '1',
        name: 'Organic Banana Compost',
        description: 'Rich compost made from overripe bananas, perfect for organic gardening',
        price: 150,
        category: 'compost',
        image_url: '/images/banana-compost.jpg',
        stock_quantity: 25,
        unit: 'kg',
        is_available: true,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Tomato Fertilizer',
        description: 'Natural fertilizer derived from bruised tomatoes, rich in nutrients',
        price: 200,
        category: 'fertilizer',
        image_url: '/images/tomato-fertilizer.jpg',
        stock_quantity: 15,
        unit: 'bags',
        is_available: true,
        created_at: '2024-02-10T00:00:00Z',
        updated_at: '2024-02-10T00:00:00Z'
      },
      {
        id: '3',
        name: 'Mango Jam',
        description: 'Delicious jam made from damaged mangoes, sweet and natural',
        price: 80,
        category: 'preserved_food',
        image_url: '/images/mango-jam.jpg',
        stock_quantity: 30,
        unit: 'bottles',
        is_available: true,
        created_at: '2024-03-05T00:00:00Z',
        updated_at: '2024-03-05T00:00:00Z'
      },
      {
        id: '4',
        name: 'Vegetable Compost',
        description: 'Mixed vegetable compost from various damaged produce',
        price: 120,
        category: 'compost',
        image_url: '/images/vegetable-compost.jpg',
        stock_quantity: 20,
        unit: 'kg',
        is_available: true,
        created_at: '2024-04-01T00:00:00Z',
        updated_at: '2024-04-01T00:00:00Z'
      },
      {
        id: '5',
        name: 'Fruit Fertilizer',
        description: 'Nutrient-rich fertilizer made from fruit waste',
        price: 180,
        category: 'fertilizer',
        image_url: '/images/fruit-fertilizer.jpg',
        stock_quantity: 12,
        unit: 'bags',
        is_available: true,
        created_at: '2024-05-15T00:00:00Z',
        updated_at: '2024-05-15T00:00:00Z'
      },
      {
        id: '6',
        name: 'Apple Preserves',
        description: 'Sweet preserves made from bruised apples',
        price: 90,
        category: 'preserved_food',
        image_url: '/images/apple-preserves.jpg',
        stock_quantity: 0,
        unit: 'jars',
        is_available: false,
        created_at: '2024-06-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z'
      }
    ]
  }
}

const viewProduct = (product: Product) => {
  selectedProduct.value = product
  orderQuantity.value = 1
}

const placeOrder = async () => {
  try {
    if (!selectedProduct.value) return
    
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      toast.error('Please log in to place an order')
      return
    }
    
    // Debug: Check if user is authenticated
    console.log('Current user:', authStore.user)
    console.log('User ID:', authStore.user?.id)
    
    // Create order data
    const orderData = {
      user_id: authStore.user?.id || '3', // Use current user ID or fallback
      product_id: selectedProduct.value.id,
      quantity: orderQuantity.value,
      total_price: selectedProduct.value.price * orderQuantity.value,
      payment_status: 'pending' as const,
      payment_method: paymentMethod.value,
      payment_reference: paymentReference.value,
      delivery_status: 'pending' as const,
      delivery_address: deliveryAddress.value,
      delivery_notes: deliveryNotes.value,
      notes: deliveryNotes.value
    }
    
    console.log('Order data:', orderData)
    
    // Place order using products store
    const newOrder = await productsStore.placeOrder(orderData)
    
    console.log('Order created:', newOrder)
    
    toast.success(`Order placed successfully! ${orderQuantity.value} ${selectedProduct.value.unit} of ${selectedProduct.value.name}`)
    selectedProduct.value = null
    resetOrderForm()
  } catch (error: any) {
    console.error('Order placement error:', error)
    toast.error(error.message || 'Failed to place order')
  }
}

const resetOrderForm = () => {
  orderQuantity.value = 1
  paymentMethod.value = 'cash'
  paymentReference.value = ''
  deliveryAddress.value = ''
  deliveryNotes.value = ''
}

const handleImageError = (productId: string) => {
  imageErrors.value[productId] = true
}

const resetImageErrors = () => {
  imageErrors.value = {}
}

// Watch for changes in products to reset image errors
watch(products, () => {
  resetImageErrors()
}, { deep: true })

onMounted(() => {
  loadProducts()
})
</script>
