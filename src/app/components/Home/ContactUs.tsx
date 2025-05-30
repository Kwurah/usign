"use client";

import React, { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = `Support Request from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const mailtoLink = `mailto:info@kwurah.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <motion.section
      id="contact"
      className=" flex items-center px-4 py-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: false }}
    >
      <div className="w-full  mx-auto">
        <h1 className="hidden lg:block lg:text-[3rem] text-start font-[800] mb-[2rem] animate-slideUp [animation-delay:0.2s]">
          Have questions? Lets Talk.
        </h1>
        <h1 className="block lg:hidden text-center text-[30px] font-[800] mb-[2rem] animate-slideUp [animation-delay:0.2s]">
          Have questions? <br></br>Lets Talk.
        </h1>

        <p className="lg:text-[16px] text-center lg:text-start text-[#ccc] mb-12  animate-slideUp [animation-delay:0.4s] lg:max-w-[600px]">
          Reach out to us and we’ll get back to you fast. We don’t ghost our users 👻, we’re here to help you with any questions or concerns you may have about uSign.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2.5 lg:p-4 placeholder:text-[14px] text-[14px] bg-[#131313a5] border-[#272727] rounded border focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full p-2.5 lg:p-4 placeholder:text-[14px] text-[12px] bg-[#131313a5] border-[#272727] rounded border focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                rows={4}
                id="message"
                value={message}
                placeholder="Your message here..."
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 bg-[#131313a5] placeholder:text-[14px] text-[14px] border-[#272727] rounded border focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white/80 p-2.5 lg:p-4 text-[14px] hover:bg-[#9d9d9d] text-black rounded-lg  font-semibold"
            >
              Get in Touch
            </button>
          </form>

          {/* Contact Links */}
         <div className='mx-auto justify-center items-center lg:justify-start lg:items-start flex flex-col gap-8'>
            <h1 className="text-[16px] lg:text-[20px] font-semibold">You can reach us through any of our socials or email:)</h1>
            <Link
              href="mailto:Info@kwurah.com"
              className="text-[14px] flex items-center hover:text-[#9d9d9d]"
            >
              <MdOutlineEmail className="text-[2rem] text-white mr-3" />
              Info@kwurah.com
            </Link>
            <Link
              href="https://x.com/kwurahhq?s=21&t=9wNwdI-DbR9l5YQg40Mtzg"
              className="text-[14px]  flex items-center  hover:text-[#9d9d9d]"
            >
              <FaXTwitter className="text-[2rem] text-white ml-[-2.2rem] lg:ml-0 mr-3" />
              @kwurahhq
            </Link>
            <Link
              href="https://www.instagram.com/kwurahhq?igsh=bXVsYmQzNGFuZnZu"
              className="text-[14px]  flex items-center  hover:text-[#9d9d9d]"
            >
              <IoLogoInstagram className="text-[2rem] text-white  ml-[-2.2rem] lg:ml-0 mr-3" />
              @kwurahhq
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactUs;