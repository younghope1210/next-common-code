// Next.js 서버에서 쓸 응답/요청 객체 가져오는 중!
import { NextResponse, NextRequest } from "next/server";

// CORS(다른 출처에서 요청 허용) 헤더 만들어주는 함수!
const getCorsHeaders = (origin) => { // 'origin'은 요청 보낸 곳 주소 (어디서 왔는지)

    const headers = {

        "Access-Control-Allow-Methods": `${process.env.ALLOWED_METHODS}`, // 허용할 HTTP 메서드 (GET, POST 등)
        "Access-Control-Allow-Headers": `${process.env.ALLOWED_HEADERS}`, // 허용할 요청 헤더들
        "Access-Control-Allow-Origin": `${process.env.DOMAIN_URL}`, // 기본적으로 허용할 출처 (네 도메인 주소)

    };

     // 만약 환경 변수에 허용할 출처가 없거나, 요청 보낸 곳 주소(origin)가 없으면 기본 헤더만 리턴

     if(!process.env.ALLOWED_ORIGIN || !origin ){

        return headers;

     }
     // 환경 변수에 허용할 출처 목록이 있으면 콤마(,)로 나눠서 배열로 만들기
     const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");

     // 만약 허용할 출처 목록에 '*' (모든 출처 허용)가 있으면, 모든 출처 허용하기
      if(allowedOrigins.includes("*")){

        headers["Access-Control-Allow-Origin"] = "*";

     // 아니라면 요청 보낸 곳 주소(origin)가 허용 목록에 있는지 확인하고
     // 있다면 그 출처만 허용하기
      }else if(allowedOrigins.includes(origin)){

        headers["Access-Control-Allow-Origin"] = origin;

      }
      return headers; // 최종적으로 만들ㄹ어진 CORS, 헤더들 리턴

}

export default getCorsHeaders;