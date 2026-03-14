import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ReportItem from './pages/ReportItem'
import FoundItem from './pages/FoundItem'

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
    path: '/dashboard',
    element: (
    <>
    <Navbar/>
    <Dashboard />
    </>
    ),
  },
  {
    path: '/report',
    element: (
      <>
        <Navbar />
        <ReportItem />
        <Footer />
      </>
    ),
  },
  {
    path: '/found',
    element: (
      <>
        <Navbar />
        <FoundItem />
        <Footer />
      </>
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