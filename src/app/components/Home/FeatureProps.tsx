import React from 'react'
import { motion } from 'framer-motion'

type FeaturesProps = {
  emojis?: string
  title?: string
  description?: string
}

const FeatureProps = ({ emojis, title, description }: FeaturesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: false }}
    >
      <div className="feature-card flex flex-col items-start justify-start text-start py-12 px-8 bg-[#1818186b] border border-[#2a2a2a71] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <span className="text-4xl">{emojis}</span>
        <h3 className="text-xl font-bold mt-6">{title}</h3>
        <p className="text-gray-400 mt-4">{description}</p>
      </div>
    </motion.div>
  )
}

export default FeatureProps