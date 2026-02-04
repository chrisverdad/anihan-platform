<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p class="text-gray-600 mt-1">Manage your account information</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Overview -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="card-body text-center">
              <div class="relative w-24 h-24 mx-auto mb-4">
                <div v-if="user?.profile_photo" class="w-24 h-24 rounded-full overflow-hidden">
                  <img 
                    :src="user.profile_photo" 
                    :alt="user.full_name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <div v-else class="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-2xl">
                    {{ user?.full_name?.charAt(0) || 'U' }}
                  </span>
                </div>
                <button
                  @click="triggerFileInput"
                  class="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                  title="Change profile photo"
                >
                  <CameraIcon class="w-4 h-4" />
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ user?.full_name }}</h3>
              <p class="text-sm text-gray-500 capitalize">{{ user?.role }}</p>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
              
              <div class="mt-6 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Member since:</span>
                  <span class="text-gray-900">{{ formatDate(user?.created_at) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Status:</span>
                  <span :class="user?.is_active ? 'text-success-600' : 'text-danger-600'">
                    {{ user?.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div v-if="user?.role === 'vendor'" class="flex justify-between text-sm">
                  <span class="text-gray-500">Vendor Status:</span>
                  <span :class="getVendorStatusColor(user?.vendor_status)">
                    {{ user?.vendor_status || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">Full Name</label>
                    <input
                      v-model="profileForm.full_name"
                      type="text"
                      required
                      class="form-input"
                      :class="{ 'border-danger-500': errors.full_name }"
                    />
                    <p v-if="errors.full_name" class="form-error">{{ errors.full_name }}</p>
                  </div>
                  
                  <div>
                    <label class="form-label">Email</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      required
                      class="form-input"
                      :class="{ 'border-danger-500': errors.email }"
                    />
                    <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">Phone Number</label>
                    <input
                      v-model="profileForm.phone"
                      type="tel"
                      class="form-input"
                      :class="{ 'border-danger-500': errors.phone }"
                      placeholder="+63 912 345 6789"
                    />
                    <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
                  </div>
                  
                  <div>
                    <label class="form-label">Role</label>
                    <input
                      :value="profileForm.role"
                      type="text"
                      disabled
                      class="form-input bg-gray-100"
                    />
                    <p class="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="profileForm.address"
                    rows="3"
                    class="form-input"
                    :class="{ 'border-danger-500': errors.address }"
                    placeholder="Enter your address"
                  ></textarea>
                  <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
                </div>

                <!-- Vendor-specific fields -->
                <div v-if="user?.role === 'vendor'" class="space-y-6">
                  <div class="border-t pt-6">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Business Information</h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="form-label">Business Name</label>
                        <input
                          v-model="profileForm.business_name"
                          type="text"
                          class="form-input"
                          :class="{ 'border-danger-500': errors.business_name }"
                          placeholder="Enter business name"
                        />
                        <p v-if="errors.business_name" class="form-error">{{ errors.business_name }}</p>
                      </div>
                      
                      <div>
                        <label class="form-label">Business Type</label>
                        <input
                          v-model="profileForm.business_type"
                          type="text"
                          class="form-input"
                          :class="{ 'border-danger-500': errors.business_type }"
                          placeholder="e.g., Market Vendor, Restaurant"
                        />
                        <p v-if="errors.business_type" class="form-error">{{ errors.business_type }}</p>
                      </div>
                    </div>

                    <div class="mt-6">
                      <label class="form-label">Years in Business</label>
                      <input
                        v-model="profileForm.years_in_business"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-500': errors.years_in_business }"
                        placeholder="e.g., 5 years"
                      />
                      <p v-if="errors.years_in_business" class="form-error">{{ errors.years_in_business }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                    @click="resetForm"
                    class="btn-outline"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                    <span v-else>Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Change Password -->
          <div class="card mt-8">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Change Password</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="changePassword" class="space-y-6">
                <div>
                  <label class="form-label">Current Password</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="form-input"
                    :class="{ 'border-danger-500': passwordErrors.currentPassword }"
                  />
                  <p v-if="passwordErrors.currentPassword" class="form-error">{{ passwordErrors.currentPassword }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">New Password</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="form-input"
                      :class="{ 'border-danger-500': passwordErrors.newPassword }"
                    />
                    <p v-if="passwordErrors.newPassword" class="form-error">{{ passwordErrors.newPassword }}</p>
                  </div>
                  
                  <div>
                    <label class="form-label">Confirm New Password</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="form-input"
                      :class="{ 'border-danger-500': passwordErrors.confirmPassword }"
                    />
                    <p v-if="passwordErrors.confirmPassword" class="form-error">{{ passwordErrors.confirmPassword }}</p>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="passwordLoading"
                    class="btn-primary"
                  >
                    <span v-if="passwordLoading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </span>
                    <span v-else>Change Password</span>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { CameraIcon } from '@heroicons/vue/24/outline'
import { convertFileToBase64 } from '@/utils/imageUtils'

const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const loading = ref(false)
const passwordLoading = ref(false)

const errors = ref<Record<string, string>>({})
const passwordErrors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement>()

const profileForm = reactive({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  role: '',
  business_name: '',
  business_type: '',
  years_in_business: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateProfileForm = () => {
  errors.value = {}
  
  if (!profileForm.full_name.trim()) {
    errors.value.full_name = 'Full name is required'
  }
  
  if (!profileForm.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (profileForm.phone && !/^\+?[\d\s-()]+$/.test(profileForm.phone)) {
    errors.value.phone = 'Phone number is invalid'
  }
  
  return Object.keys(errors.value).length === 0
}

const validatePasswordForm = () => {
  passwordErrors.value = {}
  
  if (!passwordForm.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
  }
  
  if (!passwordForm.newPassword) {
    passwordErrors.value.newPassword = 'New password is required'
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Password must be at least 6 characters'
  }
  
  if (!passwordForm.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Please confirm your password'
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
  }
  
  return Object.keys(passwordErrors.value).length === 0
}

const updateProfile = async () => {
  if (!validateProfileForm()) return
  
  loading.value = true
  
  try {
    const updateData: any = {
      full_name: profileForm.full_name,
      email: profileForm.email,
      phone: profileForm.phone,
      address: profileForm.address
    }
    
    // Add vendor-specific fields if user is a vendor
    if (user.value?.role === 'vendor') {
      updateData.business_name = profileForm.business_name
      updateData.business_type = profileForm.business_type
      updateData.years_in_business = profileForm.years_in_business
    }
    
    await authStore.updateProfile(updateData)
    
    toast.success('Profile updated successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (!validatePasswordForm()) return
  
  passwordLoading.value = true
  
  try {
    // Mock password change - in real app, this would call API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Password changed successfully!')
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    toast.error(error.message || 'Failed to change password')
  } finally {
    passwordLoading.value = false
  }
}

const resetForm = () => {
  if (user.value) {
    profileForm.full_name = user.value.full_name
    profileForm.email = user.value.email
    profileForm.phone = user.value.phone || ''
    profileForm.address = user.value.address || ''
    profileForm.role = user.value.role
    profileForm.business_name = user.value.business_name || ''
    profileForm.business_type = user.value.business_type || ''
    profileForm.years_in_business = user.value.years_in_business || ''
  }
  errors.value = {}
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB')
    return
  }
  
  try {
    loading.value = true
    
    // Convert file to base64 data URL instead of blob URL
    const imageUrl = await convertFileToBase64(file)
    
    // Update profile with new photo
    await authStore.updateProfile({ profile_photo: imageUrl })
    
    toast.success('Profile photo updated successfully!')
    
    // Reset file input
    target.value = ''
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile photo')
  } finally {
    loading.value = false
  }
}

const handleImageError = () => {
  // If image fails to load, remove it
  if (user.value?.profile_photo) {
    authStore.updateProfile({ profile_photo: undefined })
  }
}

const getVendorStatusColor = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'text-success-600'
    case 'pending':
      return 'text-warning-600'
    case 'rejected':
      return 'text-danger-600'
    default:
      return 'text-gray-500'
  }
}

onMounted(() => {
  resetForm()
})
</script>
