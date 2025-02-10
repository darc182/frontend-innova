import {useEffect,useState} from 'react'
import {useParams,Link} from 'react-router-dom' 
import clienteAxios from '../config/axios'
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [alerta, setAlerta] = useState({})

  const params =  useParams()
  const {id} =  params
  
  useEffect(()=>{
    const confirmarCuenta = async ()=>{
      try {
        const url = `usuarios/confirmar/${id}`;

        const {data} =  await clienteAxios(url);
        
        setCuentaConfirmada(true)
        setAlerta({
          msg: data.msg
        })
        
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
        
      }

      setCargando(false);
    }

    confirmarCuenta();
  }, [])
  
  return (
    <>
        <div>
          <h1 className="text-indigo-600 font-black text-6xl">Confirma tu Cuenta y Comienza a {''}<span className="text-black">tus comprar</span></h1>
        </div>

        <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>

          {/* cuando ya no este cargando  entonces muestra la alerta*/}
          {!cargando && <Alerta
            alerta={alerta}
          />}

          {
            cuentaConfirmada && (
              <Link className='block text-center my-5 text-gray-500' to="/auth">Iniciar Sesion</Link>
            )
          }
        </div>
     </>
  )
}

export default ConfirmarCuenta