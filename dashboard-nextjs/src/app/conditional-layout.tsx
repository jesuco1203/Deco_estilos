'use client'

import { usePathname } from 'next/navigation'
import DashboardLayout from './dashboard-layout'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return <>{children}</>
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
