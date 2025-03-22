// import { Webhook } from "svix";
// import dbConnect from "@/config/db";
// import User from "@/models/User";
// import { headers } from "next/headers";
 
// import { NextResponse } from "next/server";
//  export  async function POST(req) {
//     const wh=new Webhook(process.env.SIGNING_SECRET);
//      const headerPayload= await headers()
//      const svixHeader={
//            "svix-id": headerPayload.get("svix-id"),
//               "svix-signature": headerPayload.get("svix-signature"),
//                     "svix-timestamp": headerPayload.get("svix-timestamp")

//      };
//      // get the payload and verifuy it 
//       const payload=  await  req.json()
//       const body= JSON.stringify(payload)
//       const {data, type}=wh.verify(body,svixHeader)
//       // [prepare the user data to save in db]
//         const userData={
//             _id:data.id,
//             name:`${data.first_name} ${data.last_name}`,
//             email:data.email_addresses[0].email_address,
//             image:data.image_url
//         };
//          await dbConnect();
//           switch(type){
//               case "user.created":
//                   await User.create(userData)
//                   break;
//               case "user.updated":
//                 await User.findByIdAndUpdate(data.id,userData)
//                 break;
//                 case "user.deleted":
//                     await User.findByIdAndDelete(data.id)
//                     break;
//                 default:
//                     break;
//           }
//           return NextResponse.json({
//             message:'event received'
//           })
    
//  }


import { Webhook } from "svix";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGNING_SECRET);

  const headerPayload = headers();
  const svixHeader = {
    "svix-id": headerPayload.get("svix-id") || "",
    "svix-signature": headerPayload.get("svix-signature") || "",
    "svix-timestamp": headerPayload.get("svix-timestamp") || "",
  };

  try {
    // Await payload parsing
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const { data, type } = wh.verify(body, svixHeader);

    // Connect to DB
    await dbConnect();

    const userData = {
      _id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log("Unhandled event type:", type);
    }

    return NextResponse.json({ message: "Event received" });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
}
