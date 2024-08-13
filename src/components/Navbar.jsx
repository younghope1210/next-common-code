"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {AiOutlineClose} from 'react-icons/ai'
import { usePathname } from 'next/navigation'
import { signOut, useSession} from 'next-auth/react'
// import { useSelector } from 'react-redux'

const Navbar = () => {

//   const { loading, cartItems } = useSelector((state) => state.cart);

  const pathname = usePathname();

  const [userData, setUserData] = useState({})
  const [showDropdown, setShowDropdown] = useState(false)

  const {data: session, status} = useSession();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {

    const fetchUser = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/user/${session?.user?._id}`);
            const resData = await res.json();

            setUserData(resData)

        } catch (error) {
            
          console.log(error)
        
        }
    }

    fetchUser()

}, [session?.user?._id])

const handleShowDropdown = () => setShowDropdown(prev => true)
const handleHideDropdown = () => setShowDropdown(prev => false)

  return (
    <div>
        <div className='w-full py-2 h-16 flex items-center justify-between bg-[#6930e2]'>
            <Link href="/">
                <h2 className='text-2xl font-bold pl-2 text-white'>
                    Book Store
                </h2>
            </Link>

        <div>
         
          {
            isLoggedIn
            ? (
              <div className='flex gap-2 text-center text-white'>
                <p>
                  <Link 
                    href="/cart" 
                    className={ pathname === '/cart' ? "font-bold " : ""}
                  >
                    Cart
                    {/* <AiOutlineClose />
                    <span>
                      {books?.length}
                    </span> */}
                  </Link>
                </p>
                <p className='mr-2'>
                  <button 
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </p>
              </div>
            )
            :(
                <div className='text-white flex gap-2'>
                   <p><Link href="/login"  className={ pathname === '/login' ? "font-bold " : ""}>Login</Link></p>
                   <p className='mr-2'><Link href="/register"  className={ pathname === '/register' ? "font-bold " : ""}>Register</Link></p>
                </div>
            )
          }
      
        </div>
 
        </div>
    
    </div>
  )
}

export default Navbar
