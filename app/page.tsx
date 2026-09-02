import { getBusiness, getProducts, getCategories, getBranches } from '@/lib/business'

export const revalidate = 60
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Catalog from '@/components/Catalog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default async function Home() {
  const business = await getBusiness()

  const whatsapp = business?.whatsapp ?? ''
  const businessName = business?.name ?? 'Mi Negocio'
  const description = business?.description ?? null
  const hasCatalog = business?.has_catalog ?? false
  const hasCart = business?.has_cart ?? false
  const city = business?.city ?? ''
  const logoUrl = business?.logo_url ?? null

  const [products, categories, branches] = await Promise.all([
    hasCatalog ? getProducts() : Promise.resolve([]),
    getCategories(),
    getBranches(),
  ])

  return (
    <>
      <Header logoUrl={logoUrl} businessName={businessName} />
      <main style={{ overflowX: 'hidden' }}>
        <Hero businessWhatsapp={business?.whatsapp ?? null} branches={branches} businessName={businessName} description={description} city={city} />
        {hasCatalog && (
          <Catalog
            products={products}
            categories={categories}
            hasCart={hasCart}
            branches={branches}
            businessName={businessName}
          />
        )}
        <Contact businessWhatsapp={business?.whatsapp ?? null} branches={branches} city={city} businessName={businessName} />
      </main>
      <Footer businessName={businessName} city={city} businessWhatsapp={business?.whatsapp ?? null} branches={branches} />
    </>
  )
}
