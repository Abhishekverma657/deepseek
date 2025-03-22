// import mongoose from "mongoose";
//  let cached= global.mongoose||{conn:null,promise:null};
//   export default async function dbConnect(){
//     if(cached.conn){
//         return cached.conn
//     }
//     if(!cached.conn){
//         cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose)=>{
//             return mongoose
//         })
//     }
//      try{
//          cached.conn= await cached.promise;
     
//         }
//             catch(err){
//                 console.log( "error in db conection ",err)
//             }
//             return cached.conn
//   }

import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
    if (cached.conn) {
        console.log("Using cached database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Creating new database connection...");
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((mongoose) => {
            console.log("Database connected successfully!");
            return mongoose;
        }).catch((err) => {
            console.error("Database connection error:", err);
            throw err; // Ensure function fails if DB connection fails
        });
    }

    try {
        cached.conn = await cached.promise;
        global.mongoose = cached; // Store cached connection globally
    } catch (err) {
        console.error("Error in DB connection:", err);
    }
    
    return cached.conn;
}
