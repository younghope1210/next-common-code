import NextAuth,{ getServerSession, Account, User as AuthUser} from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import User from "@/models/User";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from 'bcrypt'
import db from "@/lib/db";


// import CredentialsProvider from "next-auth/providers/credentials"; : 로그인을 할 수 있게 하는 제공자
// import { signJwtToken } from "@/lib/jwt"; : 서명
// import bcrypt from 'bcrypt' : 복호화

export const authOptions = ({
providers: [
  CredentialsProvider({ // 자격 증명하기
    type: 'credentials',
    credentials: {  // 공급자
        email: { label: "Email", type: "text", placeholder: "seoyoung" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) { // 비동기 인증
        const { email, password } = credentials

        await db.connect() // 몽고 db와 연결

          try {
            
            const user = await User.findOne({ email }); // 회원가입된 사용자 찾기
  
            if (!user) {
              throw new Error("Invalid input");
            }
          // 패스워드 암호 해독하기
            const passwordMatch = await bcrypt.compare(password, user.password);
             
            // 로그인 창에서 입력한 비번과 db에 저장된 비번이 일치하지 않으면 
  
            if (!passwordMatch) {
              throw new Error("Passwords do not match");
            } else {
              const { password, ...currentUser } = user._doc; //_doc = 실제 사용자 객체
              
              // const accessToken = signJwtToken(currentUser, { expiresIn: "1d" });
  
              const accessToken = signJwtToken(currentUser);

              return {
                ...currentUser,
                accessToken,
              };
            }
          } catch (error) {
            console.log(error);
          }
        },
      }),
    GithubProvider({
        clientId: process.env.GitHub_ID ?? "",
        clientSecret: process.env.GitHub_Secret ?? "",
        }),
    ],
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account}) {
          if (account?.provider == "credentials") {
            return true;
          }
          if (account?.provider == "github") {
            await db.connect() // 몽고 db와 연결
            try {
              const existingUser = await User.findOne({ email: user.email });
              if (!existingUser) {
                const newUser = new User({
                  email: user.email,
                });
    
                await newUser.save();
                return true;
              }
              return true;
            } catch (err) {
              console.log("Error saving user", err);
              return false;
            }
          }
        },
      },
      callbacks: {
        async jwt({ token, user }) { // 비동기 작업, 토큰을 얻으면서 로그인 됨
            if (user) {
                token.accessToken = user.accessToken
                token._id = user._id
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.accessToken = token.accessToken
            }

            return session
        }
    }
})

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };