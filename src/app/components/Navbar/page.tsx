"use client"
import React, {useState} from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Page = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const router = useRouter();
  return (
    <div>
        {/* for lage screens */}
        <nav className='hidden lg:flex justify-between items-center p-4'>
            <h1 className='logo '>uSign</h1>
            <div className='flex items-center gap-10 font-semibold text-[16px]'>
               <Link className='hover:border-b-2 border-white' href="#home" scroll={true} >Home</Link>
                <Link className='hover:border-b-2 border-white' href="#features" scroll={true}>Features</Link>
                <Link className='hover:border-b-2 border-white'  href="#contact" scroll={true}>Contact Us</Link>
            </div>
            <button className='btn-primary' onClick={()=>router.push('/uploads')}>Get Started</button>
        </nav>
        {/* for small screens */}
        <nav className='flex items-center justify-between mt-8  lg:hidden px-4'>
             <h1 className='font-bold text-2xl tracking-tighter '>uSign</h1>
               <button onClick={() => setIsNavOpen(true)}>
             <RxHamburgerMenu className='justify-end items-end text-2xl '/>
             </button>
             {/* is nav opennn? */}
             {isNavOpen && (
         <div className="lg:hidden fixed top-0 text-black left-0 w-full h-screen bg-white flex flex-col items-center gap-6 z-50">
          <div className='items-center flex'>
          <h1 className='font-bold text-2xl tracking-tighter pt-5 '>uSign</h1>
          <button
            className="absolute mt-5  right-7 text-3xl"
            onClick={() => setIsNavOpen(false)}
          >
            <IoCloseOutline />
          </button>
          </div>
         <Link href="#home" scroll={true}>Home</Link>
          <Link href="#features" scroll={true}>Features</Link>
         <Link  href="#contact" scroll={true}>Contact Us</Link>
          <button className='bg-black text-white py-3 px-5 w-[90%] rounded'>Get Started</button>
        </div>
      )}

        </nav>
        
    </div>
  )
}

export default Page