'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { addToCart } from '../redux/slices/cartSlice'

const AddTocart = ({

  book, 
  showQty = true, 
  redirect = false, 
  increasePerClick = false, 
  countInStock,
  price,

}) => {
  
  const dispatch = useDispatch()
  const router = useRouter()
  const { cartItems } = useSelector((state) => state.cart)
  
  const [qty, setQty] = useState(1)

  const addToCartHandler = () => {

    
    let newQty = qty

    if (increasePerClick) {
      
      const existItem = cartItems.find((x) => x.id === book.id)
      
      if (existItem) {
        
        if (existItem.qty + 1 <= countInStock) {
        
          newQty = existItem.qty + 1
        
        } else {
          return alert('No more product exist')
        }
      }
    }

    dispatch(addToCart({ ...book, qty: newQty, price, countInStock}))

    if (redirect) router.push('/cart')
  }

  return (
     <>
   
       <div className="mb-2 flex ">
          <div className='bg-gray-200 p-1 mx-3 w-[62px] text-center'> 
           Qty 
          </div>
         <div>
           <select
             value={qty}
             onChange={(e) => setQty(Number(e.target.value))}
             className='border w-[100px]'
           >
             {[...Array(countInStock).keys()].map((x) => (
               <option key={x + 1} value={x + 1}>
                 {x + 1}
               </option>
             ))}
           </select>{' '}
         </div>
       </div>

     <div>
       {countInStock > 0 ? (
         <button 
          className='w-[250px] py-3 text-center border rounded-md ml-3 bg-red-600 text-white' 
          onClick={addToCartHandler}>
           Add to cart
         </button>
       ) : (
         <button disabled>Out of stock</button>
       )}
     </div>
   </>
  )
}

export default AddTocart

