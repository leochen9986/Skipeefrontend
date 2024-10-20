import { CCarouselItem, CLink } from '@coreui/react'
import React from 'react'

export const CarouselItemPrimary = ({ imgUrl, title, ctaText, ctaLink }) => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <CCarouselItem className="d-block w-100" key={title}>
      <div
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundColor: 'rgba(0,0,0,0.2)',
          backgroundBlendMode: 'overlay',
          margin: `${screenWidth > 992 ? '60px' : '20px'}`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          height: `${screenWidth > 992 ? '480px' : '360px'}`,
          borderRadius: '10px',
          padding: `${screenWidth > 992 ? '60px 100px' : '20px'}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h2
          className="text-white"
          style={{
            fontSize: `${screenWidth > 992 ? '62px' : '32px'}`,
            maxWidth: `${screenWidth > 992 ? '60%' : '80%'}`,
          }}
        >
          {title}
        </h2>
      </div>
    </CCarouselItem>
  )
}
