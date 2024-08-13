import React from 'react'

const SearchBox = () => {
  return (
    <div>
      <div className='mt-5'>
        <input 
            type="text"  
            placeholder=" 책 이름 검색 " 
            className='w-[300px] h-[50px] rounded-l-md'
        />
        <button 
            className='w-[100px] h-[50px] bg-[#6930e2] text-white rounded-r-md'
        >
            Send
        </button>
      </div>
    </div>
  )
}

export default SearchBox
