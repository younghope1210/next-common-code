"use client"
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Register = () => {

  const [username,setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사

    if(username === "" || email === "" || password === "") {
       toast.error("Fill all Fields")
       return
    }

    if(password.length < 6){
        toast.error("password must be at least 6 characters")
        return
    }

    try {

      const res = await fetch("http://127.0.0.1:3000/api/register", {
        headers: {
          "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
          username,
          email,
          password
        })
      })

      if(res.ok){
          toast.success("successfully registered the user")
          setTimeout(() => {
            signIn()
            router.push('/login');
          }, 1500)
      } else {
          toast.error("Error occured while registering")
          return
      }

    } catch(error) {
      console.log(error)
    }

  }

  return (
    <div className='flex flex-col justify-center mt-20 max-w-[400px] m-auto'>
      <div className='p-6 bg-white rounded-md shadow-md'>
        <h2 className='text-3xl text-[#6930e2] font-semibold text-center pb-3'>
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <input 
            className='w-full px-4 py-2 mt-2 bg-white border rounded-md' 
            type="text" placeholder="name..." onChange={(e) => setUserName(e.target.value)} 
          />
          
          <input 
            className='w-full px-4 py-2 mt-2 bg-white border rounded-md' 
            type="email" placeholder="email..." onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
           className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
            type="password" placeholder="password..." onChange={(e) => setPassword(e.target.value)} 
          />
          <button
            className='w-full my-3 bg-[#6930e2] text-white px-4 py-2 rounded-md hover:bg-[#946ce9] transition duration-500 ease-in-out'
          >
            Register
          </button>
         {/* github 회원가입 */}
         <div className="my-4 text-center text-gray-500">
            or login with provider
          </div>
          <button
            onClick={() => signIn('gihub', {callbackUrl:'/'})}
            className="w-full my-3  px-4 py-2 border rounded-md">
           
            Login with github
          </button>

          <p className='mt-8 text-s font-light text-center text-gray-700'>
          Did you sign up for membership?  {" "}
            <Link href='/login' 
              className='font-medium hover:underline'
            >
             Login now.
            </Link>
          </p>
        </form>
        </div>
      <ToastContainer />
    </div>
  )
}

export default Register
