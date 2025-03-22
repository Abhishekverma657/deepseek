import { Webhook } from "svix";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { jsxDEV } from './../../../node_modules/@types/react/ts5.0/v18/jsx-dev-runtime.d';
import { NextResponse } from "next/server";
 export  async function POST(req) {
    const wh=new Webhook(process.env.SIGNING_SECRET);
     const headerPayload= await headers()
     const svixHeader={
           "svix-id": headerPayload.get("svix-id"),
              "svix-signature": headerPayload.get("svix-signature"),
                    "svix-timestamp": headerPayload.get("svix-timestamp")

     };
     // get the payload and verifuy it 
      const payload= req.json()
      const body= JSON.stringify(payload)
      const {data, type}=wh.verify(body,svixHeader)
      // [prepare the user data to save in db]
        const userData={
            _id:data.id,
            name:`${data.first_name} ${data.last_name}`,
            email:data.email_addresses[0].email_address,
            image:data.image_url
        };
         await dbConnect();
          switch(type){
              case "user.created":
                  await User.create(userData)
                  break;
              case "user.updated":
                await User.findByIdAndUpdate(data.id,userData)
                break;
                case "user.deleted":
                    await User.findByIdAndDelete(data.id)
                    break;
                default:
                    break;
          }
          return NextResponse.json({
            message:'event received'
          })
    
 }