import React from 'react'

const Pagination = ({ total, limit, page, setPage }) => {
  
  const numPages = Math.ceil(total / limit);

  return (
    <div className='flex items-center justify-center mt-32'>
        {page !== 1 && (
            <button 
              onClick={() => setPage(page - 1)} disabled={page === 1}
              className='font-bold text-gray-500 hover:text-black'
            >
              &lt;
            </button>
          )
        }
   
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : undefined}
            className={`p-2 m-2 text-gray-500 hover:font-bold ${
              Number(page) === i + 1 ? 'bg-[#6930e2]  text-white px-4' : ''
            } `}
          >
            {i + 1}
          </button>
        ))}
    {page !== numPages && (   
      <button 
        onClick={() => setPage(page + 1)} 
        disabled={page === numPages}
        className='font-bold text-gray-500 hover:text-black'
      >
        &gt;
      </button>
       )
    }  
    </div>
  )
}

export default Pagination
