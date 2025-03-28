"use client"
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";



export default function Home() {
  const [expand, setexpand] = useState(false)
  const [messages, setmessages] = useState([])
  const [isLoading, setisLoading] = useState(false)

  return (
    <div>
      <div className=" flex h-screen">
      
        <Sidebar expand={expand} setexpand={setexpand} />
        <div className=" flex-1 flex flex-col items-center  justify-center px-4 pb-8 bg-[#292a2d] text-white relative ">
          <div className=" md:hidden absolute px-4 top-6 flex items-center justify-between w-full" >
            <Image onClick={() => (expand ? setexpand(false) : setexpand(true))}
              className=" rotate-180 " src={assets.menu_icon} alt="menu" />
            <Image className=" opacity-70" src={assets.chat_icon} alt="chat" />
          </div>
          {
            messages.length === 0 ? (
              <>
               <div className=" flex items-center gap-3">
                <Image src={assets.logo_icon} alt="" className=" h-16"/>
                <p className=" text-2xl font-medium">Hi I am  DeepSeek</p>
               </div>
               <p className=" text-sm mt-2">How Can I Help You today? </p>
              </>
            ) : (
              <div>
                <Message role ='user' content='whar is next js ' />



              </div>


            )
          }
          {/* {prompt box } */}
          <PromptBox isLoading={isLoading} setisLoading={setisLoading} />

           <p className=" text-xs absolute bottom-1 text-gray-500">AI-Generated for reference only</p>

        </div>

      </div>

    </div>
  );
}
