import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payload Admin',
  description: 'Admin panel for managing content',
}

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => {
  return <>{children}</>
}

export default Layout