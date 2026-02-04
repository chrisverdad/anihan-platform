export interface WasteCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SourceWasteSubmission {
  id: string
  vendor_id: string
  category_id: string
  title: string
  description: string
  quantity: number
  unit: 'kg' | 'pieces' | 'baskets' | 'bags' | 'boxes' | 'liters'
  condition: 'fresh' | 'slightly_damaged' | 'overripe' | 'bruised' | 'expired' | 'other'
  location: string
  pickup_date: string
  estimated_value?: number
  image_url?: string
  status: 'pending' | 'approved' | 'rejected' | 'collected' | 'processed'
  admin_notes?: string
  rejection_reason?: string
  actual_value?: number
  submitted_at: string
  processed_at?: string
  category?: WasteCategory
  vendor?: User
}

export interface User {
  id: string
  email: string
  password?: string
  full_name: string
  role: 'vendor' | 'admin' | 'user'
  phone?: string
  address?: string
  profile_photo?: string
  created_at: string
  updated_at: string
  is_active: boolean
  // Vendor-specific fields
  vendor_status?: 'pending' | 'approved' | 'rejected'
  business_name?: string
  business_type?: string
  business_license?: string // File URL or base64
  years_in_business?: string
  approval_notes?: string
  approved_by?: string
  approved_at?: string
}

export interface WasteType {
  id: string
  name: string
  description: string
  image_url: string
  category: 'fruit' | 'vegetable' | 'grain' | 'other'
  damage_level: 'slight' | 'moderate' | 'severe'
}

export interface WasteSubmission {
  id: string
  _id?: string // Backend MongoDB ID
  user_id?: string
  vendor?: string | { _id: string; full_name: string; email: string } // Backend vendor reference
  title?: string // Backend field
  category?: string // Backend field
  condition?: string // Backend field
  waste_type_id?: string
  quantity: number
  unit: 'kg' | 'pieces' | 'baskets' | 'bags' | 'boxes' | 'liters'
  description?: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  submitted_at?: string
  createdAt?: string // Backend field
  processed_at?: string
  waste_type?: WasteType
  user?: User
}

export interface QuantityHistory {
  id: string
  inventory_item_id: string
  adjustment_type: 'add' | 'subtract' | 'set'
  quantity_change: number
  previous_quantity: number
  new_quantity: number
  reason: string
  adjusted_by: string
  adjusted_at: string
  notes?: string
}

export interface InventoryItem {
  id: string
  vendor_id: string
  product_name: string
  description: string
  category: 'compost' | 'fertilizer' | 'preserved_food' | 'processed_food' | 'other'
  quantity: number
  unit: 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes'
  price_per_unit: number
  total_value: number
  source_waste_submission_id?: string
  image_url?: string
  is_available: boolean
  created_at: string
  updated_at: string
  waste_submission?: WasteSubmission
  quantity_history?: QuantityHistory[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'compost' | 'fertilizer' | 'preserved_food' | 'processed_food' | 'other'
  image_url?: string
  stock_quantity: number
  unit: 'kg' | 'bags' | 'bottles' | 'pieces' | 'jars' | 'boxes'
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_price: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: 'cash' | 'gcash'
  payment_reference?: string // For GCash number or cash reference
  delivery_status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  delivery_address: string
  delivery_notes?: string
  order_date: string
  delivery_date?: string
  notes?: string
  product?: Product
  user?: User
}

export interface Delivery {
  id: string
  order_id: string
  delivery_person?: string
  delivery_vehicle?: string
  pickup_time?: string
  delivery_time?: string
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  notes?: string
  created_at: string
  updated_at: string
  order?: Order
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  role: 'vendor' | 'user'
  phone?: string
  address?: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
