<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Inventory</h1>
            <p class="text-gray-600 mt-1">Track your waste submissions and their processing status</p>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="showAddToInventoryModal = true" class="btn-secondary">
              <PlusIcon class="w-5 h-5 mr-2" />
              Add to Inventory
            </button>
            <router-link to="/vendor/source-submissions" class="btn-primary">
              <PlusIcon class="w-5 h-5 mr-2" />
              Submit New Waste
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Inventory Items Section -->
      <div class="card mb-8">
        <div class="card-header">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                My Inventory Items ({{ inventoryItems.length }})
              </h3>
              <div class="flex items-center space-x-4">
                <button
                  @click="refreshInventory"
                  class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </button>
                <select v-model="inventoryCategoryFilter" class="form-input">
                <option value="">All Categories</option>
                <option 
                  v-for="category in productCategories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
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
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Unit
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredInventoryItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="relative h-10 w-10">
                        <img
                          :src="item.image_url || '/placeholder-image.svg'"
                          :alt="item.product_name"
                          class="h-10 w-10 object-cover rounded transition-opacity duration-200"
                          :class="{ 'opacity-0': imageLoading[item.id] }"
                          @load="imageLoading[item.id] = false"
                          @error="handleImageError($event, item.id)"
                        />
                        <div 
                          v-if="imageLoading[item.id]"
                          class="absolute inset-0 bg-gray-200 rounded flex items-center justify-center"
                        >
                          <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div 
                          v-if="imageError[item.id]"
                          class="absolute inset-0 bg-gray-200 rounded flex items-center justify-center"
                        >
                          <div class="w-6 h-6 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.product_name }}</div>
                      <div class="text-sm text-gray-500">{{ item.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge-primary">{{ item.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.quantity }} {{ item.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ item.price_per_unit.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ item.total_value.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="item.is_available ? 'badge-success' : 'badge-warning'">
                    {{ item.is_available ? 'Available' : 'Unavailable' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="adjustQuantity(item)"
                      class="text-emerald-600 hover:text-emerald-900"
                    >
                      Adjust Qty
                    </button>
                    <button
                      @click="viewQuantityHistory(item)"
                      class="text-violet-600 hover:text-violet-900"
                    >
                      History
                    </button>
                    <button
                      @click="editInventoryItem(item)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteInventoryItem(item)"
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
      </div>
    </div>

    <!-- Add to Inventory Modal -->
    <div
      v-if="showAddToInventoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Add Item to Inventory</h3>
            <button
              @click="closeAddToInventoryModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="handleAddToInventory" class="space-y-4">
            <!-- Product Name -->
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <input
                v-model="inventoryForm.product_name"
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
                v-model="inventoryForm.description"
                class="form-input"
                rows="3"
                placeholder="Describe the processed product"
                required
              ></textarea>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <select v-model="inventoryForm.category" class="form-input" required>
                <option value="">Select category</option>
                <option 
                  v-for="category in productCategories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Quantity and Unit -->
            <div class="form-group">
              <label class="form-label">Quantity</label>
              <div class="flex space-x-2">
                <input
                  v-model.number="inventoryForm.quantity"
                  type="number"
                  min="1"
                  class="form-input flex-1"
                  placeholder="Enter quantity"
                  required
                />
                <select v-model="inventoryForm.unit" class="form-input w-32">
                  <option value="kg">kg</option>
                  <option value="bags">bags</option>
                  <option value="bottles">bottles</option>
                  <option value="pieces">pieces</option>
                  <option value="jars">jars</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>

            <!-- Price per Unit -->
            <div class="form-group">
              <label class="form-label">Price per Unit (₱)</label>
              <input
                v-model.number="inventoryForm.price_per_unit"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
                placeholder="Enter price per unit"
                required
              />
            </div>

            <!-- Product Image Upload -->
            <div class="form-group">
              <label class="form-label">Product Image (Optional)</label>
              <div class="mt-1 flex items-center space-x-4">
                <div v-if="inventoryForm.image_preview" class="flex-shrink-0">
                  <img
                    :src="inventoryForm.image_preview"
                    alt="Product preview"
                    class="h-20 w-20 rounded-lg object-cover border-2 border-gray-300"
                  />
                </div>
                <div v-else class="flex-shrink-0">
                  <div class="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="() => imageInput?.click()"
                    class="btn-outline text-sm"
                  >
                    {{ inventoryForm.image_preview ? 'Change Image' : 'Upload Image' }}
                  </button>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div class="form-group">
              <label class="form-label">Availability</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="inventoryForm.is_available"
                    type="radio"
                    :value="true"
                    class="mr-2"
                  />
                  Available
                </label>
                <label class="flex items-center">
                  <input
                    v-model="inventoryForm.is_available"
                    type="radio"
                    :value="false"
                    class="mr-2"
                  />
                  Unavailable
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeAddToInventoryModal"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="wasteStore.loading"
                class="btn-primary"
              >
                {{ wasteStore.loading ? 'Adding...' : 'Add to Inventory' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Inventory Modal -->
    <div
      v-if="showEditInventoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Edit Inventory Item</h3>
            <button
              @click="closeEditInventoryModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleEditInventory" class="space-y-4">
            <!-- Product Name -->
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <input
                v-model="editForm.product_name"
                type="text"
                class="form-input"
                required
              />
            </div>
            
            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="editForm.description"
                class="form-input"
                rows="3"
                required
              ></textarea>
            </div>
            
            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <select v-model="editForm.category" class="form-input" required>
                <option value="">Select Category</option>
                <option 
                  v-for="category in productCategories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- Quantity and Unit -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input
                  v-model.number="editForm.quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Unit</label>
                <select v-model="editForm.unit" class="form-input" required>
                  <option value="kg">kg</option>
                  <option value="bags">bags</option>
                  <option value="bottles">bottles</option>
                  <option value="pieces">pieces</option>
                  <option value="jars">jars</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>
            
            <!-- Price per Unit -->
            <div class="form-group">
              <label class="form-label">Price per Unit (₱)</label>
              <input
                v-model.number="editForm.price_per_unit"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
                required
              />
            </div>
            
            <!-- Image Upload -->
            <div class="form-group">
              <label class="form-label">Product Image</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <div v-if="editForm.image_preview" class="mb-4">
                    <img
                      :src="editForm.image_preview"
                      alt="Preview"
                      class="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                  <svg
                    v-else
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="edit-image-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="edit-image-upload"
                        ref="imageInput"
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        @change="handleImageChange"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <!-- Availability -->
            <div class="form-group">
              <label class="flex items-center">
                <input
                  v-model="editForm.is_available"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Available for sale</span>
              </label>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeEditInventoryModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


    <!-- Quantity Adjustment Modal -->
    <div
      v-if="showQuantityAdjustmentModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Adjust Quantity</h3>
            <button
              @click="closeQuantityAdjustmentModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900">{{ selectedInventoryItem?.product_name }}</h4>
            <p class="text-sm text-gray-600">Current Quantity: {{ selectedInventoryItem?.quantity }} {{ selectedInventoryItem?.unit }}</p>
          </div>
          
          <form @submit.prevent="handleQuantityAdjustment" class="space-y-4">
            <!-- Adjustment Type -->
            <div class="form-group">
              <label class="form-label">Adjustment Type</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="quantityForm.adjustment_type"
                    type="radio"
                    value="add"
                    class="mr-2"
                  />
                  Add Quantity
                </label>
                <label class="flex items-center">
                  <input
                    v-model="quantityForm.adjustment_type"
                    type="radio"
                    value="subtract"
                    class="mr-2"
                  />
                  Subtract Quantity
                </label>
                <label class="flex items-center">
                  <input
                    v-model="quantityForm.adjustment_type"
                    type="radio"
                    value="set"
                    class="mr-2"
                  />
                  Set Quantity
                </label>
              </div>
            </div>

            <!-- Quantity Change -->
            <div class="form-group">
              <label class="form-label">
                {{ quantityForm.adjustment_type === 'set' ? 'New Quantity' : 'Quantity to ' + quantityForm.adjustment_type }}
              </label>
              <input
                v-model.number="quantityForm.quantity_change"
                type="number"
                min="0"
                class="form-input"
                :placeholder="quantityForm.adjustment_type === 'set' ? 'Enter new quantity' : 'Enter quantity to ' + quantityForm.adjustment_type"
                required
              />
            </div>

            <!-- Reason -->
            <div class="form-group">
              <label class="form-label">Reason</label>
              <select v-model="quantityForm.reason" class="form-input" required>
                <option value="">Select reason</option>
                <option value="Production">Production</option>
                <option value="Sale">Sale</option>
                <option value="Waste/Loss">Waste/Loss</option>
                <option value="Transfer">Transfer</option>
                <option value="Correction">Correction</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label">Notes (Optional)</label>
              <textarea
                v-model="quantityForm.notes"
                class="form-input"
                rows="3"
                placeholder="Additional notes about this adjustment"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeQuantityAdjustmentModal"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="wasteStore.loading"
                class="btn-primary"
              >
                {{ wasteStore.loading ? 'Adjusting...' : 'Adjust Quantity' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Quantity History Modal -->
    <div
      v-if="showQuantityHistoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Quantity History</h3>
            <button
              @click="closeQuantityHistoryModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900">{{ selectedInventoryItem?.product_name }}</h4>
            <p class="text-sm text-gray-600">Current Quantity: {{ selectedInventoryItem?.quantity }} {{ selectedInventoryItem?.unit }}</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjusted By
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="history in selectedInventoryItem?.quantity_history || []" :key="history.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(history.adjusted_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getAdjustmentTypeBadgeClass(history.adjustment_type)">
                      {{ history.adjustment_type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span :class="history.adjustment_type === 'add' ? 'text-emerald-600' : history.adjustment_type === 'subtract' ? 'text-blood-600' : 'text-violet-600'">
                      {{ history.adjustment_type === 'add' ? '+' : history.adjustment_type === 'subtract' ? '-' : '' }}{{ history.quantity_change }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ history.previous_quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ history.new_quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ history.reason }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ history.adjusted_by }}
                  </td>
                </tr>
              </tbody>
            </table>
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
  XMarkIcon
} from '@heroicons/vue/24/outline'
import type { InventoryItem } from '@/types'

const toast = useToast()
const wasteStore = useWasteStore()
const authStore = useAuthStore()

// State
const inventoryCategoryFilter = ref('')
const selectedInventoryItem = ref<InventoryItem | null>(null)
const editingInventoryItem = ref<InventoryItem | null>(null)
const showAddToInventoryModal = ref(false)
const showEditInventoryModal = ref(false)
const showQuantityAdjustmentModal = ref(false)
const showQuantityHistoryModal = ref(false)

// Image loading states
const imageLoading = ref<Record<string, boolean>>({})
const imageError = ref<Record<string, boolean>>({})

// Forms
const inventoryForm = ref({
  product_name: '',
  description: '',
  category: '',
  quantity: 1,
  unit: 'kg' as 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes',
  price_per_unit: 0,
  image_url: '',
  image_preview: '',
  image_file: null as File | null,
  is_available: true
})

const editForm = ref({
  product_name: '',
  description: '',
  category: '',
  quantity: 1,
  unit: 'kg' as 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes',
  price_per_unit: 0,
  image_url: '',
  image_preview: '',
  image_file: null as File | null,
  is_available: true
})

// Template refs
const imageInput = ref<HTMLInputElement | null>(null)

const quantityForm = ref({
  adjustment_type: 'add' as 'add' | 'subtract' | 'set',
  quantity_change: 0,
  reason: '',
  notes: ''
})


// Computed properties for inventory
const inventoryItems = computed(() => wasteStore.inventoryItems)
const productCategories = computed(() => wasteStore.productCategories)

const filteredInventoryItems = computed(() => {
  let filtered = inventoryItems.value

  if (inventoryCategoryFilter.value) {
    filtered = filtered.filter(item => item.category === inventoryCategoryFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})


// Methods
const loadInventoryItems = async () => {
  await wasteStore.loadInventoryItems()
  
  // Initialize image loading states for items that don't have them yet
  inventoryItems.value.forEach((item: any) => {
    if (item.image_url && imageLoading.value[item.id] === undefined) {
      // Check if image is already loaded by creating a temporary image
      const testImg = new Image()
      testImg.onload = () => {
        imageLoading.value[item.id] = false
        imageError.value[item.id] = false
      }
      testImg.onerror = () => {
        imageLoading.value[item.id] = false
        imageError.value[item.id] = true
      }
      
      // Set initial loading state
      imageLoading.value[item.id] = true
      imageError.value[item.id] = false
      
      // Trigger the test
      testImg.src = item.image_url
    }
  })
}

const handleImageError = (_event: Event, id: string) => {
  imageLoading.value[id] = false
  imageError.value[id] = true
  console.warn(`Failed to load image for inventory item ${id}`)
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error('File must be JPG or PNG')
      return
    }
    
    // Create preview URL using base64 instead of blob URL
    const reader = new FileReader()
    reader.onload = (e) => {
      inventoryForm.value.image_preview = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    inventoryForm.value.image_file = file
    inventoryForm.value.image_url = '' // Clear URL if file is selected
  }
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

const handleAddToInventory = async () => {
  try {
    const { image_preview, image_file, ...inventoryData } = inventoryForm.value
    
    let imageUrl = inventoryForm.value.image_url
    
    // If a file is selected, convert it to base64 data URL
    if (inventoryForm.value.image_file) {
      imageUrl = await convertFileToBase64(inventoryForm.value.image_file)
    }
    
    const dataToSubmit = {
      ...inventoryData,
      vendor_id: authStore.user?.id || '2',
      source_waste_submission_id: '', // Optional reference, can be set to empty
      category: inventoryForm.value.category as 'compost' | 'fertilizer' | 'preserved_food' | 'processed_food' | 'other',
      image_url: imageUrl
    }
    
    await wasteStore.addToInventory(dataToSubmit)
    toast.success('Item added to inventory successfully!')
    closeAddToInventoryModal()
    await loadInventoryItems()
  } catch (error: any) {
    toast.error(error.message || 'Failed to add item to inventory')
  }
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const closeAddToInventoryModal = () => {
  showAddToInventoryModal.value = false
  inventoryForm.value = {
    product_name: '',
    description: '',
    category: '',
    quantity: 1,
    unit: 'kg' as 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes',
    price_per_unit: 0,
    image_url: '',
    image_preview: '',
    image_file: null,
    is_available: true
  }
}

const adjustQuantity = (item: InventoryItem) => {
  selectedInventoryItem.value = item
  quantityForm.value = {
    adjustment_type: 'add',
    quantity_change: 0,
    reason: '',
    notes: ''
  }
  showQuantityAdjustmentModal.value = true
}

const handleQuantityAdjustment = async () => {
  if (!selectedInventoryItem.value) return
  
  try {
    await wasteStore.adjustInventoryQuantity(
      selectedInventoryItem.value.id,
      quantityForm.value.adjustment_type,
      quantityForm.value.quantity_change,
      quantityForm.value.reason,
      authStore.user?.full_name || 'Vendor',
      quantityForm.value.notes
    )
    toast.success('Quantity adjusted successfully!')
    closeQuantityAdjustmentModal()
    await loadInventoryItems()
  } catch (error: any) {
    toast.error(error.message || 'Failed to adjust quantity')
  }
}

const closeQuantityAdjustmentModal = () => {
  showQuantityAdjustmentModal.value = false
  selectedInventoryItem.value = null
  quantityForm.value = {
    adjustment_type: 'add',
    quantity_change: 0,
    reason: '',
    notes: ''
  }
}

const viewQuantityHistory = (item: InventoryItem) => {
  selectedInventoryItem.value = item
  showQuantityHistoryModal.value = true
}

const closeQuantityHistoryModal = () => {
  showQuantityHistoryModal.value = false
  selectedInventoryItem.value = null
}

const editInventoryItem = (item: InventoryItem) => {
  editingInventoryItem.value = item
  editForm.value = {
    product_name: item.product_name,
    description: item.description,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    price_per_unit: item.price_per_unit,
    image_url: item.image_url || '',
    image_preview: item.image_url || '',
    image_file: null,
    is_available: item.is_available
  }
  showEditInventoryModal.value = true
}

const handleEditInventory = async () => {
  if (!editingInventoryItem.value) return
  
  try {
    const { image_preview, image_file, ...inventoryData } = editForm.value
    
    let imageUrl = editForm.value.image_url
    
    // If a file is selected, convert it to base64 data URL
    if (editForm.value.image_file) {
      imageUrl = await convertFileToBase64(editForm.value.image_file)
    }
    
    const dataToUpdate = {
      ...inventoryData,
      category: editForm.value.category as 'compost' | 'fertilizer' | 'preserved_food' | 'processed_food' | 'other',
      image_url: imageUrl,
      total_value: editForm.value.quantity * editForm.value.price_per_unit
    }
    
    await wasteStore.updateInventoryItem(editingInventoryItem.value.id, dataToUpdate)
    toast.success('Inventory item updated successfully!')
    closeEditInventoryModal()
    await loadInventoryItems()
  } catch (error: any) {
    toast.error(error.message || 'Failed to update inventory item')
  }
}

const closeEditInventoryModal = () => {
  showEditInventoryModal.value = false
  editingInventoryItem.value = null
  editForm.value = {
    product_name: '',
    description: '',
    category: '',
    quantity: 1,
    unit: 'kg' as 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes',
    price_per_unit: 0,
    image_url: '',
    image_preview: '',
    image_file: null,
    is_available: true
  }
}

const deleteInventoryItem = async (item: InventoryItem) => {
  if (confirm(`Are you sure you want to delete ${item.product_name}?`)) {
    try {
      await wasteStore.deleteInventoryItem(item.id)
      toast.success('Inventory item deleted successfully!')
      await loadInventoryItems()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete inventory item')
    }
  }
}

const getAdjustmentTypeBadgeClass = (type: string) => {
  const classes = {
    add: 'badge-success',
    subtract: 'badge-danger',
    set: 'badge-primary'
  }
  return classes[type as keyof typeof classes] || 'badge-gray'
}

onMounted(() => {
  authStore.initializeAuth()
  loadInventoryItems()
  wasteStore.loadWasteCategories()
})

// Refresh inventory when component becomes visible (useful when navigating back from other pages)
const refreshInventory = async () => {
  await loadInventoryItems()
}

// Expose refresh method for external use
defineExpose({ refreshInventory })
</script>
