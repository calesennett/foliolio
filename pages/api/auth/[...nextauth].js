import NextAuth from 'next-auth'
import EmailProvider   from 'next-auth/providers/email'
import TwitterProvider from 'next-auth/providers/twitter'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {PrismaClient}  from '@prisma/client'
import prisma          from '../../../lib/prisma'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      id: 'twitter',
      name: 'Twitter',
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    EmailProvider({
      id: 'email',
      server: process.env.EMAIL_SERVER,
      from:   process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    }
  }
})
