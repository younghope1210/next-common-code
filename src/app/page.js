import BookCatalog from "@/components/BookCatalog";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <BookCatalog />
    </main>
  );
}
