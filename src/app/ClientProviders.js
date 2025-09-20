// ClientProviders.tsx
'use client'

import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SWRConfig } from 'swr'
//import { StoreProvider } from '@/redux/StoreProvider' 


export default function ClientProviders({children}) {

    return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          toast.error(error.message)
        },
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init)
          if (!res.ok) {
            throw new Error('데이터를 가져오는 동안 오류가 발생했습니다')
          }
          return res.json()
        },
      }}
    >
      {/* StoreProvider로 children을 랩핑한다 */}
      {/* <StoreProvider>  */}
        <div /* data-theme={selectedTheme}*/> 
          <Toaster toastOptions={{ className: 'toaster-con' }} />
          
            {children} 
            
        </div>
      {/* </StoreProvider>  */}
    </SWRConfig>
  )
}