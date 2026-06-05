export interface Product {
  id: number
  title: string
  price: number
  stock: number
  image_url: string | null
}

export interface CartRow {
  id: string
  user_id: string
  product_id: number
  quantity: number
}

export interface CartItemFull extends CartRow {
  product: Product
}

export type Role = "user" | "admin" | "superadmin"

export interface Profile {
  id: string       // matches auth.users(id)
  email: string
  role: Role
  created_at: string
}
