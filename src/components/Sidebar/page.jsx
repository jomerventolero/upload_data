import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
  const router = useRouter()

  const handleReroute = () => {
    router.push("https://revive-recovery.com")
  }

  return (
    <>
      <nav className="w-[60px] h-screen bg-violet-700 border-[1px] border-gray-200 fixed top-0 left-0">
        <div className="flex flex-col justify-center bg-violet-600">
          <Image src="/logo.png" alt="logo" width={40} height={40} className="m-2 aspect-square cursor-pointer " onClick={() => {handleReroute()}}/>
        </div>
        <div>
        </div>
      </nav>
    </>
  )
}

export default Sidebar