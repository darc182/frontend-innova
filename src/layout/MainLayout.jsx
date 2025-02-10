// ./layout/MainLayout.jsx
import { Outlet} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Categorias from '../components/Categorias';


const MainLayout = () => {
  

  return (
    <>
      <Header/>

        <Categorias/>
      <main className="container mx-auto my-8 px-4">
        <Outlet />
      </main>

      <Footer/>
    </>
  );
};

export default MainLayout;
