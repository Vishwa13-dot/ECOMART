import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main key={pathname} className="flex-1 animate-page-in"><Outlet /></main>
      <Footer />
    </div>
  )
}
