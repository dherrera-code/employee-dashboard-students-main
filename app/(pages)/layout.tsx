import NavbarComponent from '@/components/Navbar';
import { getCookie } from '@/lib/shared/cookies/cookies'
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const email = await getCookie('Email');

  if(!email)
    redirect('/login');

  return (
    <div>
      <NavbarComponent email={email} />
      {children}
    </div>
  )
}

export default layout