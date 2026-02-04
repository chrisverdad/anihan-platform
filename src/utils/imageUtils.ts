// Image utility functions for handling blob URLs and image management

/**
 * Check if a URL is a blob URL
 */
export const isBlobUrl = (url: string): boolean => {
  return Boolean(url && url.startsWith('blob:'))
}

/**
 * Check if a URL is a data URL (base64)
 */
export const isDataUrl = (url: string): boolean => {
  return Boolean(url && url.startsWith('data:'))
}

/**
 * Check if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false
  return !isBlobUrl(url) && (url.startsWith('http') || url.startsWith('/') || isDataUrl(url))
}

/**
 * Get a safe fallback image URL
 */
export const getFallbackImageUrl = (): string => {
  return '/placeholder-image.svg'
}

/**
 * Convert file to base64 data URL
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Create a temporary blob URL for preview (should not be stored)
 */
export const createPreviewBlobUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revoke a blob URL to free memory
 */
export const revokeBlobUrl = (url: string): void => {
  if (isBlobUrl(url)) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Clean up blob URLs from an object recursively
 */
export const cleanupBlobUrls = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanupBlobUrls(item))
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key.includes('image') || key.includes('photo') || key.includes('url')) {
        // Check if this is an image-related field
        if (typeof value === 'string' && isBlobUrl(value)) {
          cleaned[key] = getFallbackImageUrl()
        } else {
          cleaned[key] = cleanupBlobUrls(value)
        }
      } else {
        cleaned[key] = cleanupBlobUrls(value)
      }
    }
    return cleaned
  }
  
  return obj
}

/**
 * Migrate blob URLs in localStorage data
 */
export const migrateBlobUrlsInStorage = (): void => {
  const keys = Object.keys(localStorage)
  let totalFixed = 0

  keys.forEach(key => {
    if (key.startsWith('anihan_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '')
        if (Array.isArray(data)) {
          let hasUpdates = false
          data.forEach(item => {
            const cleaned = cleanupBlobUrls(item)
            if (JSON.stringify(cleaned) !== JSON.stringify(item)) {
              Object.assign(item, cleaned)
              hasUpdates = true
              totalFixed++
            }
          })
          if (hasUpdates) {
            localStorage.setItem(key, JSON.stringify(data))
          }
        }
      } catch (e) {
        // Skip non-JSON data
      }
    }
  })

  if (totalFixed > 0) {
    console.log(`✅ Fixed ${totalFixed} broken blob URLs in localStorage`)
  }
}

/**
 * Get a safe image URL, replacing blob URLs with fallback
 */
export const getSafeImageUrl = (url?: string): string => {
  if (!url) return getFallbackImageUrl()
  if (isBlobUrl(url)) return getFallbackImageUrl()
  return url
}

/**
 * Get the full image URL - converts relative paths to backend URLs
 */
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return getFallbackImageUrl()
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a blob URL, return as is
  if (isBlobUrl(imageUrl)) {
    return imageUrl
  }
  
  // If it's a data URL, return as is
  if (isDataUrl(imageUrl)) {
    return imageUrl
  }
  
  // For relative paths, try to use the backend URL
  // Backend serves images from /photos, /images, or /uploads
  if (imageUrl.startsWith('/photos/') || imageUrl.startsWith('/images/') || imageUrl.startsWith('/uploads/')) {
    const backendUrl = (import.meta as any).env?.VITE_API_BASE_URL 
      ? (import.meta as any).env.VITE_API_BASE_URL.replace('/api/v1', '')
      : 'http://localhost:3000'
    
    // URL encode the filename part (handles spaces in filenames)
    const pathParts = imageUrl.split('/')
    const filename = pathParts[pathParts.length - 1]
    const encodedFilename = encodeURIComponent(filename)
    const encodedPath = pathParts.slice(0, -1).join('/') + '/' + encodedFilename
    
    return `${backendUrl}${encodedPath}`
  }
  
  // For other relative paths, try Vite's public folder first, then backend
  const backendUrl = (import.meta as any).env?.VITE_API_BASE_URL 
    ? (import.meta as any).env.VITE_API_BASE_URL.replace('/api/v1', '')
    : 'http://localhost:3000'
  
  // Try the path as-is first (Vite serves public folder)
  // If that fails, the ImageWithFallback component will handle it
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
}