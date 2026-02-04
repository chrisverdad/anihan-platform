<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-4 px-4 sm:py-8 sm:px-6 lg:py-12 lg:px-8">
    <!-- Home Button -->
    <div class="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
      <router-link 
        to="/" 
        class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="hidden xs:inline">Home</span>
      </router-link>
    </div>

    <div class="w-full max-w-sm sm:max-w-md mx-auto">
      <!-- Logo -->
      <div class="flex justify-center mb-4 sm:mb-6">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <div class="w-8 h-8 sm:w-12 sm:h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg sm:text-2xl">A</span>
          </div>
          <span class="text-xl sm:text-3xl font-bold text-gray-900">AniHan</span>
        </div>
      </div>
      
      <h2 class="text-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-4">
        Create your account
      </h2>
      <p class="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Or
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div class="w-full max-w-sm sm:max-w-md mx-auto">
      <div class="bg-white py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 shadow sm:rounded-lg">
        <form class="space-y-4 sm:space-y-6" @submit.prevent="handleSubmit">
          <!-- Full Name -->
          <div>
            <label for="full_name" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Full Name
            </label>
            <div>
              <input
                id="full_name"
                v-model="form.full_name"
                name="full_name"
                type="text"
                autocomplete="name"
                required
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.full_name }"
                placeholder="Enter your full name"
              />
            </div>
            <p v-if="errors.full_name" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.full_name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email address
            </label>
            <div>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.email }"
                placeholder="Enter your email"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.email }}</p>
          </div>

          <!-- Role Selection -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Account Type</label>
            <div class="space-y-2">
              <div class="flex items-start">
                <input
                  id="role-user"
                  v-model="form.role"
                  name="role"
                  type="radio"
                  value="user"
                  class="focus:ring-primary-500 h-3 w-3 sm:h-4 sm:w-4 text-primary-600 border-gray-300 mt-1"
                />
                <label for="role-user" class="ml-2 sm:ml-3 block text-xs sm:text-sm font-medium text-gray-700">
                  <span class="font-semibold">General User</span>
                  <span class="text-gray-500 block sm:inline sm:ml-1">- Browse and purchase repurposed products</span>
                </label>
              </div>
              <div class="flex items-start">
                <input
                  id="role-vendor"
                  v-model="form.role"
                  name="role"
                  type="radio"
                  value="vendor"
                  class="focus:ring-primary-500 h-3 w-3 sm:h-4 sm:w-4 text-primary-600 border-gray-300 mt-1"
                />
                <label for="role-vendor" class="ml-2 sm:ml-3 block text-xs sm:text-sm font-medium text-gray-700">
                  <span class="font-semibold">Vendor</span>
                  <span class="text-gray-500 block sm:inline sm:ml-1">- Submit market surplus and manage inventory</span>
                </label>
              </div>
            </div>
            <p v-if="errors.role" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.role }}</p>
          </div>

          <!-- Vendor-specific fields -->
          <div v-if="form.role === 'vendor'" class="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="text-base sm:text-lg font-medium text-blue-900 mb-2 sm:mb-3">Vendor Information</h3>
            
            <!-- Business Name -->
            <div>
              <label for="business_name" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Name <span class="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="business_name"
                  v-model="form.business_name"
                  name="business_name"
                  type="text"
                  required
                  class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  :class="{ 'border-danger-500': errors.business_name }"
                  placeholder="Enter your business name"
                />
              </div>
              <p v-if="errors.business_name" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.business_name }}</p>
            </div>

            <!-- Business Type -->
            <div>
              <label for="business_type" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Type <span class="text-red-500">*</span>
              </label>
              <div>
                <select
                  id="business_type"
                  v-model="form.business_type"
                  name="business_type"
                  required
                  class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  :class="{ 'border-danger-500': errors.business_type }"
                >
                  <option value="">Select business type</option>
                  <option value="market_vendor">Market Vendor</option>
                  <option value="farm_owner">Farm Owner</option>
                  <option value="food_processor">Food Processor</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <p v-if="errors.business_type" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.business_type }}</p>
            </div>

            <!-- Business License Upload -->
            <div>
              <label for="business_license" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business License/Registration <span class="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="business_license"
                  ref="licenseFile"
                  name="business_license"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-xs sm:text-sm"
                  :class="{ 'border-danger-500': errors.business_license }"
                  @change="handleFileUpload"
                />
                <p class="text-xs sm:text-sm text-gray-500 mt-1">
                  Upload PDF, JPG, or PNG file (Max 5MB)
                </p>
              </div>
              <p v-if="errors.business_license" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.business_license }}</p>
              <p v-if="form.licenseFileName" class="text-xs sm:text-sm text-green-600 mt-1">
                ✓ File selected: {{ form.licenseFileName }}
              </p>
            </div>

            <!-- Years in Business -->
            <div>
              <label for="years_in_business" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Years in Business <span class="text-red-500">*</span>
              </label>
              <div>
                <select
                  id="years_in_business"
                  v-model="form.years_in_business"
                  name="years_in_business"
                  required
                  class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  :class="{ 'border-danger-500': errors.years_in_business }"
                >
                  <option value="">Select years</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">More than 10 years</option>
                </select>
              </div>
              <p v-if="errors.years_in_business" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.years_in_business }}</p>
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Phone Number (Optional)
            </label>
            <div>
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.phone }"
                placeholder="+63 912 345 6789"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.phone }}</p>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Address (Optional)
            </label>
            <div>
              <textarea
                id="address"
                v-model="form.address"
                name="address"
                rows="3"
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.address }"
                placeholder="Enter your address"
              ></textarea>
            </div>
            <p v-if="errors.address" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.address }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.password }"
                placeholder="Create a password"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirm_password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <div>
              <input
                id="confirm_password"
                v-model="form.confirm_password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                required
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.confirm_password }"
                placeholder="Confirm your password"
              />
            </div>
            <p v-if="errors.confirm_password" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.confirm_password }}</p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.acceptTerms"
              name="terms"
              type="checkbox"
              required
              class="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-xs sm:text-sm text-gray-900">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="hidden xs:inline">Creating account...</span>
                <span class="xs:hidden">Creating...</span>
              </span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import type { RegisterData } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const errors = ref<Record<string, string>>({})
const licenseFile = ref<HTMLInputElement | null>(null)

const form = reactive<RegisterData & { 
  confirm_password: string; 
  acceptTerms: boolean;
  business_name?: string;
  business_type?: string;
  business_license?: File | null;
  licenseFileName?: string;
  years_in_business?: string;
}>({
  full_name: '',
  email: '',
  role: 'user',
  phone: '',
  address: '',
  password: '',
  confirm_password: '',
  acceptTerms: false,
  business_name: '',
  business_type: '',
  business_license: null,
  licenseFileName: '',
  years_in_business: ''
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.business_license = 'File size must be less than 5MB'
      return
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      errors.value.business_license = 'File must be PDF, JPG, or PNG'
      return
    }
    
    form.business_license = file
    form.licenseFileName = file.name
    delete errors.value.business_license
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.full_name.trim()) {
    errors.value.full_name = 'Full name is required'
  }
  
  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!form.role) {
    errors.value.role = 'Please select an account type'
  }
  
  // Vendor-specific validation
  if (form.role === 'vendor') {
    if (!form.business_name?.trim()) {
      errors.value.business_name = 'Business name is required for vendors'
    }
    
    if (!form.business_type) {
      errors.value.business_type = 'Business type is required for vendors'
    }
    
    if (!form.business_license) {
      errors.value.business_license = 'Business license is required for vendors'
    }
    
    if (!form.years_in_business) {
      errors.value.years_in_business = 'Years in business is required for vendors'
    }
  }
  
  if (form.phone && !/^\+?[\d\s-()]+$/.test(form.phone)) {
    errors.value.phone = 'Phone number is invalid'
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  if (!form.confirm_password) {
    errors.value.confirm_password = 'Please confirm your password'
  } else if (form.password !== form.confirm_password) {
    errors.value.confirm_password = 'Passwords do not match'
  }
  
  if (!form.acceptTerms) {
    toast.error('Please accept the terms and conditions')
    return false
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const userData = {
      full_name: form.full_name,
      email: form.email,
      role: form.role as 'user' | 'vendor',
      phone: form.phone || undefined,
      address: form.address || undefined,
      password: form.password,
      business_name: form.business_name,
      business_type: form.business_type,
      years_in_business: form.years_in_business
    }
    
    await authStore.register(userData, form.business_license || undefined)
    
    if (form.role === 'vendor') {
      toast.success('Vendor registration submitted successfully! Your account will be activated after admin approval.')
      router.push('/login')
    } else {
      toast.success('Account created successfully!')
      router.push('/dashboard')
    }
  } catch (error: any) {
    toast.error(error.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
