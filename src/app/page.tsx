import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function Home() {
  const { userId } = auth();

  return (
    <main className='flex mx-auto flex-col justify-center h-full gap-12 text-center max-w-5xl'>
      <h1 className='text-5xl max-w-5xl'>InvoManager</h1>
      <p className='text-lg w-2/3 mx-auto'>
        InvoManager is a streamlined, user-friendly app for managing invoices efficiently.
        It allows you to create, track, and manage invoices with ease, making it perfect
        for businesses and freelancers looking for a simple yet powerful invoicing
        solution.
      </p>
      <div className=''>
        <Button size='lg' asChild>
          {userId ? (
            <Link href='/dashboard' className='text-lg'>
              Dashboard
            </Link>
          ) : (
            <Link href='/sign-in' className='text-lg'>
              Log In
            </Link>
          )}
        </Button>
      </div>
    </main>
  );
}
