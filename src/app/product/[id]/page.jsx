"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import AddToCart from "@/components/AddTocart";

const ProductPage = ({ params }) => {

    // const id = ctx.params.id
    const [book, setBook] = useState({})
    const [countInStock, setCountInStock] = useState(10)
  

    const URL = `https://openlibrary.org/works/${params.id}.json`

    useEffect(() => {
    const fetchDetails = async () => {
        try {
            const res = await fetch(URL)
            const data = await res.json()
            console.log(data)

            // if book has no pages specified, make them 350 by default
            let pages = null
            if (data?.excerpts) {
                pages = data?.excerpts[0]?.pages
            } else {
                pages = 350
            }

            const details = {
                title: data.title,
                // desc: data.description.value,
                id: data.key.split('/')[2],
                cover_image: `https://covers.openlibrary.org/b/id/${data?.covers[0]}-L.jpg`,
                pages
            }

            setBook(details)
        } catch (error) {
            console.log(error)
        }
    }
    fetchDetails()
}, [])

  // five dollars per 100 pages
  const price = ((book?.pages / 100) * 5).toFixed(2)

  return (
    <section className='w-10/12 max-w-6xl mx-auto my-8'>
        <h2 className="my-8 text-3xl text-center font-bold text-gray-300">
        Product Detail
        </h2>

      {/* product detail start */}

      <div className="grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-2">
          <Image
            src={book?.cover_image}
            alt="product details image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-[500px] rounded-lg py-10"
          />
        </div>

      {/* product info */}

      <div className="md:col-span-2">
          <ul className="space-y-4 py-3 pl-3">
           
            <li>
                <h2 className="mt-5 text-3xl">
                    {book?.title}
                </h2>
                <h2 className="my-2 text-xl text-gray-500">
                Product No. {book?.id }
                </h2>
            </li>
            
            <li className="w-full"> 
                 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </li>
            <li>
              <div> 
                <span className='bg-gray-200 px-3 py-2'>Price</span> ${price}
              
              </div>
            </li>
            <li>
              <div> 
                <span className='bg-gray-200 px-3 py-2'>Page</span> {book?.pages}
              </div>
            </li>
            
          </ul>
          <div >

                <AddToCart 
                    book={book} 
                    redirect={true}
                    showQty={false}
                    increasePerClick={true}
                    countInStock={countInStock}
                    price={price}
                />
              
        
            </div>
        </div>

      </div>  
      {/* product detail end */}

    </section>
  )
}

export default ProductPage

