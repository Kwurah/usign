
"use client"
import FeatureProps from './FeatureProps'

const Features = () => {
  return (
    <section id="features" className=" animate-on-scroll lg:py-[4rem]">
      <div className="hero-badge">
        ✨ Powerful Features
      </div>
      <h1 className="animate-on-scroll lg:text-[3.5rem] text-center mx-auto justify-center items-center text-[30px] font-[900] tracking-normal lg:leading-[5rem] mb-[2rem] lg:max-w-[900px] animate-slideUp [animation-delay:0.2s]">
        Everything You Need
      </h1>
      <p className="animate-on-scroll lg:text-[16px] text-[14px] text-[#ccc] mb-12 max-w-[600px] mx-auto animate-slideUp [animation-delay:0.4s] hero">
        Our comprehensive suite of tools makes document signing effortless, secure, and lightning-fast.
      </p>
      <div className="flex justify-center">
        <div className="grid animate-on-scroll lg:grid-cols-2 grid-cols-1 gap-8">
          <FeatureProps
            emojis="⚡️"
            title="Sign Instantly"
            description="No more printing or scanning. Upload your document and sign it in seconds—anytime, anywhere."
          />
          <FeatureProps
            emojis="🆓"
            title="Unlimited Free Signatures"
            description="Unlock endless digital signing, all without spending a dime. No hidden fees, no limits, just pure convenience."
          />
          <FeatureProps
            emojis="📁"
            title="Easy File Management"
            description="Upload, preview, sign, and download all in one smooth workflow. No messy steps, no confusion."
          />
          <FeatureProps
            emojis="📱"
            title="Works on Any Device"
           description="Whether you're on a phone, laptop, or tablet, uSign delivers a smooth experience, making it easy to sign, and manage documents from any device."
          />
        </div>
      </div>
    </section>
  )
}

export default Features