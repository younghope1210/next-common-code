"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Productproduct from './ProductItem'
import BookCard from './BookCard'
import Pagination from '@/app/pagination/Pagination'



const BookCatalog = () => {

// API 불러올 액션
  const [title, setTitle] = useState("the lord of the rings");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 페이징 처리하는 부분
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

 
  // 오픈북 라이브러리 API주소로 불러오기
  const BASE_URL = `https://openlibrary.org/search.json?title=${title}`

  useEffect(() => {

    const getData = setTimeout(async () => {
    
      try {

        setIsLoading(true)

        
        const res = await fetch(BASE_URL); // book API 가져오기
        
        const { docs } = await res.json();

        let books = docs;

        books = books.map((book) => {

          const id = book.key.split("/")[2]; 

          return {
            page:page,
            id: id,
            title: book.title,
            cover_id: book.cover_i,
            author_name: book.author_name,
            public_rating: book.ratings_average,
            published_year: book.first_published_year
          }
        })

        // 책표지가 있는 책들만 추려내기
        const formattedBooks = []
        for (let i = 0; i < books.length; i++) {
          if (books[i]?.cover_id) {
            formattedBooks.push(books[i]);
          }
        }

        setBooks(formattedBooks)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })

    return () => {
      clearTimeout(getData);
    }
  }, [])

  // 커버 이미지 URL

 

  
  return (
    <div> 
      <div className='max-w-5xl mx-auto mb-auto'>
        <header className='text-center text-2xl font-bold my-14'>
          <h5> Catalog of Books</h5>
          <h2 className='text-3xl mt-2'>Find your Desired Books</h2>
          
        </header>

        <label className='flex justify-end border-b pb-5'>
          진열 갯수 선택:&nbsp;
          <select
            type="number"
            value={limit}
            onChange={({ target: { value } }) => setLimit(Number(value))}
            className='border'
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
            <option value="46">46</option>
            <option value="100">100</option>
          </select>
        </label>

        <main className=' grid grid-cols-2 sm:grid-cols-4  gap-5'>
          {books?.slice(offset, offset + limit).map(({ id, title, cover_id }) => (
            <div 
                key={id} 
              >
                <Link href={`/product/${id}`}>
                  <div>
                      <BookCard
                        coverId={cover_id}
                        BookId={id}
                      />
                     
                      <h3 className='text-center mt-2'> 
                        {title.length > 10 
                          ? `${title.slice(0, 18)} ...` 
                          : title
                        }
                      </h3>
                      
                  </div>
                </Link> 
            </div>
            
          ))}
        </main>
        <footer>
          <Pagination
            total={books.length}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </footer>
      </div>
    </div> 
  )
}

export default BookCatalog
