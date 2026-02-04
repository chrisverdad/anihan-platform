<template>
  <div id="app">
    <NavbarComponent v-if="authStore.isAuthenticated" />
    <main class="main-content" :class="{ 'no-navbar': !authStore.isAuthenticated }">
      <router-view />
    </main>
    <FooterComponent v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { dataPersistenceManager } from './utils/dataPersistence'
import NavbarComponent from './components/layout/NavbarComponent.vue'
import FooterComponent from './components/layout/FooterComponent.vue'

const authStore = useAuthStore()

// Save data before page unload
const handleBeforeUnload = () => {
  dataPersistenceManager.saveAllData()
}

// Refresh data when component mounts
onMounted(() => {
  // Add event listener for page unload
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // Remove event listener
  window.removeEventListener('beforeunload', handleBeforeUnload)
  
  // Save data when component unmounts
  dataPersistenceManager.saveAllData()
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 200px);
  padding-top: 80px;
}

.main-content.no-navbar {
  padding-top: 0;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
  
  .main-content.no-navbar {
    padding-top: 0;
  }
}
</style>
