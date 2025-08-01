import { Users } from "@/lib/models"
import mongoose from "mongoose"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  })
  ],
  callbacks: {
    async signIn({user}) {
      await mongoose.connect(process.env.MONGODB_URI as string);
      await Users.updateOne({email:user.email}, {$set :user}, {upsert:true})
      return true;
    },
  },
  secret:process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
