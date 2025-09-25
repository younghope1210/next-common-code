

# Full-Stack E-commerce & Service Platform
### Modern Web Development Showcase
![Project Screenshot Placeholder - 여기에 프로젝트의 멋진 스크린샷이나 GIF를 넣어주세요!]

### 프로젝트 소개

이 프로젝트는 Next.js 13의 App Router와 TypeScript를 기반으로 구축된 현대적인 풀스택 웹 애플리케이션입니다. 사용자 인증, 프로필 관리, 상품(의사) 등록 및 조회, 장바구니 기능, 그리고 강력한 검색 및 필터링 기능, 사용자 맞춤형 '최근 본 상품' 및 '진료 예약' 시스템을 구현하여 웹 서비스의 핵심 로직과 클라이언트-서버 간 유기적인 데이터 흐름을 시연합니다. 클린 아키텍처와 재사용 가능한 컴포넌트 설계에 중점을 두었으며, 타입 안정성과 강력한 보안을 고려한 개발 역량을 선보입니다.

*****

### 주요 기능 (Key Features)
#### 인증 및 사용자 관리:
##### ▶ NextAuth.js를 활용한 회원가입(Register) 및 로그인(Log In) 시스템. bcrypt를 통한 비밀번호 암호화 및 JWT 기반 인증/인가 처리.
##### - 비밀번호 암호화  (백엔드 API)
    const hashedPassword = await bcrypt.hash(pass, 10);
##### - JWT 토큰 검증  (백엔드 API)
    const decodedToken = verifyJwtToken(token);
##### ▶사용자 프로필 조회, 수정, 그리고 계정 삭제 기능 (Cloudinary 연동).
##### - 사용자 아바타 이미지 업로드 및 교체  (클라이언트)
    const profileImg = await uploadImage();
##### - 사용자 및 관련 데이터 일괄 삭제  (백엔드 API)
    await Promise.all([ UserModel.findOneAndRemove(...), ProductModel.deleteMany(...), deleteManyPhotos(...) ]);
#### 상품 관리:
##### ▶ 새 상품 등록(Create) 기능 (Cloudinary 이미지 업로드 연동).
##### - 상품 이미지 Cloudinary 업로드  (클라이언트)
     const image = await uploadImage(); 
##### - 새 상품 데이터 DB 저장  (백엔드 API)
     const createdProduct = await Product.create(newProductData);
##### ▶ 모든 상품 목록 조회(List) 및 개별 상품 상세 조회(Detail).
##### - 상품 목록 상태 관리  (클라이언트)
    const [products, setProducts] = useState<Product[]>([]);
##### - 상품 상세 조회 시 관련 데이터 동시 로드 (백엔드 API)
    product.populate({ path: "comments.user", select: "-password" });
##### ▶ 상품 삭제 및 댓글/별점 기능 (MongoDB populate 활용 관계형 데이터 조회).
##### - 댓글 추가  (백엔드 API)
    product.comments.unshift(newComment); 
##### - 댓글 삭제  (백엔드 API)
    product.comments = product.comments?.filter(comment => comment._id !== commentId); 
#### 장바구니 시스템:
##### ▶ Redux Toolkit을 활용한 전역 장바구니 상태 관리.
##### - Redux 장바구니 액션 디스패치  (클라이언트)
    dispatch(addToCart({ ...productDetails, qty: newQty }));
##### ▶ js-cookie를 통한 장바구니 데이터 클라이언트 측 영속성 유지.
##### - 장바구니 상태 쿠키 저장  (Redux Slice)
    Cookies.set('cart', JSON.stringify(state), { expires: 7 }); 
####  상품 검색 및 필터링:
##### ▶ Next.js Server Components를 활용한 초기 로딩 최적화.
##### ▶ 통합 검색 (SearchBox): 단순 검색어 입력 필드(SearchBox)를 통해 상품을 검색하며, URL 쿼리 파라미터(q)를 효율적으로 관리.
##### - SearchBox 폼 제출  (클라이언트)
    <form action="/search" method="GET">
        <input name="q" placeholder="상품명 검색" />
        <button type="submit">Search</button>
    </form>
##### ▶ 다양한 필터링 및 정렬: 카테고리, 가격 범위, 평점(Form.tsx / Form.js)을 통한 세밀한 필터링, 정렬(newest, lowest, highest, rating) 및 페이지네이션.
##### - 상품 쿼리 함수  (백엔드 productService)
    const { products, countProducts } = await productServices.getByQuery({
        q: query, category: cat, price: prc, rating: rtg, sort: srt, page: pg
    });
##### ▶ 시각적 카테고리 탐색 (CategoryList): 아이콘을 클릭하여 직관적으로 카테고리별 검색 결과로 이동하는 기능 (CategoryList.jsx / CategoryList.tsx).
##### - CategoryList 링크  (클라이언트)

    <Link href={`/search?category=${c}`}>
        <Image src={`/category_${i}.png`} alt={`${c} 카테고리 아이콘`} />
        <div>{c}</div>
    </Link>

##### - 백엔드 카테고리 조회 API  (최적화)                    
##### - (app/api/product/category/route.ts)

    export const GET = async () => {
        const categories = await ProductModel.find().distinct('category');
        return NextResponse.json(categories);
    }

##### ▶ URLSearchParams를 활용한 동적인 URL 쿼리 관리 및 useSWR을 통한 클라이언트 측 데이터 패칭/캐싱.
#### 사용자 맞춤 기능 (Service Feature):
##### ▶'최근 본 상품' 기능: localStorage를 활용하여 클라이언트 측에서 사용자가 조회한 상품 목록을 기록하고 표시. (JS 프로젝트)
##### - localStorage에 최근 본 상품 목록 저장  (클라이언트)
    localStorage.setItem("watched", JSON.stringify(limitedList));
##### ▶병원 진료 예약 시스템: react-day-picker 기반의 달력 UI와 시간 슬롯 선택을 통해 의사에게 검진 예약을 진행하고 Order 모델을 통해 예약 정보 관리.
##### - 진료 예약 달력 컴포넌트 사용  (클라이언트)
    <Calendar mode="single" selected={date} onSelect={setDate} />
##### - 백엔드 예약 생성 API 호출  (클라이언트)
    const response = await fetch("/api/order", { method: "POST", body: JSON.stringify(newBooking) });
#### 유저 친화적인 UI/UX:
##### ▶ 반응형 웹 디자인.
##### ▶ react-hot-toast를 활용한 사용자 피드백 알림.
##### ▶ 재사용 가능한 Modal 및 Input 컴포넌트 설계.
##### - 재사용 가능한 모달 컴포넌트 사용  (클라이언트)

    <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
        {/##### - 모달 내용 ##### -/}
    </Modal>

### 🛠️ 기술 스택 (Tech Stack)
#### Frontend Framework: Next.js 13 (App Router)
##### - Next.js API Route handler  (백엔드)
    export async function POST(req: NextRequest) { /##### - ... ##### -/ }
#### Language: TypeScript / JavaScript (프로젝트별 적용)
##### - TypeScript 인터페이스 정의 
    export interface ICartItem { _id: string; title: string; qty: number; }
#### UI/Styling: Tailwind CSS, react-icons, lucide-react
##### - Tailwind CSS 클래스 사용  (클라이언트)
    className="w-full my-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
#### State Management: Redux Toolkit (@reduxjs/toolkit)
##### - Redux Toolkit createSlice 사용 
    const cartSlice = createSlice({ name: 'cart', initialState, reducers: { ... } });
#### Authentication: NextAuth.js
##### - NextAuth.js useSession 훅 사용  (클라이언트)
    const { data: session, status } = useSession();
#### Database: MongoDB (Mongoose ODM)
##### - Mongoose Schema 정의  (백엔드)
    const ProductSchema = new Schema<IProduct>({ name: { type: String, required: true }, ... });
#### Backend Runtime: Node.js (Next.js API Routes)
#### Image Storage: Cloudinary
##### - Cloudinary 이미지 업로드 요청  (클라이언트)
    const res = await fetch(`https:##### -api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { ... });
#### Cookie Management: js-cookie
##### - js-cookie를 통한 쿠키 저장  (Redux Store Provider)

    Cookies.get('cart'); ##### - 쿠키 읽기
    Cookies.set('cart', JSON.stringify(state), { expires: 7 }); ##### - 쿠키 쓰기

#### Date Formatting: moment.js
##### - moment.js를 통한 날짜 포맷팅  (클라이언트)
    const formattedTime = moment(timeStr).format("MMMM Do YYYY");
#### Calendar UI: react-day-picker
##### - react-day-picker Calendar 컴포넌트 사용  (클라이언트)
    <DayPicker mode="single" selected={date} onSelect={setDate} />
### 💻 핵심 아키텍처 및 데이터 흐름 (Core Architecture & Data Flow)
##### 본 프로젝트는 클라이언트와 서버, 데이터베이스 간의 명확한 역할 분담과 유기적인 소통에 중점을 둡니다.

##### 통합 풀스택: Next.js App Router를 사용하여 프론트엔드와 백엔드(API Routes)를 하나의 프로젝트 내에서 통합 관리, 개발 생산성과 효율성을 극대화합니다.
##### 타입 안전성: TypeScript를 전체 스택에 적용하여 컴파일 시점의 오류를 방지하고, 코드의 예측 가능성 및 유지보수성을 향상시킵니다.
##### 보안 중심 인증: NextAuth.js와 JWT(JSON Web Token)를 통해 사용자 인증 및 인가(Authorization)를 Stateless 방식으로 처리합니다. 모든 민감한 API 요청은 Bearer Token을 통한 인가 절차를 거칩니다.
### 효율적인 데이터 관리
##### Mongoose의 populate 기능을 활용하여 MongoDB에서 관계형 데이터를 효율적으로 조회하고, 클라이언트에 최적화된 형태로 제공합니다.
##### Redux Toolkit은 장바구니와 같이 전역적으로 공유되는 복잡한 클라이언트 상태를 중앙 집중적으로 관리하며, js-cookie 및 localStorage를 통해 브라우저 새로고침 시에도 장바구니/최근 본 상품 상태가 유지되도록 영속성을 확보합니다.
##### 클라우드 기반 이미지 관리: Cloudinary를 활용하여 이미지 업로드, 저장, 최적화 및 제공을 처리함으로써 서버 부하를 줄이고 이미지 로딩 성능을 최적화합니다.
##### 도메인 유연성: '상품'이라는 추상적 모델을 '이커머스 상품' 또는 '의사 정보'로 유연하게 재활용하고, '주문' 모델을 '진료 예약'으로 도메인 특화하여 확장 가능한 서비스 아키텍처를 제시합니다.
##### 서버 컴포넌트 기반 검색 최적화: Next.js Server Components와 productService의 cache/revalidate를 활용하여 초기 검색 페이지 로딩 시 데이터를 서버에서 미리 가져와 HTML을 렌더링함으로써 초기 로딩 성능(TTFB)을 대폭 향상시키고, 클라이언트 측 자바스크립트 번들 크기를 줄입니다.
### 프로젝트 흐름도 

graph TD
    subgraph Client (Frontend)
        A[User Interface] --> B(Components: Auth, Product, Cart, User Profile, Booking, Search);
        B --> C{State Management: Redux / localStorage};
        C --> D(HTTP Requests: fetch);
    end

    subgraph Server (Backend - Next.js API Routes)
        D --> E[API Routes: /api/auth, /api/product, /api/user, /api/order, /api/search];
        E --> F{Authentication: JWT Validation};
        F --> G{Business Logic & Data Processing};
        G --> H(DB Interaction: Mongoose);
    end

    subgraph External (External Services)
        I[Cloudinary Image Storage] --> E;
        J[NextAuth.js Authentication] --> E;
        L[react-day-picker: Calendar UI] --> B;
    end

    subgraph Database
        H --> K[MongoDB];
    end

    K -- Data --> H;
    H -- Response --> G;
    G -- Response --> E;
    E -- Response --> D;
    D -- State Update --> C;
    C -- Render --> B;
### 프로젝트 실행 방법 (How to Run)
#### 프로젝트 클론:
git clone [Your Repository URL]
cd [your-project-directory]
#### 의존성 설치:
npm install
#### 또는
yarn install
#### 환경 변수 설정: 프로젝트 루트에 .env.local 파일을 생성하고 다음 변수들을 설정합니다.
    MONGODB_URI=
    NEXTAUTH_SECRET=
    NEXTAUTH_URL=http:##### -localhost:3000
    NEXT_PUBLIC_CLOUD_NAME=
    NEXT_PUBLIC_UPLOAD_PRESET=
#### 추가:
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
(각 서비스에서 발급받은 실제 값으로 대체해주세요. NEXTAUTH_SECRET는 32자 이상의 무작위 문자열 권장)
####  프로젝트 실행:
    npm run dev
#### 또는
    yarn dev
#### 브라우저에서 localhost:3000으로 접속하여 프로젝트를 확인합니다.
###  개발자의 한마디
이 프로젝트는 단순히 웹 기술 스택을 나열하는 것을 넘어, 어려움을 마주했을 때 스스로 문제를 분석하고 해결해 나가는 개발자의 성장 과정과 끈기를 담고 있습니다. 특히 여러 도메인(이커머스, 예약 시스템)에 걸쳐 핵심 기능을 확장하고, TypeScript와 JavaScript를 오가며 유연하게 개발하는 역량을 보여줍니다. 복잡한 웹 서비스의 전체 그림을 이해하고 구현하려는 노력, 그리고 사용자 경험과 보안을 동시에 고려한 설계를 통해 완성되었습니다.
