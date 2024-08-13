import React from 'react'
import SearchBox from './SearchBox'


const Hero = () => {
  return (
    <div className="h-[100vh] bg-[url('/book_store.jpg')] accent-[#14220f] ">
        <div className='max-w-5xl mx-auto mb-auto pl-4'>
            <h2 className='sm:text-5xl text-4xl font-bold text-white pt-32 '>
                Find your books here
            </h2>
            <h4 className='sm:text-2xl text-xl text-white pt-5 '> 
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio, placeat consectetur.
            </h4>
            <SearchBox />
        </div>
    </div>
  )
}

export default Hero
