import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className='max-w-screen-2xl mx-auto w-full flex items-center justify-between px-4 py-4 md:px-8 border-b border-gray-300 dark:border-gray-600'>
      {/* logo */}
      <Link href='/dashboard' className=''>
        <div className='text-xl font-bold text-white rounded-full p-1 h-8 w-8 bg-primary border border-violet-500 flex items-center justify-center'>
          {" "}
          IM
        </div>
      </Link>
      {/* nav links */}
      <div className='flex gap-20 items-center text-xs md:text-base'>
        <div className='flex gap-8 '>
          <Link href='/'>Home</Link>
          <Link href='/dashboard'>Dashboard</Link>
          <Link className='' href='/invoices/new'>
            Create Invoice
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <SignedOut>
            <Button variant='outline'>
              <SignInButton />
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
