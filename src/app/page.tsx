import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
  const { userId } = auth();

  return (
    <main className='flex flex-col justify-center h-full gap-12 text-center max-w-5xl'>
      <h1 className='text-5xl max-w-5xl'>InvoManager</h1>
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
