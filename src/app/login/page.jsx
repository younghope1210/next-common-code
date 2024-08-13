"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'
import Link from 'next/link'


const Login = () => {

  const[email, setEmail]=useState("");
  const[password, setPassword]=useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( password === "" || email === ""){
      toast.error("Fill all fields!")
      return
    }
    if(password.length < 6){
      toast.error("Password must be at least 6 characters long!")
      return
    }
    try{
      const res = await signIn('credentials', { 
        email, 
        password, 
        redirect: false 
      })
     
      console.log(res);
     
      if(res?.error === null) {
        router.push('/');
      } else{
        toast.error("Error occured while logging in")
      }
    
    } catch(error){
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col justify-center mt-20 max-w-[400px] m-auto'>
      <div  className='p-6 bg-white rounded-md shadow-md'>
        <h2  className='text-3xl font-semibold text-center pb-3 text-[#6930e2]'>
          Login
        </h2>
        <form onSubmit={handleSubmit}>
        <input
          className='w-full px-4 py-2 mt-2 bg-white border rounded-md' 
          type="email" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} 
        />
          
        <input 
          className='w-full px-4 py-2 mt-2 bg-white border rounded-md' 
          type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} 
        />
        
          <button className='w-full my-3 bg-[#6930e2] text-white px-4 py-2 rounded-md hover:bg-[#946ce9] transition duration-500 ease-in-out'>
            Login
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
          Don&apos;t have an account?  {" "}
            <Link href='/register' 
              className='font-medium hover:underline'
            >
             Register now.
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
