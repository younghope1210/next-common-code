import { cache } from 'react'
import db from "@/lib/db";
import Product from '@/models/Product';

export const revalidate = 3600 //  매시간마다 재검증하기

const getLatest = cache(async () => {
  await db.connect() // 몽고 db와 연결
  const products = await Product.find({}).populate({
    path: "authorId",
  
  }).sort({ createdAt: -1 }).limit(6).lean()
  return products
  
})

// const getFeatured = cache(async () => {
//   await db.connect() // 몽고 db와 연결
//   const products = await Product.find({ isFeatured: true }).limit(3).lean()
//   return products
// })

// const getByauthorId = cache(async () => {
//   await db.connect() // 몽고 db와 연결
//   const product = await Product.findOne({ authorId }).lean()
//   return product
// })

const PAGE_SIZE = 3

const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    page = '1',
  }) => {
    await db.connect() // 몽고 db와 연결

    const queryFilter =
    q && q !== 'all'
        ? {
          title: {
              $regex: q,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {}
    // 10-50
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const order =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 }

    const categories = await Product.find().distinct('category')
    
    const products = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
    
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean()

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

    return {
      products: products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    }
  }
)
// end: getByQuery 

const getCategories = cache(async () => {
  await db.connect() // 몽고 db와 연결
  const categories = await Product.find().distinct('category')
  return categories
})

const productService = {
  getLatest,
  // getFeatured,
  // getByauthorId,
  getByQuery,
  getCategories,
}
export default productService
