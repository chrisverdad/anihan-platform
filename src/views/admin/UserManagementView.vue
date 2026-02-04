<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
            <p class="text-gray-600 mt-1">Manage platform users and their permissions</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="loadUsers"
              class="btn-outline flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Refresh</span>
            </button>
            <button
              @click="showAddUserModal = true"
              class="btn-primary flex items-center space-x-2"
            >
              <PlusIcon class="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Search -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="form-label">Search Users</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or email..."
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Filter by Role</label>
              <select v-model="roleFilter" class="form-input">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label class="form-label">Filter by Status</label>
              <select v-model="statusFilter" class="form-input">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending_vendors">Pending Vendors</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">
            Users ({{ filteredUsers.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium text-sm">
                          {{ user.full_name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.full_name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge-primary capitalize">{{ user.role }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="user.is_active ? 'badge-success' : 'badge-danger'"
                  >
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.role === 'vendor'" :class="getVendorStatusClass(user.vendor_status)">
                    {{ getVendorStatusText(user.vendor_status) }}
                  </span>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="user.role === 'vendor' && user.vendor_status === 'pending'"
                      @click="viewVendorDetails(user)"
                      class="text-blue-600 hover:text-blue-900"
                      title="View Vendor Details"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="user.role === 'vendor' && user.vendor_status === 'pending'"
                      @click="approveVendor(user)"
                      class="text-green-600 hover:text-green-900"
                      title="Approve Vendor"
                    >
                      <CheckCircleIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="user.role === 'vendor' && user.vendor_status === 'pending'"
                      @click="rejectVendor(user)"
                      class="text-red-600 hover:text-red-900"
                      title="Reject Vendor"
                    >
                      <XCircleIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.is_active ? 'text-warning-600 hover:text-warning-900' : 'text-success-600 hover:text-success-900'"
                    >
                      <component :is="user.is_active ? 'XMarkIcon' : 'CheckIcon'" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-danger-600 hover:text-danger-900"
                    >
                      <TrashIcon class="w-4 h-4" />
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
              {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of 
              {{ filteredUsers.length }} results
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

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddUserModal || showEditUserModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showAddUserModal ? 'Add New User' : 'Edit User' }}
          </h3>
          
          <form @submit.prevent="saveUser" class="space-y-6">
            <!-- Basic Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Full Name</label>
                <input
                  v-model="userForm.full_name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label class="form-label">Email</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Role</label>
                <select v-model="userForm.role" required class="form-input">
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label class="form-label">Phone</label>
                <input
                  v-model="userForm.phone"
                  type="tel"
                  class="form-input"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <label class="form-label">Address</label>
              <textarea
                v-model="userForm.address"
                rows="3"
                class="form-input"
                placeholder="Enter address"
              ></textarea>
            </div>
            
            <!-- Business License Display (for vendors) -->
            <div v-if="editingUser?.role === 'vendor' && editingUser?.business_license">
              <label class="form-label">Business License/Proof Document</label>
              <div class="mt-1 border rounded-lg p-4 bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="w-8 h-8 text-blue-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Business License Document</p>
                      <p class="text-sm text-gray-500">File: {{ editingUser.business_license }}</p>
                      <p class="text-sm text-gray-500">Uploaded on {{ formatDate(editingUser.created_at) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="viewLicenseFile(editingUser.business_license)"
                    class="btn-outline text-sm"
                  >
                    View Document
                  </button>
                </div>
              </div>
            </div>

            <!-- Profile Photo Upload -->
            <div>
              <label class="form-label">Profile Photo</label>
              <div class="mt-1 flex items-center space-x-4">
                <div v-if="userForm.profile_photo_preview" class="flex-shrink-0">
                  <img
                    :src="userForm.profile_photo_preview"
                    alt="Profile preview"
                    class="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
                <div v-else-if="editingUser?.profile_photo" class="flex-shrink-0">
                  <img
                    :src="`http://localhost:3000/uploads/${editingUser.profile_photo}`"
                    alt="Current profile"
                    class="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
                <div v-else class="flex-shrink-0">
                  <div class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <UserIcon class="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div class="flex-1">
                  <input
                    ref="photoInput"
                    type="file"
                    accept="image/*"
                    @change="handlePhotoChange"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="() => photoInput?.click()"
                    class="btn-outline text-sm"
                  >
                    {{ userForm.profile_photo_preview ? 'Change Photo' : 'Upload Photo' }}
                  </button>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>
            
            <div v-if="showAddUserModal">
              <label class="form-label">Password</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                class="form-input"
                placeholder="Enter password"
              />
            </div>
            
            <div class="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                class="btn-primary flex-1"
                :disabled="loading"
              >
                {{ loading ? 'Saving...' : (showAddUserModal ? 'Add User' : 'Update User') }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Vendor Details Modal -->
    <div
      v-if="showVendorDetailsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Vendor Registration Details
            </h3>
            <button
              @click="showVendorDetailsModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div v-if="selectedVendor" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div class="space-y-3">
                  <div>
                    <label class="text-sm font-medium text-gray-500">Full Name</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.full_name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Email</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.email }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Phone</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.phone || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Address</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.address || 'Not provided' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-3">Business Information</h4>
                <div class="space-y-3">
                  <div>
                    <label class="text-sm font-medium text-gray-500">Business Name</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.business_name || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Business Type</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.business_type || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Years in Business</label>
                    <p class="text-sm text-gray-900">{{ selectedVendor.years_in_business || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Registration Date</label>
                    <p class="text-sm text-gray-900">{{ formatDate(selectedVendor.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Business License -->
            <div>
              <h4 class="text-md font-semibold text-gray-900 mb-3">Business License</h4>
              <div v-if="selectedVendor.business_license" class="border rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="w-8 h-8 text-blue-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Business License Document</p>
                      <p class="text-sm text-gray-500">File: {{ selectedVendor.business_license }}</p>
                      <p class="text-sm text-gray-500">Uploaded on {{ formatDate(selectedVendor.created_at) }}</p>
                    </div>
                  </div>
                  <button
                    @click="viewLicenseFile(selectedVendor.business_license)"
                    class="btn-outline text-sm"
                  >
                    View Document
                  </button>
                </div>
              </div>
              <div v-else class="border rounded-lg p-4 bg-gray-50">
                <p class="text-sm text-gray-500">No business license uploaded</p>
                <p class="text-xs text-gray-400 mt-1">Debug: {{ JSON.stringify(selectedVendor.business_license) }}</p>
              </div>
            </div>
            
            <!-- Approval Actions -->
            <div class="border-t pt-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Approval Actions</h4>
              <div class="flex items-center space-x-4">
                <button
                  @click="approveVendor(selectedVendor)"
                  class="btn-success flex items-center space-x-2"
                >
                  <CheckCircleIcon class="w-5 h-5" />
                  <span>Approve Vendor</span>
                </button>
                <button
                  @click="rejectVendor(selectedVendor)"
                  class="btn-danger flex items-center space-x-2"
                >
                  <XCircleIcon class="w-5 h-5" />
                  <span>Reject Vendor</span>
                </button>
                <button
                  @click="showVendorDetailsModal = false"
                  class="btn-outline"
                >
                  Close
                </button>
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
import { useUsersStore } from '@/stores/users'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import type { User } from '@/types'

const toast = useToast()
const usersStore = useUsersStore()

// State
const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const photoInput = ref<HTMLInputElement | null>(null)

// Modal state
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showVendorDetailsModal = ref(false)
const editingUser = ref<User | null>(null)
const selectedVendor = ref<User | null>(null)

const userForm = ref({
  full_name: '',
  email: '',
  role: 'user' as User['role'],
  phone: '',
  address: '',
  password: '',
  profile_photo_preview: '',
  profile_photo_file: null as File | null
})

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (statusFilter.value) {
    if (statusFilter.value === 'pending_vendors') {
      filtered = filtered.filter(user => 
        user.role === 'vendor' && user.vendor_status === 'pending'
      )
    } else {
      const isActive = statusFilter.value === 'active'
      filtered = filtered.filter(user => user.is_active === isActive)
    }
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

// Methods
const loadUsers = async () => {
  try {
    loading.value = true
    // Load from localStorage-based store
    await usersStore.loadUsers()
    users.value = usersStore.users
  } catch (error: any) {
    toast.error(error.message || 'Failed to load users')
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const editUser = (user: User) => {
  editingUser.value = user
  userForm.value = {
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
    password: '',
    profile_photo_preview: '',
    profile_photo_file: null
  }
  showEditUserModal.value = true
}

const toggleUserStatus = async (user: User) => {
  try {
    // Update using localStorage-based store
    await usersStore.toggleUserStatus(user.id)
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].is_active = !users.value[index].is_active
    }
    toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`)
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user status')
  }
}

const deleteUser = async (user: User) => {
  if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
    try {
      // Delete using localStorage-based store
      await usersStore.deleteUser(user.id)
      users.value = users.value.filter(u => u.id !== user.id)
      toast.success('User deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
    }
  }
}

const saveUser = async () => {
  loading.value = true
  
  try {
    if (showAddUserModal.value) {
      // Create new user using localStorage-based store
      await usersStore.createUser({
        full_name: userForm.value.full_name,
        email: userForm.value.email,
        role: userForm.value.role as 'admin' | 'vendor' | 'user',
        phone: userForm.value.phone,
        address: userForm.value.address,
        password: userForm.value.password,
        is_active: true
      })
      
      await loadUsers() // Reload users list
      toast.success('User added successfully')
    } else if (showEditUserModal.value && editingUser.value) {
      // Update user using localStorage-based store
      await usersStore.updateUser(editingUser.value.id, {
        full_name: userForm.value.full_name,
        email: userForm.value.email,
        role: userForm.value.role as 'admin' | 'vendor' | 'user',
        phone: userForm.value.phone,
        address: userForm.value.address
      })
      
      await loadUsers() // Reload users list
      toast.success('User updated successfully')
    }
    
    closeModal()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save user')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddUserModal.value = false
  showEditUserModal.value = false
  editingUser.value = null
  userForm.value = {
    full_name: '',
    email: '',
    role: 'user',
    phone: '',
    address: '',
    password: '',
    profile_photo_preview: '',
    profile_photo_file: null
  }
}

// Vendor-specific methods
const getVendorStatusClass = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'badge-warning'
    case 'approved':
      return 'badge-success'
    case 'rejected':
      return 'badge-danger'
    default:
      return 'badge-gray'
  }
}

const getVendorStatusText = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'Pending Approval'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Not Applicable'
  }
}

const viewVendorDetails = (vendor: User) => {
  console.log('Vendor details:', vendor)
  console.log('Business license:', vendor.business_license)
  selectedVendor.value = vendor
  showVendorDetailsModal.value = true
}

const approveVendor = async (vendor: User) => {
  if (confirm(`Are you sure you want to approve ${vendor.full_name} as a vendor?`)) {
    try {
      // Update using localStorage-based store
      await usersStore.updateUser(vendor.id, {
        vendor_status: 'approved',
        is_active: true, // Activate the vendor account
        approval_notes: 'Approved by admin',
        approved_by: 'admin',
        approved_at: new Date().toISOString()
      })
      
      const index = users.value.findIndex(u => u.id === vendor.id)
      if (index !== -1) {
        users.value[index].vendor_status = 'approved'
        users.value[index].is_active = true
        users.value[index].approval_notes = 'Approved by admin'
        users.value[index].approved_by = 'admin'
        users.value[index].approved_at = new Date().toISOString()
      }
      toast.success('Vendor approved successfully')
      showVendorDetailsModal.value = false
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve vendor')
    }
  }
}

const rejectVendor = async (vendor: User) => {
  if (confirm(`Are you sure you want to reject ${vendor.full_name}'s vendor application?`)) {
    try {
      // Update using localStorage-based store
      await usersStore.updateUser(vendor.id, {
        vendor_status: 'rejected',
        approval_notes: 'Rejected by admin'
      })
      
      const index = users.value.findIndex(u => u.id === vendor.id)
      if (index !== -1) {
        users.value[index].vendor_status = 'rejected'
        users.value[index].approval_notes = 'Rejected by admin'
      }
      toast.success('Vendor application rejected')
      showVendorDetailsModal.value = false
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject vendor')
    }
  }
}

const handlePhotoChange = (event: Event) => {
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
      userForm.value.profile_photo_preview = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    userForm.value.profile_photo_file = file
  }
}

const viewLicenseFile = (licenseFile: string) => {
  // Handle different types of license files
  if (licenseFile && licenseFile.startsWith('blob:')) {
    // This is a blob URL that might be broken, show error
    toast.error('License file is no longer available. Please ask the vendor to re-upload.')
  } else if (licenseFile && licenseFile.startsWith('data:')) {
    // This is a base64 data URL, open it
    window.open(licenseFile, '_blank')
  } else if (licenseFile) {
    // If it's a file path, try to open it
    window.open(licenseFile, '_blank')
  } else {
    toast.error('No license file available')
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
  loadUsers()
})

// Refresh users when the component becomes visible (for new registrations)
const refreshUsers = () => {
  loadUsers()
}

// Expose refresh method for external use
defineExpose({ refreshUsers })
</script>
