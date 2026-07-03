'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  images: { src: string; alt: string }[]
  className?: string
  height?: number
  smallDots?: boolean
}

export function ImageCarousel({ images, className = '', height = 240, smallDots = false }: ImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  React.useEffect(() => {
    if (!api || images.length <= 1) return
    const timer = setInterval(() => {
      api.scrollNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [api, images.length])

  if (!images.length) return null

  return (
    <div className={cn('relative', className)}>
      <Carousel setApi={setApi} opts={{ loop: true, duration: 30 }}>
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i}>
              <div
                className="relative w-full overflow-hidden rounded-lg"
                style={{ height }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes={height <= 160 ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 672px'}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#252C27', border: 'none' }} />
            <CarouselNext className="right-2" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#252C27', border: 'none' }} />
            <div className={`flex justify-center ${smallDots ? 'gap-1 mt-1' : 'gap-1.5 mt-2'}`}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className="rounded-full border-0 p-0 transition-colors duration-150"
                  style={{
                    backgroundColor: i === current ? '#9FBF47' : '#BBB5A9',
                    width: smallDots ? '6px' : '10px',
                    height: smallDots ? '6px' : '10px',
                    minWidth: smallDots ? '6px' : '10px',
                    minHeight: smallDots ? '6px' : '10px',
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}
