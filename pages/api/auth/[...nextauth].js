import NextAuth from 'next-auth'
import EmailProvider   from 'next-auth/providers/email'
import TwitterProvider from 'next-auth/providers/twitter'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {PrismaClient}  from '@prisma/client'
import prisma          from '../../../lib/prisma'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from:   process.env.EMAIL_FROM
    })
  ],
})
