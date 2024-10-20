import React, { useState, useEffect } from 'react'

const TawkChat = () => {
  const [isLoading, setIsLoading] = useState(true) // State to track iframe loading

  useEffect(() => {
    // Simulating loading event listener on iframe
    const iframe = document.getElementById('tawk-iframe')
    if (iframe) {
      iframe.onload = () => setIsLoading(false) // Hide loading spinner when iframe is loaded
    }
  }, [])

  return (
    <>
      <div
        style={{
          backgroundImage:
            'url("https://www.benmvp.com/images/post/how-to-create-circle-svg-gradient-loading-spinner/loading-spinner-final.svg") no-repeat center center ',
        }}
      >
        <iframe
          id="tawk-iframe"
          src="https://tawk.to/chat/66c745b750c10f7a009f4bce/1i5t6gli3"
          height="680"
          width="100%"
          loading="lazy"
          style={{ border: 'none' }} // Hide the default iframe border
        ></iframe>
      </div>
    </>
  )
}

export default TawkChat
