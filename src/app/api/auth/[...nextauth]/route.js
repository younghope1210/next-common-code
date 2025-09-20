// next-auth.js

import NextAuth from "next-auth/next";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import User from "@/models/User" 
import { signJwtToken } from "@/lib/jwt"
import bcrypt from 'bcryptjs'
import connectDB from "@/lib/db"

//  CredentialsProvider : 로그인을 할 수 있게 하는 제공자
// import { signJwtToken } from "@/lib/jwt"; : 서명
// import bcrypt from 'bcrypt' : 복호화

const handler = NextAuth({

    providers : [
        CredentialsProvider({ // 자격 증명하기
            type : 'credentials',
            credentials : { // 공급자
                email : { label: "Email", type: "text", placeholder: "이메일 주소를 입력해주세요" },
                password : {label: "Password", type: "password" }
            },
            async authorize(credentials, req){ // 비동기 인증
            
                // authorize 함수: 클라이언트에서 받은 이메일/비밀번호로 사용자를 찾고 인증하는 역할
                // 인증 성공 시 User 객체 반환, 실패 시 null 반환 -> jwt 콜백으로 결과 전달

                if(!credentials){

                    console.log("자격증명이 제공되지 않아 인증에 실패하였습니다");
                    return null;

                }

                const { email, password } = credentials;

                
                if(typeof password !== 'string'){

                    console.log("인증 실패: 비밀번호가 유효한 문자열이 아닙니다")
                    return null;

                }
                
                // ⭐️ 수정: db.connect() 대신 connectDB 함수 직접 호출.
                await connectDB(); // 몽고 DB와 연결

                const user = await User.findOne({ email })

                 if(!user){

                    console.log("인증 실패: 이메일로 사용자를 찾을 수 없습니다:", email);
                    return null;
                }   

                 // 비밀번호 비교

                const passwordMatch = await bcrypt.compare(password, user.password)

                 // 로그인 창에서 입력한 비번과 db에 저장된 비번이 일치하지 않으면 
               if(!passwordMatch){

                    console.log("인증 실패: 비밀번호가 일치하지 않습니다:" , email)
                    return null;

                }else{

                    console.log("사용자 인증 성공:", email);

                    const userObject = user.toObject();

                    const authorizedUser = {

                        id : userObject._id ? userObject._id.toString() : "default-id", // next-auth는 주로 id 필드를 사용
                        _id : userObject._id ? userObject._id.toString() : undefined, // 커스텀 _id 필드 
                        name : userObject.name,
                        email : userObject.email, 
                        image : userObject.avatar?.url,  // userObject.avatar?.url에 이미지 경로가 있다고 가정
                        // DB에서 isAdmin 필드 사용 
                        // userObject.isAdmin이 undefined라면 false를 사용하도록 합니다.
                        isAdmin : typeof userObject.isAdmin === 'boolean' 
                            ? userObject.isAdmin 
                            : false
                        // 또는 더 간결하게: isAdmin : !!userObject.isAdmin // undefined/null/0/" " 모두 false
                        // 또는: isAdmin : userObject.isAdmin || false // userObject.isAdmin이 falsey 값(undefined, null, 0, "")이면 false
                        // accessToken은 authorize에서 생성하지 않고 jwt 콜백에서 생성된다!

                    }
                    // 이 user 객체 (NextAuthUser 형태)가 jwt 콜백으로 넘어간다
                    return authorizedUser;
                  }
            }
        }),
        GithubProvider({
         clientId: process.env.GitHub_ID ?? "", // GitHub ID 환경변수 설정 확인
         clientSecret: process.env.GitHub_Secret ?? "", // GitHub Secret 환경변수 설정 확인
        }),
    ],
    pages : {

        signIn : "/login" // 로그인 페이지 경로

    },
    callbacks : {

        // signIn 콜백: Provider와 상관없이 로그인이 시도될 때마다 실행
        // authorize 콜백(credentials) 또는 Provider(OAuth) 성공 후 실행
        // 이 콜백은 성공 시 boolean (true) 또는 string (URL)만 반환해야 한다.

        async signIn({user, account, profile}){

             console.log(
                "로그인 콜백이 시작되었습니다 : ", 
                {
                    provider : account?.provider,
                    userEmail : user?.email
                }
            )

          // credentials 로그인 성공 시 (authorize에서 null이 아닌 User 객체 반환)
          if(account?.provider === "credentials"){

            console.log("로그인 콜백(자격 증명): 인증된 사용자:", user?.email);
            // authorize에서 반환된 user 객체 (NextAuthUser 형태)는 
            // next-auth 내부적으로 다음 콜백으로 전달된다.
            return true; 

          }  

          // **********GitHub 로그인 시*********
          
          if(account?.provider === "github"){

              // 몽고디비 연결하기
                // connectDB 함수 직접 호출.
                await connectDB();

                try{

                    // GitHub에서 받아온 user 객체와 email이 있는지 확인
                    // Provider user 객체 (DefaultUser)는 id, name, email, image를 가진다
                    if(user && user.email && typeof user.email === 'string'){

                        // user모델 변수를 직접 사용
                        const existingUser = await User.findOne({ email : user.email });

                        if(!existingUser){

                            console.log("로그인 콜백(GitHub): 새 사용자 생성:", user.email);

                        // 데이터베이스에 사용자가 없으면 새로 생성
                        //  임포트된 User 모델 변수를 직접 사용한다 

                            const newUser = new User({

                                emial : user.email,
                                // Provider user 객체에 name이 있는지 확인하고 사용
                                name : user.name || 'GitHub User',
                                isAdmin: false, // 기본값 false,
                                // GitHub 프로필 이미지를 avatar 필드에 저장한다
                                // Provider user 객체 (NextAuthUser 형태)의 image 속성을 사용한다.
                                avatar: { url: user.image }, // DB 스키마에 avatar 객체로 저장한다고 가정

                            })

                            await newUser.save(); // 저장 결과는 이 콜백에서 반환할 필요 없음
                            console.log("로그인 콜백(GitHub): 새 사용자가 성공적으로 생성되었습니다.");
                            // OAuth Provider 성공 시에는 약속된 boolean 또는 string만 반환한다 
                            return true; // 로그인 허용

                        }else{

                            console.log("로그인 콜백(GitHub): 기존 사용자 로그인:", existingUser.email);
                            // OAuth Provider 성공 시에는 약속된 boolean 또는 string만 반환 
                            return true; // 로그인 허용

                     }

                }else{

                    console.log("로그인 콜백(GitHub): 로그인 실패 - 누락되었거나 유효하지 않은 이메일", user?.email);
                    return false; // 로그인 실패 (boolean 반환)

                }

            }catch(error){ //

                 console.error("로그인 콜백(GitHub): 로그인 또는 사용자 저장 중 오류 발생:", error);
                 return false; // 에러 발생 시 로그인 실패 (boolean 반환)

            }

          }
            // 정의되지 않은 다른 Provider는 로그인 실패 처리
            console.log(

                "로그인 콜백: 지원되지 않는 공급자가 로그인을 시도했습니다:", 
                account?.provider
            );
            
            return false; // 지원하지 않는 Provider는 로그인 실패 (boolean 반환)

        },

        //**********  jwt 콜백  **********
        // jwt 콜백: JWT(토큰)가 만들어지거나 업데이트될 때 실행 (가장 중요!)
        // 이 콜백은 authorize (credentials) 또는 signIn (OAuth) 성공 후 실행된다.
        // 'user' 인자는 authorize (Credentials) 또는 signIn (OAuth) 성공 후 
        // next-auth 내부에서 넘겨주는 user 정보
        // Credentials의 user는 authorize에서 반환된 NextAuthUser 객체이고,
        // OAuth의 user는 Provider에서 온 DefaultUser 객체이다

        async jwt({ token, user, account, profile }){

             //user.email이 undefined가 아닌지 확인
            console.log("jwt 콜백:", { userEmail: user?.email, tokenSub: token.sub });
            // signIn/authorize에서 넘어온 user 객체 내용 확인!
            console.log("jwt callback: signIn/authorization에서 사용자를 받았습니다", user); 

             // user 객체는 Credentials 로그인 시 authorize에서 넘겨준 NextAuthUser 형태,
            // OAuth 로그인 시 Provider에서 온 DefaultUser 형태가 들어온다

            if(user){   // user 객체가 있다는 것은 인증 성공 (Credentials 또는 OAuth)
                
                // 토큰에 담을 최종 사용자 정보를 가져오기
                // Credentials 로그인 시 user 객체에 DB 정보 (_id, isAdmin, image)가 이미 담겨있다.
                // OAuth 로그인 시 user 객체는 Provider 정보만 담고 있으므로 DB에서 다시 조회해야 한다.
                console.log("jwt 콜백: 이메일로 사용자 처리 중",user.email);

                let dbUser = null;

                //Credentials 로그인 또는 signIn에서 _id를 포함하여 넘겨준 경우 
                // (현재 코드는 Credentials만 해당)

                if(user._id){ 

                    console.log(
                    
                        "jwt 콜백: 사용자 객체에 DB _id가 포함되어 있습니다 : ", 
                        user._id
                    );

                    dbUser = await User.findById(user._id);

                    }else if (user.email){
                    
                        // OAuth 로그인 등 _id가 없는 경우, email을 사용하여 DB에서 사용자 조회
                        console.log(

                            "jwt 콜백: 사용자 객체가 DB를 누락했습니다 _id, 이메일로 가져오는 중입니다:", 
                            user.email
                        
                        );
                        dbUser = await User.findOne({

                            email : user.email
                        
                        })
                    }

                    // 사용자를 찾을 수 없으면 에러 처리 또는 
                    // 로그인 실패 처리 (여기서는 토큰 생성을 중단)

                    if(!dbUser){

                        console.error(

                            "jwt 콜백: 이메일 인증에 성공한 후 DB에서 사용자를 찾을 수 없습니다:", 
                            user.email
                        
                        )

                        // 이 경우 세션도 생성되지 않음
                        return token; // dbUser가 없으면 DB 정보 없이 현재 토큰 반환 
                        // (로그인이 완전히 실패하진 않지만 세션에 DB 정보가 누락됨)

                    }

                    // DB에서 찾은 사용자 확인!
                    console.log("jwt callback: Fetched dbUser:", dbUser.email);

                    
                    //  DB에서 가져온 dbUser 정보를 토큰 객체에 추가! 
                    // next-auth.d.ts에서 JWT에 _id, image, isAdmin 필드를 추가했음을 가정

                    token._id = dbUser._id.toString();// DB _id를 string으로 토큰에 담고
                    token.isAdmin = typeof dbUser.isAdmin === 'boolean' ? dbUser.isAdmin : false;  


                    // DB에 avatar가 있다면 image 필드에 담기
                    if(dbUser.avatar?.url){ 

                        token.image = dbUser.avatar.url; 

                    }else{
                    
                        // DB에 avatar가 없다면 Provider에서 온 user.image를 사용하거나 undefined로 둔다
                        token.image = user.image; // user (Provider user)의 image 사용

                    }     
                    
                    
                    /* 주석 처리 또는 삭제 가능:
                     if(!dbUser){
                        console.error("jwt 콜백: 이메일 인증에 성공한 후 DB에서 사용자를 찾을 수 없습니다:", user.email);
                        return token;
                    }
                    console.log("jwt callback: Fetched dbUser:", dbUser.email);
                    token._id = dbUser._id.toString();
                    token.isAdmin = dbUser.isAdmin;
                    if(dbUser.avatar?.url){
                        token.image = dbUser.avatar.url;
                    }else{
                        token.image = user.image;
                    }
                    */

                    const payload = { 

                        _id : token._id, // 토큰 _id 사용 (DB에서 가져옴)
                        email : user.email,  // user.email 사용 (Credentials/Provider 모두 가짐)
                        isAdmin : token.isAdmin  // 토큰 isAdmin 사용
                    
                    }

                    // payload 정보를 담아 JWT 토큰을 생성하고, 토큰 객체의 accessToken 속성으로 추가
                    // signJwtToken 함수가 payload를 받아 JWT 문자열을 반환해야 한다

                    try{
                        //  이 코드가 정상 작동해야 token.accessToken에 유효한 토큰 문자열이 담기게 된다 
                        // signJwtToken 함수와 JWT_SECRET 환경 변수 확인!

                        token.accessToken = signJwtToken(payload, {expiresIn : "1d"}); 
                        
                        // 아래 로그가 찍히는지 확인
                        console.log("jwt 콜백: 토큰에 액세스토큰 생성 및 추가")

                    }catch(error){

                        //에러 나지 않았는지 꼭 확인! 에러 나면 token.accessToken = undefined 그대로!
                        console.log("jwt 콜백: JWT 토큰 서명 중 오류 발생:" , error)

                    }
    
                }

             // 아래 로그에 찍힌 token 객체의 accessToken과 image, isAdmin 값을 확인! 
             // 이 객체가 session 콜백으로 전달한다
            
             console.log("jwt 콜백: 반환 토큰:", token);
             return token; // NextAuthJWT 타입
                
            },

            // session 콜백: 세션 정보가 만들어지거나 업데이트될 때 실행
            // 이 콜백은 jwt 콜백에서 반환된 token 객체를 받는다.

            async session({ session, token, user }) {

                console.log("세션 콜백 시작 : " , { tokenSub: token.sub });
                //아래 콘솔에서 jwt 콜백에서 넘어온 token 객체 내용 확인!
                console.log("세션 콜백: 처리 토큰:", token);


            //  session 객체의 user 속성에 token의 정보를 옮겨 담는 부분! 
            // token은 NextAuthJWT 형태

                if(token){

                    console.log("세션 콜백: 토큰 처리 중" , token);

                    // token에 담긴 _id와 accessToken을 session.user 객체에 옮겨 담는다

                    session.user._id = token._id;
                    session.user.accessToken = token.accessToken;
                    session.user.image = token.image;
                    session.user.isAdmin = token.isAdmin

                }

                // 최종 session 객체 내용 확인
                // 여기서 user.accessToken과 user.image, user.isAdmin 값이 이제 제대로 찍히는지 확인
            
                 console.log("세션 콜백: 세션 반환:", session);     

                 return session; // 최종 session 반환 

            }

    },

})

// Next.js API 라우터에서 GET, POST 요청을 처리하도록 export
export { handler as GET, handler as POST }