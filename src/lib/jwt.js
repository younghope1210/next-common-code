import jwt from "jsonwebtoken";

//payload => 토큰에 담을 정보 객체(사용자Id, 이메일, 폰번호 등)
//option => 토큰 설정(유효기간 expiresIn 등)

export function signJwtToken(payload, options){

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET; 

    if(!secret){ // 비밀키가 제대로 설정되지 않았다면 에러처리
        
        console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.")
        throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");

    }

     // payload, 비밀 열쇠, 추가 설정을 가지고 암호화된 토큰을 만들어 반환하기
    const token = jwt.sign(payload, secret, options);
    
    return token; // 유효한 문자열이 반환되어야 한다

}

// JWT 토큰의 유효성을 확인하고 정보를 꺼내는 함수
// token => 검증할 JWT 문자열

export function verifyJwtToken(token){

    try{

        const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
        // 비밀 열쇠(secret)가 제대로 설정되지 않았다면 에러처림
        if(!secret){

            console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.")
            throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");

        }

        //토큰과 동일한 비밀 열쇠로 토큰을 열어 유효성을 확인하고 payload 꺼내기
        // 여기서 토큰 유효성 검증 실패 시 에러 발생
        const payload = jwt.verify(token, secret); // 복호화
        return payload; //만약 토큰이 유효하면 payload를 반환한다

    }catch(error){
        // 토큰 검증 실패 시 에러 로그 출력
        console.error(" JWT 토큰 검증 실패 : " , error)
        
        return null; // 토큰 확인에 실패하면 null을 반환
    }

}