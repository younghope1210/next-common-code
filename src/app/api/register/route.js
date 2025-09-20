import connectDB from "@/lib/db" // 데이터베이스 연결
import bcrypt from 'bcryptjs' // 비밀번호 암호화를 위한 bcryptjs 라이브러리
import User from '@/models/User' // User 모델 임포트
import { NextResponse } from 'next/server'; // Next.js 서버 응답 객체 임포트

// POST 요청 처리 함수
export async function POST(req){

    try{
        await connectDB(); // 데이터베이스 연결

        // 요청 본문에서 사용자 정보 추출
        const { name, email, password } = await req.json();

        // console.log("유저정보:", name, email, password); // 디버깅용 로그

        // 이메일 중복 체크
        const isExisting = await User.findOne({ email });

        // 이미 존재하는 이메일인 경우
        if(isExisting){
            // 409 Conflict 상태 코드와 메시지 반환
            return new NextResponse(JSON.stringify({ message: "사용자가 이미 존재합니다." }), { status: 409 });
        }

        // 비밀번호 해싱 (솔트 라운드 강도 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 사용자 생성
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Mongoose Document를 일반 JavaScript 객체로 변환
        const userObject = newUser.toObject();
        // 민감 정보인 비밀번호는 응답에서 제외
        delete userObject.password;
        // 최종 사용자 정보 할당
        const user = userObject;

        // 201 Created 상태 코드와 사용자 정보 반환
        return new NextResponse(JSON.stringify(user), {status : 201});

    }catch(error){
        console.error("회원가입 API 에러:", error); // 에러 상세 로깅
        // 500 Internal Server Error 상태 코드와 에러 메시지 반환
        return new NextResponse(JSON.stringify({ message: error.message || "서버 내부 오류 발생" }), { status : 500 });
    }
}