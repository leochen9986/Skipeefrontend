import { CCarousel, CCarouselItem } from '@coreui/react'
import React from 'react'
import { CarouselItemPrimary } from './crousel-items/Carouseltem'

export const CarouselPrimary = ({ items }) => {
  return (
    <>
      <CCarousel className="d-block w-100" controls>
        {items.map((item, index) => (
          // <CarouselItemPrimary
          //   key={index}
          //   imgUrl={item.imgUrl}
          //   title={item.title}
          //   ctaText={item.ctaText}
          //   ctaLink={item.ctaLink}
          // />
          <CCarouselItem key={index}>
            <CarouselItemPrimary {...item} />
          </CCarouselItem>
        ))}
      </CCarousel>
    </>
  )
}
