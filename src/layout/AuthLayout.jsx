import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const AuthLayout = () => {
  return (
    <>
    <Header/>
     <main className='container mx-auto md:grid md:grid-cols-2 mt-12 gap-10 p-5 items-center'>
        <Outlet/> 
     </main>
     
    
    </>
    

  )
}

export default AuthLayout