import React from 'react'

import Image from 'next/image'

const BookCard = ({coverId}) => {

  const coverImage = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
  
  return (
   
      <div className='flex items-center justify-center mt-10'>
        <Image 
          src={coverImage}
          alt="book cover"
          width={185}
          height={275}
          className='h-[275px] mt-[10%] shadow-xl border-solid border-[10px] border-white'

        />
      </div>

  )
}

export default BookCard
