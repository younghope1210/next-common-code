"use client";

import { SessionProvider } from 'next-auth/react';
import React from 'react'; // React.ReactNode를 사용하기 위해

const Provider = ({ children, session }) => {
    return (
        // SessionProvider로 children을 감싸고 session 정보를 넘겨줘서
        // 하위 컴포넌트들이 useSession() 훅을 사용할 수 있게 한다
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}

export default Provider;