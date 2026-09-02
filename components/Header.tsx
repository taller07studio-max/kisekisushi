import { getCategories } from '@/lib/business'
import HeaderClient from './HeaderClient'

type Props = {
  logoUrl: string | null
  businessName: string
}

export default async function Header({ logoUrl, businessName }: Props) {
  const categories = await getCategories()
  return (
    <HeaderClient logoUrl={logoUrl} businessName={businessName} categories={categories} />
  )
}
