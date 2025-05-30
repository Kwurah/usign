"use client"
import React from 'react'
import { PiSignatureDuotone } from "react-icons/pi";
import { GrDocumentUpload } from "react-icons/gr";
import { BsDownload } from "react-icons/bs";

const Homeee = () => {
  return (
    <section id="home" className="  justify-center pt-[2.5rem] pb-[3.5rem] lg:pt-[3rem] lg:pb-[6rem]">
      <div className="floating-element" />

      <div className="hero-badge mt-10">
        🚀 Revolutionary Digital Signing
      </div>

      <div className="floating-element" />

      <h1 className="lg:text-[4.3rem] text-[30px] font-[900] tracking-normal text-center mx-auto mb-[2rem] lg:leading-[5rem] lg:max-w-[900px] animate-slideUp [animation-delay:0.2s]">
        Sign Documents Like Never Before
      </h1>

      <p className="lg:text-[16px] text-[14px] text-[#ccc] mb-12 max-w-[600px] mx-auto text-center animate-slideUp [animation-delay:0.4s] hero">
        uSign transforms the way you handle digital documents. Secure, fast, and beautifully simple document signing for the modern world.
      </p>

      {/* Buttons for large screens */}
      <div className="hidden lg:flex justify-center items-center gap-4 flex-wrap animate-slideUp [animation-delay:0.6s]">
        <button className="btn-primary"> Start Signing for Free</button>
        <div className="floating-element" />
        <button className="btn-secondary">Explore Features</button>
        <div className="floating-element" />
      </div>

      {/* Buttons for small screens */}
      <div className="lg:hidden grid justify-center items-center gap-4 flex-wrap animate-slideUp [animation-delay:0.6s]">
        <button className="bg-white text-black py-2 px-[1.8rem] rounded-full font-semibold text-[1rem] border border-white/30 transition-all duration-300 ease-in-out">
         Start Signing for Free
        </button>
        <div className="floating-element" />
        <button className="bg-transparent text-white py-2 px-[1.8rem] rounded-full font-semibold text-[1rem] border border-white/30 transition-all duration-300 ease-in-out">
          Explore Features
        </button>
        <div className="floating-element" />
      </div>

      {/* Icons row */}
      <div className="mt-24 flex items-center justify-center gap-12 lg:gap-[9rem]">
        <GrDocumentUpload className="text-[2rem] lg:text-[2.5rem] mb-2 hover:text-[#9d9d9d]" />
        <div className="w-fit border-2 hover:text-[#9d9d9d] border-[#494949] px-6 py-2 rounded-lg flex justify-center items-center">
          <PiSignatureDuotone className="text-[2rem]  lg:text-[2.5rem] mb-2" />
        </div>
        <BsDownload className= " hover:text-[#9d9d9d] text-[2rem] lg:text-[2.5rem] mb-2" />
      </div>
    </section>
  );
};

export default Homeee;