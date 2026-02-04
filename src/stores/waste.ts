import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WasteSubmission, WasteType, InventoryItem, QuantityHistory, WasteCategory, SourceWasteSubmission } from '@/types'
import { useAuthStore } from './auth'
import { useUsersStore } from './users'
import { convertFileToBase64, migrateBlobUrlsInStorage } from '@/utils/imageUtils'

export const useWasteStore = defineStore('waste', () => {
  const submissions = ref<WasteSubmission[]>([])
  const wasteTypes = ref<WasteType[]>([])
  const inventoryItems = ref<InventoryItem[]>([])
  const wasteCategories = ref<WasteCategory[]>([])
  const productCategories = ref<Array<{id: string, name: string, description: string}>>([
    { id: 'compost', name: 'Compost', description: 'Organic compost made from waste materials' },
    { id: 'fertilizer', name: 'Fertilizer', description: 'Natural fertilizers derived from waste' },
    { id: 'preserved_food', name: 'Preserved Food', description: 'Food products preserved from waste materials' },
    { id: 'processed_food', name: 'Processed Food', description: 'Processed food items made from waste' },
    { id: 'other', name: 'Other', description: 'Other products made from waste materials' }
  ])
  const sourceWasteSubmissions = ref<SourceWasteSubmission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data
  const mockWasteCategories: WasteCategory[] = [
    {
      id: '1',
      name: 'Fruits',
      description: 'Fresh and processed fruits',
      color: '#f59e0b',
      icon: 'SunIcon',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Vegetables',
      description: 'Fresh and processed vegetables',
      color: '#10b981',
      icon: 'SunIcon',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Grains',
      description: 'Rice, wheat, and other grains',
      color: '#8b5cf6',
      icon: 'CubeIcon',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Dairy',
      description: 'Milk, cheese, and dairy products',
      color: '#06b6d4',
      icon: 'HeartIcon',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Meat',
      description: 'Fresh and processed meat products',
      color: '#ef4444',
      icon: 'FireIcon',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const mockSourceWasteSubmissions: SourceWasteSubmission[] = [
    {
      id: '1',
      vendor_id: '2',
      category_id: '1',
      title: 'Overripe Bananas',
      description: 'Bananas from yesterday\'s harvest that are too ripe for sale',
      quantity: 25,
      unit: 'kg',
      condition: 'overripe',
      location: 'Public Market, Butuan City',
      pickup_date: '2024-12-20T10:00:00Z',
      estimated_value: 500,
      image_url: '/images/overripe-bananas.jpg',
      status: 'pending',
      submitted_at: '2024-12-15T18:30:00Z',
      category: mockWasteCategories[0],
      vendor: {
        id: '2',
        email: 'vendor@anihan.com',
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        is_active: true
      }
    },
    {
      id: '2',
      vendor_id: '4',
      category_id: '2',
      title: 'Bruised Tomatoes',
      description: 'Tomatoes with minor bruises from transport',
      quantity: 15,
      unit: 'pieces',
      condition: 'slightly_damaged',
      location: 'Farmers Market, Butuan City',
      pickup_date: '2024-12-21T14:00:00Z',
      estimated_value: 300,
      image_url: '/images/bruised-tomatoes.jpg',
      status: 'approved',
      submitted_at: '2024-12-15T00:45:00Z',
      category: mockWasteCategories[1],
      vendor: {
        id: '4',
        email: 'vendor2@anihan.com',
        full_name: 'Juan Dela Cruz',
        role: 'vendor',
        phone: '+63 912 345 6785',
        address: 'Farmers Market, Butuan City',
        created_at: '2024-01-20T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
        is_active: true
      }
    },
    {
      id: '3',
      vendor_id: '5',
      category_id: '1',
      title: 'Damaged Mangoes',
      description: 'Mangoes damaged during transport',
      quantity: 8,
      unit: 'pieces',
      condition: 'bruised',
      location: 'Central Market, Butuan City',
      pickup_date: '2024-12-19T09:00:00Z',
      estimated_value: 200,
      image_url: '/images/damaged-mangoes.jpg',
      status: 'processed',
      submitted_at: '2024-12-13T17:15:00Z',
      processed_at: '2024-12-13T19:30:00Z',
      category: mockWasteCategories[0],
      vendor: {
        id: '5',
        email: 'vendor3@anihan.com',
        full_name: 'Ana Rodriguez',
        role: 'vendor',
        phone: '+63 912 345 6784',
        address: 'Central Market, Butuan City',
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-01-25T00:00:00Z',
        is_active: true
      }
    }
  ]

  const mockWasteTypes: WasteType[] = [
    {
      id: '1',
      name: 'Overripe Bananas',
      description: 'Bananas that are too ripe for sale',
      image_url: '/photos/overripe banana.jpg',
      category: 'fruit',
      damage_level: 'moderate'
    },
    {
      id: '2',
      name: 'Bruised Tomatoes',
      description: 'Tomatoes with minor bruises',
      image_url: '/photos/bruised tomatos.jpg',
      category: 'vegetable',
      damage_level: 'slight'
    },
    {
      id: '3',
      name: 'Damaged Mangoes',
      description: 'Mangoes with severe damage',
      image_url: '/photos/damage mangoes.jpg',
      category: 'fruit',
      damage_level: 'severe'
    },
    {
      id: '4',
      name: 'Wilted Lettuce',
      description: 'Lettuce that has started to wilt',
      image_url: '/photos/wilted lettuce.jpg',
      category: 'vegetable',
      damage_level: 'moderate'
    },
    {
      id: '5',
      name: 'Damaged Apples',
      description: 'Apples with bruises and cuts',
      image_url: '/photos/damage apples.webp',
      category: 'fruit',
      damage_level: 'moderate'
    },
    {
      id: '6',
      name: 'Overripe Papayas',
      description: 'Papayas that are too soft for sale',
      image_url: '/photos/overripe papaya.jpg',
      category: 'fruit',
      damage_level: 'moderate'
    },
    {
      id: '7',
      name: 'Banana Compost',
      description: 'Compost made from overripe bananas',
      image_url: '/photos/banana compost.jpg',
      category: 'fruit',
      damage_level: 'moderate'
    },
    {
      id: '8',
      name: 'Dairy Products',
      description: 'Expired or damaged dairy products',
      image_url: '/photos/dairy.jpg',
      category: 'other',
      damage_level: 'moderate'
    },
    {
      id: '9',
      name: 'Grains',
      description: 'Damaged or spoiled grains',
      image_url: '/photos/grains.jpg',
      category: 'grain',
      damage_level: 'slight'
    },
    {
      id: '10',
      name: 'Mango Jam',
      description: 'Processed product from damaged mangoes',
      image_url: '/photos/mango jam.webp',
      category: 'fruit',
      damage_level: 'moderate'
    },
    {
      id: '11',
      name: 'Meat Products',
      description: 'Expired or damaged meat products',
      image_url: "/photos/meat'.jpeg",
      category: 'other',
      damage_level: 'severe'
    },
    {
      id: '12',
      name: 'Tomato Fertilizer',
      description: 'Fertilizer made from bruised tomatoes',
      image_url: '/photos/tomato fertilizer.jpg',
      category: 'vegetable',
      damage_level: 'moderate'
    },
    {
      id: '13',
      name: 'Vegetable Compost',
      description: 'Compost made from vegetable waste',
      image_url: '/photos/vegetable compost.webp',
      category: 'vegetable',
      damage_level: 'moderate'
    },
    {
      id: '14',
      name: 'Mixed Vegetables',
      description: 'Various damaged or spoiled vegetables',
      image_url: '/photos/vegetables.webp',
      category: 'vegetable',
      damage_level: 'moderate'
    }
  ]

  const mockSubmissions: WasteSubmission[] = [
    {
      id: '1',
      user_id: '2',
      waste_type_id: '1',
      quantity: 25,
      unit: 'kg',
      description: 'Bananas from yesterday\'s harvest',
      status: 'pending',
      submitted_at: '2024-12-15T18:30:00Z',
      createdAt: '2024-12-15T18:30:00Z',
      title: 'Overripe Bananas',
      category: 'fruit',
      condition: 'overripe',
      user: {
        id: '2',
        email: 'vendor@anihan.com',
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[0]
    },
    {
      id: '2',
      user_id: '2',
      waste_type_id: '2',
      quantity: 15,
      unit: 'pieces',
      description: 'Tomatoes with minor bruises',
      status: 'approved',
      submitted_at: '2024-12-15T00:45:00Z',
      createdAt: '2024-12-15T00:45:00Z',
      title: 'Bruised Tomatoes',
      category: 'vegetable',
      condition: 'slightly_damaged',
      user: {
        id: '2',
        email: 'vendor@anihan.com',
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[1]
    },
    {
      id: '3',
      user_id: '2',
      waste_type_id: '3',
      quantity: 8,
      unit: 'pieces',
      description: 'Mangoes damaged during transport',
      status: 'processed',
      submitted_at: '2024-12-13T17:15:00Z',
      createdAt: '2024-12-13T17:15:00Z',
      processed_at: '2024-12-13T19:30:00Z',
      title: 'Damaged Mangoes',
      category: 'fruit',
      condition: 'bruised',
      user: {
        id: '2',
        email: 'vendor@anihan.com',
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[2]
    },
    {
      id: '4',
      user_id: '2',
      waste_type_id: '4',
      quantity: 12,
      unit: 'pieces',
      description: 'Lettuce that has started to wilt',
      status: 'rejected',
      submitted_at: '2024-12-12T22:20:00Z',
      createdAt: '2024-12-12T22:20:00Z',
      title: 'Wilted Lettuce',
      category: 'vegetable',
      condition: 'overripe',
      user: {
        id: '2',
        email: 'vendor@anihan.com',
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[3]
    },
    {
      id: '5',
      user_id: '2',
      waste_type_id: '1',
      quantity: 20,
      unit: 'pieces',
      description: 'Overripe bananas from current user',
      status: 'processed',
      submitted_at: '2024-10-24T17:00:00Z',
      createdAt: '2024-10-24T17:00:00Z',
      processed_at: '2024-10-24T19:00:00Z',
      title: 'Overripe Bananas',
      category: 'fruit',
      condition: 'overripe',
      user: {
        id: '9',
        email: 'vendor3@example.com',
        full_name: 'Carlos Rodriguez',
        role: 'vendor',
        phone: '+63 912 345 6780',
        address: 'Butuan City, Agusan del Norte',
        created_at: '2024-10-24T00:00:00Z',
        updated_at: '2024-10-24T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[0]
    },
    {
      id: '6',
      user_id: '2',
      waste_type_id: '2',
      quantity: 30,
      unit: 'kg',
      description: 'Bruised tomatoes from current user',
      status: 'processed',
      submitted_at: '2024-10-24T16:00:00Z',
      createdAt: '2024-10-24T16:00:00Z',
      processed_at: '2024-10-24T18:00:00Z',
      title: 'Bruised Tomatoes',
      category: 'vegetable',
      condition: 'slightly_damaged',
      user: {
        id: '9',
        email: 'vendor3@example.com',
        full_name: 'Carlos Rodriguez',
        role: 'vendor',
        phone: '+63 912 345 6780',
        address: 'Butuan City, Agusan del Norte',
        created_at: '2024-10-24T00:00:00Z',
        updated_at: '2024-10-24T00:00:00Z',
        is_active: true
      },
      waste_type: mockWasteTypes[1]
    }
  ]

  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      vendor_id: '2',
      product_name: 'Banana Compost',
      description: 'High-quality compost made from overripe bananas',
      category: 'compost',
      quantity: 50,
      unit: 'kg',
      price_per_unit: 25,
      total_value: 1250,
      source_waste_submission_id: '1',
      image_url: '/placeholder-image.svg',
      is_available: true,
      created_at: '2024-12-13T11:30:00Z',
      updated_at: '2024-12-13T11:30:00Z',
      waste_submission: mockSubmissions[0],
      quantity_history: [
        {
          id: '1',
          inventory_item_id: '1',
          adjustment_type: 'set',
          quantity_change: 50,
          previous_quantity: 0,
          new_quantity: 50,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          adjusted_at: '2024-12-13T11:30:00Z',
          notes: 'Created from processed banana waste'
        }
      ]
    },
    {
      id: '2',
      vendor_id: '2',
      product_name: 'Tomato Fertilizer',
      description: 'Organic fertilizer made from bruised tomatoes',
      category: 'fertilizer',
      quantity: 20,
      unit: 'bags',
      price_per_unit: 150,
      total_value: 3000,
      source_waste_submission_id: '2',
      image_url: '/placeholder-image.svg',
      is_available: true,
      created_at: '2024-12-14T16:45:00Z',
      updated_at: '2024-12-14T16:45:00Z',
      waste_submission: mockSubmissions[1],
      quantity_history: [
        {
          id: '2',
          inventory_item_id: '2',
          adjustment_type: 'set',
          quantity_change: 20,
          previous_quantity: 0,
          new_quantity: 20,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          adjusted_at: '2024-12-14T16:45:00Z',
          notes: 'Created from processed tomato waste'
        }
      ]
    },
    {
      id: '3',
      vendor_id: '2',
      product_name: 'Mango Jam',
      description: 'Sweet jam made from damaged mangoes',
      category: 'preserved_food',
      quantity: 15,
      unit: 'jars',
      price_per_unit: 80,
      total_value: 1200,
      source_waste_submission_id: '3',
      image_url: '/placeholder-image.svg',
      is_available: true,
      created_at: '2024-12-13T11:30:00Z',
      updated_at: '2024-12-13T11:30:00Z',
      waste_submission: mockSubmissions[2],
      quantity_history: [
        {
          id: '3',
          inventory_item_id: '3',
          adjustment_type: 'set',
          quantity_change: 15,
          previous_quantity: 0,
          new_quantity: 15,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          adjusted_at: '2024-12-13T11:30:00Z',
          notes: 'Created from processed mango waste'
        }
      ]
    },
    {
      id: '4',
      vendor_id: '2',
      product_name: 'Vegetable Compost',
      description: 'Mixed vegetable compost from various damaged produce',
      category: 'compost',
      quantity: 30,
      unit: 'kg',
      price_per_unit: 20,
      total_value: 600,
      source_waste_submission_id: '4',
      image_url: '/placeholder-image.svg',
      is_available: true,
      created_at: '2024-12-15T09:15:00Z',
      updated_at: '2024-12-15T09:15:00Z',
      waste_submission: mockSubmissions[0],
      quantity_history: [
        {
          id: '4',
          inventory_item_id: '4',
          adjustment_type: 'set',
          quantity_change: 30,
          previous_quantity: 0,
          new_quantity: 30,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          adjusted_at: '2024-12-15T09:15:00Z',
          notes: 'Created from mixed vegetable waste'
        }
      ]
    }
  ]

  const loadWasteTypes = async () => {
    try {
      // Image path mapping for migration
      const imagePathMap: Record<string, string> = {
        '/images/overripe-bananas.jpg': '/photos/overripe banana.jpg',
        '/images/bruised-tomatoes.jpg': '/photos/bruised tomatos.jpg',
        '/images/damaged-mangoes.jpg': '/photos/damage mangoes.jpg',
        '/images/wilted-lettuce.jpg': '/photos/wilted lettuce.jpg',
        '/images/damaged-apples.jpg': '/photos/damage apples.webp',
        '/images/overripe-papayas.jpg': '/photos/overripe papaya.jpg'
      }
      
      // Check localStorage first
      const storedWasteTypes = localStorage.getItem('anihan_waste_types')
      if (storedWasteTypes) {
        wasteTypes.value = JSON.parse(storedWasteTypes)
        // Migrate old image paths to new ones
        let hasUpdates = false
        wasteTypes.value.forEach((wt: any) => {
          if (wt.image_url && imagePathMap[wt.image_url]) {
            wt.image_url = imagePathMap[wt.image_url]
            hasUpdates = true
          }
        })
        // If we have fewer items than expected, update with all mock data
        if (wasteTypes.value.length < mockWasteTypes.length) {
          wasteTypes.value = [...mockWasteTypes]
          hasUpdates = true
        }
        if (hasUpdates) {
          localStorage.setItem('anihan_waste_types', JSON.stringify(wasteTypes.value))
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 100))
        wasteTypes.value = [...mockWasteTypes]
        // Save to localStorage
        localStorage.setItem('anihan_waste_types', JSON.stringify(wasteTypes.value))
      }
      
      // Ensure data is always available and complete
      if (wasteTypes.value.length === 0 || wasteTypes.value.length < mockWasteTypes.length) {
        wasteTypes.value = [...mockWasteTypes]
        localStorage.setItem('anihan_waste_types', JSON.stringify(wasteTypes.value))
      }
      
      return wasteTypes.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load waste types'
      // Fallback to mock data
      wasteTypes.value = [...mockWasteTypes]
      localStorage.setItem('anihan_waste_types', JSON.stringify(wasteTypes.value))
      throw err
    }
  }

  const loadSubmissions = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedSubmissions = localStorage.getItem('anihan_submissions')
      if (storedSubmissions) {
        submissions.value = JSON.parse(storedSubmissions)
        // Sync user data for existing submissions
        await syncWasteUserData()
      } else {
        await new Promise(resolve => setTimeout(resolve, 200))
        submissions.value = [...mockSubmissions]
        // Save to localStorage
        localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
      }
      
      // Ensure data is always available
      if (submissions.value.length === 0) {
        submissions.value = [...mockSubmissions]
        localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load submissions'
      // Fallback to mock data
      submissions.value = [...mockSubmissions]
      localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
    } finally {
      loading.value = false
    }
  }

  const syncWasteUserData = async () => {
    try {
      const usersStore = useUsersStore()
      await usersStore.loadUsers()
      const allUsers = usersStore.users
      
      let hasUpdates = false
      
      for (const submission of submissions.value) {
        // If submission has hardcoded user data, try to find the real user
        if (submission.user && (submission.user.email === 'vendor3@example.com' || submission.user.full_name === 'Carlos Rodriguez')) {
          const realUser = allUsers.find((u: any) => u.id === submission.user_id)
          if (realUser) {
            submission.user = {
              id: realUser.id,
              email: realUser.email,
              full_name: realUser.full_name,
              role: realUser.role,
              phone: realUser.phone,
              address: realUser.address,
              created_at: realUser.created_at,
              updated_at: realUser.updated_at,
              is_active: realUser.is_active
            }
            hasUpdates = true
          }
        }
      }
      
      if (hasUpdates) {
        localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
      }
    } catch (error) {
      console.error('Failed to sync waste user data:', error)
    }
  }

  const submitWaste = async (submissionData: Omit<WasteSubmission, 'id' | 'submitted_at' | 'status' | 'user' | 'waste_type'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const wasteType = wasteTypes.value.find(wt => wt.id === submissionData.waste_type_id)
      if (!wasteType) throw new Error('Waste type not found')
      
      // Get real user data from auth store
      const authStore = useAuthStore()
      const currentUser = authStore.user
      
      if (!currentUser) {
        throw new Error('User not authenticated')
      }
      
      const newSubmission: WasteSubmission = {
        ...submissionData,
        id: (submissions.value.length + 1).toString(),
        status: 'pending',
        submitted_at: new Date().toISOString(),
        user: {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.full_name,
          role: currentUser.role,
          phone: currentUser.phone,
          address: currentUser.address,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
          is_active: currentUser.is_active
        },
        waste_type: wasteType
      }
      
      submissions.value.unshift(newSubmission)
      // Save to localStorage
      localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
      return newSubmission
    } catch (err: any) {
      error.value = err.message || 'Failed to submit waste'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWasteStatus = async (id: string, status: WasteSubmission['status']) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = submissions.value.findIndex(submission => submission.id === id)
      if (index !== -1) {
        submissions.value[index] = {
          ...submissions.value[index],
          status,
          processed_at: status === 'processed' ? new Date().toISOString() : submissions.value[index].processed_at
        }
        // Save to localStorage
        localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
        return submissions.value[index]
      }
      throw new Error('Submission not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update waste status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWaste = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = submissions.value.findIndex(submission => submission.id === id)
      if (index !== -1) {
        submissions.value.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('anihan_submissions', JSON.stringify(submissions.value))
        return true
      }
      throw new Error('Submission not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete waste submission'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getWasteStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return {
        total: submissions.value.length,
        pending: submissions.value.filter(s => s.status === 'pending').length,
        approved: submissions.value.filter(s => s.status === 'approved').length,
        processed: submissions.value.filter(s => s.status === 'processed').length,
        rejected: submissions.value.filter(s => s.status === 'rejected').length,
        totalQuantity: submissions.value.reduce((sum, s) => sum + s.quantity, 0)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch waste stats'
      throw err
    }
  }

  const loadInventoryItems = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedInventory = localStorage.getItem('anihan_inventory')
      if (storedInventory) {
        inventoryItems.value = JSON.parse(storedInventory)
        // Migrate any blob URLs to placeholder images
        migrateBlobUrlsInStorage()
      } else {
        await new Promise(resolve => setTimeout(resolve, 200))
        inventoryItems.value = [...mockInventoryItems]
        // Save to localStorage
        localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
      }
      
      // Ensure data is always available
      if (inventoryItems.value.length === 0) {
        inventoryItems.value = [...mockInventoryItems]
        localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load inventory items'
      // Fallback to mock data
      inventoryItems.value = [...mockInventoryItems]
      localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
    } finally {
      loading.value = false
    }
  }

  const addToInventory = async (inventoryData: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'total_value'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Source submission is now optional
      let sourceSubmission = undefined
      if (inventoryData.source_waste_submission_id) {
        sourceSubmission = submissions.value.find(s => s.id === inventoryData.source_waste_submission_id)
      }
      
      const newInventoryItem: InventoryItem = {
        ...inventoryData,
        id: (inventoryItems.value.length + 1).toString(),
        total_value: inventoryData.quantity * inventoryData.price_per_unit,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        waste_submission: sourceSubmission
      }
      
      inventoryItems.value.unshift(newInventoryItem)
      // Save to localStorage
      localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
      return newInventoryItem
    } catch (err: any) {
      error.value = err.message || 'Failed to add item to inventory'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = inventoryItems.value.findIndex(item => item.id === id)
      if (index !== -1) {
        inventoryItems.value[index] = {
          ...inventoryItems.value[index],
          ...updates,
          updated_at: new Date().toISOString(),
          total_value: updates.quantity && updates.price_per_unit 
            ? updates.quantity * updates.price_per_unit 
            : inventoryItems.value[index].total_value
        }
        // Save to localStorage
        localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
        return inventoryItems.value[index]
      }
      throw new Error('Inventory item not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteInventoryItem = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = inventoryItems.value.findIndex(item => item.id === id)
      if (index !== -1) {
        inventoryItems.value.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
        return true
      }
      throw new Error('Inventory item not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete inventory item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const adjustInventoryQuantity = async (
    inventoryItemId: string, 
    adjustmentType: 'add' | 'subtract' | 'set',
    quantityChange: number,
    reason: string,
    adjustedBy: string,
    notes?: string
  ) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = inventoryItems.value.findIndex(item => item.id === inventoryItemId)
      if (index === -1) throw new Error('Inventory item not found')
      
      const item = inventoryItems.value[index]
      const previousQuantity = item.quantity
      let newQuantity: number
      
      switch (adjustmentType) {
        case 'add':
          newQuantity = previousQuantity + quantityChange
          break
        case 'subtract':
          newQuantity = Math.max(0, previousQuantity - quantityChange)
          break
        case 'set':
          newQuantity = quantityChange
          break
        default:
          throw new Error('Invalid adjustment type')
      }
      
      // Create quantity history entry
      const historyEntry: QuantityHistory = {
        id: `${inventoryItemId}-${Date.now()}`,
        inventory_item_id: inventoryItemId,
        adjustment_type: adjustmentType,
        quantity_change: adjustmentType === 'set' ? newQuantity : quantityChange,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reason,
        adjusted_by: adjustedBy,
        adjusted_at: new Date().toISOString(),
        notes
      }
      
      // Update inventory item
      inventoryItems.value[index] = {
        ...item,
        quantity: newQuantity,
        total_value: newQuantity * item.price_per_unit,
        updated_at: new Date().toISOString(),
        quantity_history: [...(item.quantity_history || []), historyEntry]
      }
      
      // Save to localStorage
      localStorage.setItem('anihan_inventory', JSON.stringify(inventoryItems.value))
      return inventoryItems.value[index]
    } catch (err: any) {
      error.value = err.message || 'Failed to adjust inventory quantity'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Waste Category Management
  const loadWasteCategories = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedCategories = localStorage.getItem('anihan_waste_categories')
      if (storedCategories) {
        wasteCategories.value = JSON.parse(storedCategories)
      } else {
        await new Promise(resolve => setTimeout(resolve, 200))
        wasteCategories.value = [...mockWasteCategories]
        // Save to localStorage
        localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
      }
      
      // Ensure data is always available
      if (wasteCategories.value.length === 0) {
        wasteCategories.value = [...mockWasteCategories]
        localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load waste categories'
      // Fallback to mock data
      wasteCategories.value = [...mockWasteCategories]
      localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
    } finally {
      loading.value = false
    }
  }

  const createWasteCategory = async (categoryData: Omit<WasteCategory, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newCategory: WasteCategory = {
        id: (wasteCategories.value.length + 1).toString(),
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      wasteCategories.value.push(newCategory)
      // Save to localStorage
      localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
      return newCategory
    } catch (err: any) {
      error.value = err.message || 'Failed to create waste category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWasteCategory = async (id: string, updates: Partial<WasteCategory>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = wasteCategories.value.findIndex(category => category.id === id)
      if (index !== -1) {
        wasteCategories.value[index] = {
          ...wasteCategories.value[index],
          ...updates,
          updated_at: new Date().toISOString()
        }
        // Save to localStorage
        localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
        return wasteCategories.value[index]
      }
      throw new Error('Waste category not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update waste category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWasteCategory = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = wasteCategories.value.findIndex(category => category.id === id)
      if (index !== -1) {
        wasteCategories.value.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('anihan_waste_categories', JSON.stringify(wasteCategories.value))
        return true
      }
      throw new Error('Waste category not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete waste category'
      throw err
    } finally {
      loading.value = false
    }
  }


  // Product Category Management
  const loadProductCategories = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedCategories = localStorage.getItem('anihan_product_categories')
      if (storedCategories) {
        productCategories.value = JSON.parse(storedCategories)
      } else {
        await new Promise(resolve => setTimeout(resolve, 200))
        // Keep default categories
        localStorage.setItem('anihan_product_categories', JSON.stringify(productCategories.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load product categories'
    } finally {
      loading.value = false
    }
  }

  const createProductCategory = async (categoryData: {name: string, description: string}) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newCategory = {
        id: (productCategories.value.length + 1).toString(),
        name: categoryData.name,
        description: categoryData.description
      }
      
      productCategories.value.push(newCategory)
      localStorage.setItem('anihan_product_categories', JSON.stringify(productCategories.value))
      return newCategory
    } catch (err: any) {
      error.value = err.message || 'Failed to create product category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProductCategory = async (categoryId: string, categoryData: {name: string, description: string}) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = productCategories.value.findIndex(cat => cat.id === categoryId)
      if (index !== -1) {
        productCategories.value[index] = {
          ...productCategories.value[index],
          ...categoryData
        }
        localStorage.setItem('anihan_product_categories', JSON.stringify(productCategories.value))
        return productCategories.value[index]
      }
      throw new Error('Category not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update product category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProductCategory = async (categoryId: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = productCategories.value.findIndex(cat => cat.id === categoryId)
      if (index !== -1) {
        productCategories.value.splice(index, 1)
        localStorage.setItem('anihan_product_categories', JSON.stringify(productCategories.value))
        return true
      }
      throw new Error('Category not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to sync vendor data for submissions
  const syncVendorDataForSubmissions = async () => {
    try {
      // Load users to get vendor data
      const storedUsers = localStorage.getItem('anihan_users')
      if (!storedUsers) return
      
      const users = JSON.parse(storedUsers)
      
      // Update submissions with vendor data
      sourceWasteSubmissions.value = sourceWasteSubmissions.value.map(submission => {
        if (!submission.vendor && submission.vendor_id) {
          const vendor = users.find((user: any) => user.id === submission.vendor_id)
          if (vendor) {
            return {
              ...submission,
              vendor: {
                id: vendor.id,
                email: vendor.email,
                full_name: vendor.full_name,
                role: vendor.role,
                phone: vendor.phone,
                address: vendor.address,
                created_at: vendor.created_at,
                updated_at: vendor.updated_at,
                is_active: vendor.is_active
              }
            }
          }
        }
        return submission
      })
      
      // Save updated submissions
      localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
    } catch (error) {
      console.error('Failed to sync vendor data:', error)
    }
  }

  // Source Waste Submission Management
  const loadSourceWasteSubmissions = async () => {
    loading.value = true
    try {
      // Check localStorage first
      const storedSubmissions = localStorage.getItem('anihan_source_waste_submissions')
      if (storedSubmissions) {
        sourceWasteSubmissions.value = JSON.parse(storedSubmissions)
      } else {
        await new Promise(resolve => setTimeout(resolve, 200))
        sourceWasteSubmissions.value = [...mockSourceWasteSubmissions]
        // Save to localStorage
        localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
      }
      
      // Ensure data is always available
      if (sourceWasteSubmissions.value.length === 0) {
        sourceWasteSubmissions.value = [...mockSourceWasteSubmissions]
        localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
      }
      
      // Sync vendor data for existing submissions
      await syncVendorDataForSubmissions()
    } catch (err: any) {
      error.value = err.message || 'Failed to load source waste submissions'
      // Fallback to mock data
      sourceWasteSubmissions.value = [...mockSourceWasteSubmissions]
      localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
    } finally {
      loading.value = false
    }
  }

  const createSourceWasteSubmission = async (submissionData: any) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const category = wasteCategories.value.find(cat => cat.id === submissionData.category_id)
      
      let imageUrl = undefined
      // Handle image file upload - convert to base64 data URL
      if (submissionData.image_file) {
        try {
          imageUrl = await convertFileToBase64(submissionData.image_file)
          console.log('Image converted to base64 successfully')
        } catch (imageError) {
          console.error('Failed to convert image to base64:', imageError)
          // Continue without image rather than failing the entire submission
        }
      }
      
      const newSubmission: SourceWasteSubmission = {
        id: (sourceWasteSubmissions.value.length + 1).toString(),
        vendor_id: submissionData.vendor_id,
        category_id: submissionData.category_id,
        title: submissionData.title,
        description: submissionData.description,
        quantity: submissionData.quantity,
        unit: submissionData.unit,
        condition: submissionData.condition,
        location: submissionData.location,
        pickup_date: submissionData.pickup_date,
        estimated_value: submissionData.estimated_value || 0,
        image_url: imageUrl,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        category,
        vendor: submissionData.vendor // Include vendor data if provided
      }
      
      sourceWasteSubmissions.value.push(newSubmission)
      // Save to localStorage
      localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
      console.log('Source waste submission created successfully:', newSubmission)
      return newSubmission
    } catch (err: any) {
      error.value = err.message || 'Failed to create source waste submission'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSourceWasteSubmission = async (id: string, updates: any) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = sourceWasteSubmissions.value.findIndex(submission => submission.id === id)
      if (index !== -1) {
        const category = wasteCategories.value.find(cat => cat.id === updates.category_id)
        
        let imageUrl = sourceWasteSubmissions.value[index].image_url
        
        // Handle image file upload - convert to base64 data URL
        if (updates.image_file) {
          try {
            imageUrl = await convertFileToBase64(updates.image_file)
            console.log('Image updated successfully')
          } catch (imageError) {
            console.error('Failed to convert updated image to base64:', imageError)
            // Keep existing image if conversion fails
          }
        }
        
        sourceWasteSubmissions.value[index] = {
          ...sourceWasteSubmissions.value[index],
          ...updates,
          category,
          image_url: imageUrl
        }
        // Save to localStorage
        localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
        console.log('Source waste submission updated successfully:', sourceWasteSubmissions.value[index])
        return sourceWasteSubmissions.value[index]
      }
      throw new Error('Source waste submission not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to update source waste submission'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSourceWasteSubmission = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = sourceWasteSubmissions.value.findIndex(submission => submission.id === id)
      if (index !== -1) {
        sourceWasteSubmissions.value.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('anihan_source_waste_submissions', JSON.stringify(sourceWasteSubmissions.value))
        return true
      }
      throw new Error('Source waste submission not found')
    } catch (err: any) {
      error.value = err.message || 'Failed to delete source waste submission'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Real API methods for waste management
  const fetchWastes = async () => {
    // Always use localStorage data, no backend calls
    loading.value = true
    error.value = null
    try {
      await loadSubmissions()
      return { wastes: submissions.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch wastes'
      return null
    } finally {
      loading.value = false
    }
  }

  const submitWasteToAPI = async (wasteData: any) => {
    // Always use localStorage data, no backend calls
    loading.value = true
    error.value = null
    try {
      // Get current user ID from auth store
      const authStore = useAuthStore()
      const currentUserId = authStore.user?.id || '2'
      
      // Use mock data submission instead of API
      const newSubmission = await submitWaste({
        waste_type_id: wasteData.waste_type_id || '1',
        quantity: wasteData.quantity,
        unit: wasteData.unit,
        description: wasteData.description,
        user_id: currentUserId
      })
      
      // Refresh submissions
      await loadSubmissions()
      return { success: true, data: { waste: newSubmission } }
    } catch (err: any) {
      error.value = err.message || 'Failed to submit waste'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateWasteStatusAPI = async (id: string, statusData: any) => {
    // Always use localStorage data, no backend calls
    loading.value = true
    error.value = null
    try {
      // Use mock data update instead of API
      const updatedSubmission = await updateWasteStatus(id, statusData)
      return { success: true, data: { waste: updatedSubmission } }
    } catch (err: any) {
      error.value = err.message || 'Failed to update waste status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWasteAPI = async (id: string) => {
    // Always use localStorage data, no backend calls
    loading.value = true
    error.value = null
    try {
      // Use mock data delete instead of API
      await deleteWaste(id)
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete waste'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWasteStats = async () => {
    // Always use localStorage data, no backend calls
    loading.value = true
    error.value = null
    try {
      // Use mock data stats instead of API
      const stats = getWasteStats()
      return stats
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch waste stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    submissions,
    wasteTypes,
    inventoryItems,
    wasteCategories,
    productCategories,
    sourceWasteSubmissions,
    loading,
    error,
    loadWasteTypes,
    loadSubmissions,
    submitWaste,
    updateWasteStatus,
    deleteWaste,
    getWasteStats,
    loadInventoryItems,
    addToInventory,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryQuantity,
    loadWasteCategories,
    createWasteCategory,
    updateWasteCategory,
    deleteWasteCategory,
    loadProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    loadSourceWasteSubmissions,
    syncVendorDataForSubmissions,
    createSourceWasteSubmission,
    updateSourceWasteSubmission,
    deleteSourceWasteSubmission,
    // Real API methods
    fetchWastes,
    submitWasteToAPI,
    updateWasteStatusAPI,
    deleteWasteAPI,
    fetchWasteStats
  }
})