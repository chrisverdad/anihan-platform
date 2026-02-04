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
        Sign in to your account
      </h2>
      <p class="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Or
        <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="w-full max-w-sm sm:max-w-md mx-auto">
      <div class="bg-white py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 shadow sm:rounded-lg">
        <form class="space-y-4 sm:space-y-6" @submit.prevent="handleSubmit">
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
                autocomplete="current-password"
                required
                class="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                :class="{ 'border-danger-500': errors.password }"
                placeholder="Enter your password"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-xs sm:text-sm text-danger-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-xs sm:text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-xs sm:text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>
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
                <span class="hidden xs:inline">Signing in...</span>
                <span class="xs:hidden">Signing in</span>
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>

          <!-- Demo Accounts -->
          <div class="mt-4 sm:mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-xs sm:text-sm">
                <span class="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div class="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <button
                type="button"
                @click="fillDemoAccount('admin')"
                class="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <strong>Admin:</strong> admin@anihan.com / admin123
              </button>
              <button
                type="button"
                @click="fillDemoAccount('vendor')"
                class="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <strong>Vendor:</strong> vendor@anihan.com / vendor123
              </button>
              <button
                type="button"
                @click="fillDemoAccount('user')"
                class="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <strong>User:</strong> user@anihan.com / user123
              </button>
            </div>
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
import type { LoginCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive<LoginCredentials & { rememberMe: boolean }>({
  email: '',
  password: '',
  rememberMe: false
})

const fillDemoAccount = (role: string) => {
  const accounts = {
    admin: { email: 'admin@anihan.com', password: 'admin123' },
    vendor: { email: 'vendor@anihan.com', password: 'vendor123' },
    user: { email: 'user@anihan.com', password: 'user123' }
  }
  
  form.email = accounts[role as keyof typeof accounts].email
  form.password = accounts[role as keyof typeof accounts].password
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })
    
    toast.success('Successfully logged in!')
    // Redirect based on user role
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else if (authStore.isVendor) {
      router.push('/dashboard')
    } else {
      router.push('/user/dashboard')
    }
  } catch (error: any) {
    toast.error(error.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>
