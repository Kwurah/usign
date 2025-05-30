"use client"
import React from 'react'
import { motion } from 'framer-motion';

const CTA = () => {

  return (
    <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: false }}
>
    <div className='mt-24'>
         <div className='floating-element'></div>
        <div className=" text-white py-10 px-5 md:px-20">
             <h1 className='lg:text-[3.5rem] text-center mx-auto justify-center items-center text-[30px] font-[900] tracking-normal lg:leading-[5rem] mb-[2rem] lg:max-w-[900px] animate-slideUp [animation-delay:0.2s]'>Ready to Transform your Workflow?</h1> 
      <p className="lg:text-[16px] text-[14px] text-[#ccc] mb-12 max-w-[900px] mx-auto animate-slideUp [animation-delay:0.4s] hero">
  Join thousands of professionals who trust Kwurah for their document signing needs.
Start your free trial today and experience the future of digital signatures.
</p>
 <div className='floating-element'></div>
{/* lg buttons */}
           <div className='hidden lg:grid xl:flex items-center justify-center gap-4 flex-wrap animate-slideUp [animation-delay:0.6s]'>
  <button className='btn-primary'>Get started</button>  
  <button className='btn-secondary'>Explore Features</button>

</div>
{/* small screens */}
<div className='lg:hidden grid items-center justify-center gap-4 flex-wrap animate-slideUp [animation-delay:0.6s]'>
  <button className='bg-white text-black py-2 px-[1.8rem] rounded-full no-underline font-semibold text-[14px] border border-white/30 transition-all duration-300 ease-in-out"'>Get Started</button>  <div className='floating-element'></div>
  <button className='bg-transparent text-white py-2 px-[1.8rem] rounded-full no-underline font-semibold text-[14px] border border-white/30 transition-all duration-300 ease-in-out"'>Explore Features</button>
   <div className='floating-element'></div>
</div>
        </div>
    </div>
    </motion.div>
  )
}

export default CTA