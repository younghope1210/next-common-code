/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import Image from "next/image";


export default function Productproduct({book}) {

  const coverImage = `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`

  return (
    <div className="card">
       <Link href={`/details/${book.id}`}>
          <div>
            <div className='p-4 flex flex-col products-center justify-center gap-1 border rounded-lg hover:scale-105 jpver:shadow-lg transition-all ease-in-out cursor-pointer'>
              <Image
                src={coverImage}
                alt="book cover"
                height='275'
                width='175'
              />
              </div>
          </div> 
        </Link>
    </div>
  );
}
