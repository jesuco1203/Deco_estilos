'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FiGrid, FiPlusSquare, FiLogOut } from 'react-icons/fi'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200"
  const activeLinkClasses = "bg-amber-500 text-white"

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold text-white mb-10">DecoEstilos</div>
        <nav className="flex-grow space-y-2">
          <Link href="/" className={`${linkClasses} ${pathname === '/' ? activeLinkClasses : ''}`}>
            <FiGrid className="mr-3" />
            <span>Productos</span>
          </Link>
          <Link href="/products/new" className={`${linkClasses} ${pathname === '/products/new' ? activeLinkClasses : ''}`}>
            <FiPlusSquare className="mr-3" />
            <span>Añadir Producto</span>
          </Link>
        </nav>
        <div>
          <button onClick={handleLogout} className={`${linkClasses} w-full`}>
            <FiLogOut className="mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
            {children}
        </div>
      </main>
    </div>
  )
}
