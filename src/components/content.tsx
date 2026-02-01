import { div } from 'framer-motion/client'
import React from 'react'

const content = () => {
  return (
    <div
    className='h-screen w-full flex items-center justify-center bg-neutral-950'
    >
        <button className="text-neutral-500 px-12 py-4 rounded-lg bg-black shadow-[0_0_10px_2px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset]">Subscribe

           <span className='absolute inset-x-0 bottom-px bg-linear-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto'></span>
        </button>

       
    </div>
  )
}

export default content