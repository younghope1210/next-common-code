import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Skin from '../../../public/skin.jpg'


const FinishPage = () => {
  return (
    <div className='text-2xl font-bold text-center my-32 '>
      <div>

      <Image 
        src={Skin}
        alt='skin'
        width={0}
        height={0}
        sizes='100vw'
        className='w-[500px] mx-auto mb-8'
      />

        <h2>
          <span className='text-green-800'>
          Your order is complete.</span>
          <span className='block mt-2'>Thank you.</span>
        </h2>
        
        
      </div>
    </div>
  )
}

export default FinishPage 
