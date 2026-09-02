'use client'

import { useCallback, useState } from 'react'
import { Contact } from '@/components/contact'
import { DishModal } from '@/components/dish-modal'
import { Featured } from '@/components/featured'
import { Hero } from '@/components/hero'
import { MenuSection } from '@/components/menu-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { Story } from '@/components/story'
import { WhatsAppCta } from '@/components/whatsapp-cta'
import { FloatingOrder } from '@/components/floating-order'
import { featuredDishes, type Dish } from '@/lib/menu'

export default function Page() {
  const [selected, setSelected] = useState<Dish | null>(null)

  const handleSelect = useCallback((dish: Dish) => setSelected(dish), [])
  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Featured dishes={featuredDishes} onSelect={handleSelect} />
        <MenuSection onSelect={handleSelect} />
        <Story />
        <WhatsAppCta />
        <Contact />
      </main>
      <SiteFooter />
      <FloatingOrder hidden={selected !== null} />
      <DishModal dish={selected} onClose={handleClose} />
    </>
  )
}
