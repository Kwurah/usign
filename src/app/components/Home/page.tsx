import React from 'react'
import About from './Homeee'
import Features from "./Features"
import CTA from "./CTA"
import ContactUs from "./ContactUs"

const page = () => {
  return (
       <div className='min-h-screen  text-white lg:mt-[4rem] mt-10 mx-auto items-center text-center justify-center'>
      <About/>
      <Features/>
      <CTA/>
      <ContactUs/>
    </div>
  )
}

export default page