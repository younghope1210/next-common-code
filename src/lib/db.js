// lib/db.js

import mongoose from 'mongoose';
import { disconnect } from "process";

const connection = {}; // connection 객체 유지 (사용 여부는 프로젝트에 따라 다를 수 있음)

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGO_URL environment variable inside .env.local'
  );
}

// Mongoose 연결 인스턴스 global 캐싱 로직 시작.
// Next.js 개발 환경 핫-리로딩으로 인한 중복 연결 및 모델 컴파일 방지.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    // console.log("Using existing DB connection."); // 디버깅용 로그 제거 또는 유지
    return cached.conn;
  }

  if (!cached.promise) {
    // console.log("Creating new DB connection..."); // 디버깅용 로그 제거 또는 유지
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    }).then(mongooseInstance => {
      // console.log("🎉 MongoDB connected successfully!"); // 디버깅용 로그 제거 또는 유지
      return mongooseInstance;
    }).catch(error => {
      // console.error("MongoDB connection error:", error); // 디버깅용 로그 제거 또는 유지
      cached.promise = null; // 연결 실패 시 Promise 리셋
      throw error; // 에러 재던지기
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;