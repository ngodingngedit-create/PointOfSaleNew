import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'aejzrj0n'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-02-06'

// Browser client publik tanpa token rahasia
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const isSanityConfigured = Boolean(projectId && projectId.trim() !== '')

export const PRODUCT_QUERY = `*[_type == "product" && isActive == true]{
  _id,
  name,
  category,
  price,
  stock,
  imageUrl
}`
