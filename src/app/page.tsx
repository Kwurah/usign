import React from 'react';
import Navbar from "../app/components/Navbar/page";
import Footer from "../app/components/Footer/page";
import Homee from "../app/components/Home/page";

export default function Home() {
  return (
    <div>
    <div className='mb-16 mt-3 2xl:px-[9rem] md:px-[4rem] px-[1rem]'>
     <Navbar/>
     <Homee/>
     </div>
     <Footer/>
     </div>
   
  );
}
