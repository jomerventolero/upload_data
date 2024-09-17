"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'


const fetchData = async () => {
  return axios.get('https://randomuser.me/api?results=5')
    .then((response) => {
      console.log(response.data.results)
      return response.data.results
    })
    .catch((error) => {
      console.log(error)
    })
}


const RandomUserData = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const res = fetchData().then((res) => setData(res))
    
  }, [])

  return (
    <div className="h-screen bg-white flex flex-col gap-4 justify-center self-center align-center">
      {data.map((item) => (
        <div className="self-center rounded-lg bg-slate-200 shadow-lg shadow-blue-100 px-4 py-2 min-w-[250px] hover:shadow-blue-300 transition-all duration-300 ease-in-out">
          <picture>
            <Image src={item.picture.thumbnail} alt="Profile" width={64} height={64} className="rounded-full"/>
          </picture>
          <div className="flex flex-row gap-2">
            <p>{item.name.title}.</p>
            <p>{item.name.first}</p>
            <p>{item.name.last}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{item.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{item.phone}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RandomUserData