'use client'
import { addToCart, removeFromCart } from '@/redux/slices/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

export default function CartPage() {

  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart)

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  return (
    <div className='w-10/12 max-w-6xl mx-auto my-8'>
       <h2 className='my-8 text-3xl text-center font-bold text-gray-300'>
          <span className="special-word">Shopping Cart</span> 
        </h2>    
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td>
                      <Link
                        href={`/product/${item.id}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.cover_image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="p-1"
                        ></Image>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1} 
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center text-gray-600">
                      <button
                        className="border px-2 rounded-md"
                        onClick={() => removeFromCartHandler(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card p-5">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) : $
                    {itemsPrice}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/finish')}
                    className="text-white border w-full rounded-md py-2 bg-red-600 hover:bg-red-400 transition duration-500 ease-in-out"
                  >
                    Proceed to checkout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      
    </div>
  )
}
