'use client'
import { useSession, signOut} from "next-auth/react";
import React from 'react'

const Logout = () => {
  const { data: session } = useSession();
    signOut({ callbackUrl: "/" })
  return (
    <div>
      
    </div>
  )
}

export default Logout
