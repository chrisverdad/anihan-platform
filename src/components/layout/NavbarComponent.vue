<template>
  <nav class="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center space-x-2">
            <div class="w-7 h-7 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">A</span>
            </div>
            <span class="text-lg font-bold text-gray-900">AniHan</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="text-gray-700 hover:text-violet-600 px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
            :class="{ 'text-violet-600 bg-violet-50': $route.path === item.href }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-3">
          <!-- Notifications -->
          <button class="p-1.5 text-gray-400 hover:text-gray-500 relative">
            <BellIcon class="h-5 w-5" />
            <span class="absolute -top-1 -right-1 h-3 w-3 bg-blood-500 text-white text-xs rounded-full flex items-center justify-center text-[10px]">
              3
            </span>
          </button>

          <!-- Profile Dropdown -->
          <div class="relative" ref="profileDropdown">
            <button
              @click="toggleProfileDropdown"
              class="flex items-center space-x-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <div v-if="user?.profile_photo" class="w-7 h-7 rounded-full overflow-hidden">
                <img 
                  :src="user.profile_photo" 
                  :alt="user.full_name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="w-7 h-7 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-medium">
                  {{ user?.full_name?.charAt(0) || 'U' }}
                </span>
              </div>
              <span class="hidden md:block text-gray-700 font-medium text-sm">{{ user?.full_name }}</span>
              <ChevronDownIcon class="h-3 w-3 text-gray-400" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showProfileDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showProfileDropdown = false"
              >
                Profile Settings
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Bars3Icon v-if="!showMobileMenu" class="h-5 w-5" />
            <XMarkIcon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === item.href }"
            @click="showMobileMenu = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const showProfileDropdown = ref(false)
const showMobileMenu = ref(false)
const profileDropdown = ref<HTMLElement>()

const navigationItems = computed(() => {
  const baseItems = [
    { name: 'Dashboard', href: authStore.isAdmin ? '/admin/dashboard' : authStore.isVendor ? '/dashboard' : '/user/dashboard' }
  ]

  if (authStore.isAdmin) {
    baseItems.push(
      { name: 'Users', href: '/admin/users' },
      { name: 'Waste', href: '/admin/waste' },
      { name: 'Orders', href: '/admin/orders' },
      { name: 'Products', href: '/admin/products' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Delivery', href: '/admin/delivery' },
      { name: 'Reports', href: '/admin/reports' },
      { name: 'Analytics', href: '/admin/analytics' }
    )
            } else if (authStore.isVendor) {
    baseItems.push(
      { name: 'Submit Waste', href: '/vendor/source-submissions' },
      { name: 'Categories', href: '/vendor/categories' },
      { name: 'Inventory', href: '/vendor/inventory' },
      { name: 'Reports', href: '/vendor/reports' }
    )
  } else {
    baseItems.push(
      { name: 'Products', href: '/user/products' },
      { name: 'My Orders', href: '/user/orders' }
    )
  }

  return baseItems
})

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Successfully logged out')
    router.push('/login')
  } catch (error) {
    toast.error('Failed to logout')
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target as Node)) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
