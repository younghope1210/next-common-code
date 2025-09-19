import db from '@/lib/db'
import bcryptjs from 'bcryptjs';
import User from '@/models/User'
// import getCorsHeaders from '@/lib/apiCors'

export async function POST(req) {
    try {
        await db.connect() // 몽고디비와 연결

        const { username, email, password: pass } = await req.json()

        console.log(username, email, pass)

        const isExisting = await User.findOne({ email }) 
        // 회원가입 창에 입력한 이메일이 db에 존재하는 이메일인지 확인 후

        if (isExisting) {
            throw new Error("User already exists")
        }

        const hashedPassword = await bcrypt.hash(pass, 10) // 비번 해독 후

        const newUser = await User.create({ username, email, password: hashedPassword })

        const { password, ...user } = newUser._doc
        // return new Response(JSON.stringify(user), { status: 201, headers: getCorsHeaders(req.headers.get("origin") || "") })
        return new Response(JSON.stringify(user), { status: 201 })
        } catch (error) {
            return new Response(JSON.stringify(error.message), { status: 500 })
        }
    }