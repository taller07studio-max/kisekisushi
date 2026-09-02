import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Business = {
  id: string
  name: string
  description: string | null
  whatsapp: string | null
  city: string | null
  logo_url: string | null
  has_catalog: boolean
  has_cart: boolean
}

export type ProductItem = {
  id: string
  name: string
  price: number
  active?: boolean
  order?: number
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  options: ProductItem[] | null
  extras: ProductItem[] | null
  categoryAssignments: { categoryId: string; subcategoryId: string | null }[]
}

export async function getBusiness(): Promise<Business | null> {
  console.log('NEXT_PUBLIC_BUSINESS_ID:', process.env.NEXT_PUBLIC_BUSINESS_ID)
  const { data, error } = await getClient()
    .from('businesses')
    .select('id, name, description, whatsapp, city, logo_url, has_catalog, has_cart')
    .eq('id', process.env.NEXT_PUBLIC_BUSINESS_ID!)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data
}

export type Subcategory = {
  id: string
  name: string
  slug: string
  order_index: number | null
}

export type Category = {
  id: string
  name: string
  slug: string
  image_url: string | null
  order_index: number | null
  subcategories: Subcategory[]
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getClient()
    .from('categories')
    .select('id, name, slug, image_url, order_index, subcategories(id, name, slug, order_index)')
    .eq('business_id', process.env.NEXT_PUBLIC_BUSINESS_ID!)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data ?? []
}

export type Branch = {
  id: string
  name: string
  whatsapp: string | null
}

export async function getBranches(): Promise<Branch[]> {
  const { data, error } = await getClient()
    .from('branches')
    .select('id, name, whatsapp')
    .eq('business_id', process.env.NEXT_PUBLIC_BUSINESS_ID!)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching branches:', error)
    return []
  }

  return data ?? []
}

export async function getProducts(): Promise<Product[]> {
  const client = getClient()

  const { data: productsData, error: productsError } = await client
    .from('products')
    .select('id, name, description, price, image_url, options, extras')
    .eq('business_id', process.env.NEXT_PUBLIC_BUSINESS_ID!)
    .eq('active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('Error fetching products:', productsError)
    return []
  }

  if (!productsData || productsData.length === 0) return []

  const productIds = productsData.map((p) => p.id)

  const { data: assignmentsData } = await client
    .from('product_categories')
    .select('product_id, category_id, subcategory_id')
    .in('product_id', productIds)

  const assignments = assignmentsData ?? []

  const result = productsData.map((product) => ({
    ...product,
    categoryAssignments: assignments
      .filter((a) => a.product_id === product.id)
      .map((a) => ({
        categoryId: a.category_id,
        subcategoryId: a.subcategory_id ?? null,
      })),
  }))

  return result
}
