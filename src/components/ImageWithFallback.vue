<template>
  <div :class="containerClass">
    <img
      v-if="safeSrc && !hasError"
      :src="safeSrc"
      :alt="alt"
      :class="imageClass"
      @error="handleError"
      :loading="loading"
    />
    <div v-else :class="fallbackClass">
      <component :is="fallbackIcon" :class="iconClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CubeIcon } from '@heroicons/vue/24/outline'
import { getSafeImageUrl } from '@/utils/imageUtils'

interface Props {
  src?: string
  alt: string
  containerClass?: string
  imageClass?: string
  fallbackClass?: string
  fallbackIcon?: any
  iconClass?: string
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: 'w-full h-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden',
  imageClass: 'w-full h-full object-cover',
  fallbackClass: 'w-full h-full bg-gray-200 rounded-lg flex items-center justify-center',
  fallbackIcon: CubeIcon,
  iconClass: 'w-12 h-12 text-gray-400',
  loading: 'lazy'
})

const hasError = ref(false)

// Use safe image URL that handles blob URLs
const safeSrc = computed(() => {
  return getSafeImageUrl(props.src)
})

const handleError = () => {
  hasError.value = true
  console.warn(`Image failed to load: ${props.src}`)
}

// Reset error state when src changes
watch(() => props.src, () => {
  hasError.value = false
})
</script>
