import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ReportItem from './pages/ReportItem'
import FoundItem from './pages/FoundItem'
import RecentItems from './pages/RecentItems'
import { ProtectedRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: '/how-it-works',
    element: (
      <>
        <Navbar />
        <HowItWorks />
        <Footer />
      </>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <Dashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: '/report',
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <ReportItem />
          <Footer />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: '/found',
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <FoundItem />
          <Footer />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: '/contact',
    element: (
      <>
        <Navbar />
        <Contact />
        <Footer />
      </>
    ),
  },
  {
    path: '/recent',
    element: (
      <>
        <Navbar />
        <RecentItems />
        <Footer />
      </>
    ),
  },
  {
    path: '/login',
    element: (
      <>
        <Login />
        <Footer />
      </>
    )
  },
  {
    path: '/register',
    element: (
      <>
        <Register />
        <Footer />
      </>
    )
  }
])
 

export default router