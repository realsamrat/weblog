'use client'

import dynamic from 'next/dynamic'

// Lazy load AnimatedPostTitle with ssr: false in client component
const AnimatedPostTitle = dynamic(() => import('@/components/animated-post-title'), {
  loading: () => <h1 className="font-sf-pro-display text-[32px] sm:text-[38px] lg:text-[48px] xl:text-[58px] font-bold leading-[1.1] tracking-[-0.02em] text-white opacity-0">Loading...</h1>,
  ssr: false
})

interface HeroTitleSectionProps {
  title: string
}

export default function HeroTitleSection({ title }: HeroTitleSectionProps) {
  return (
    <div className="relative z-20">
      <AnimatedPostTitle 
        title={title}
        className="font-sf-pro-display text-[32px] sm:text-[38px] lg:text-[48px] xl:text-[58px] font-bold leading-[1.1] tracking-[-0.02em] text-white"
      />
    </div>
  )
}