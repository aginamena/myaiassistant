import Users from "@/lib/models"
import mongoose from "mongoose"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extend the Session and User types to include 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | unknown;
      name?: string | null;
      email?: string | null;
      image?: string | unknown;
    }
  }
  interface User {
    id?: string | unknown;
    name?: string | null;
    email?: string | null;
    image?: string | unknown;
  }
}

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
      const profile = await Users.findOne({email:user.email})
      console.log(profile)
      if(!profile){
        Users.insertOne(user)
      }
      return true;
    }
    ,
    async session({ session, token }) {
    session.user.email = token.email
    session.user.id= token.id 
    session.user.name=token.name
    session.user.image=token.image
      return session;
    },
    async jwt({token, user}) {
        if(user){
            token.email = user.email
            token.name = user.name
            token.id = user.id
            token.image=user.image
        }
        return token
    },

  },
  secret:process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }