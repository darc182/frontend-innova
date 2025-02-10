import { useState,useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

const AuthContext =  createContext()

const AuthProvider = ({children}) =>{
    const [cargando, setCargando] = useState(true)
    const [auth, setAuth] = useState({})

    useEffect(()=>{
        const autenticarUsuario = async ()=>{
            const token = localStorage.getItem('token')

            if (!token) {
                setCargando(false)
                return
            }

            
            const config = {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                console.log("Datos recibidos del backend:", data);
                
                setAuth(data)
                
            } catch (error) {
                console.error(error.response?.data?.msg || 'Error al autenticar usuario');
                setAuth({})
                
            }

          setCargando(false)
        }

        autenticarUsuario()
    }, [])


    const cerrarSesion = ()=>{
        localStorage.removeItem('token')
        setAuth({})
    }


    const actualizarPerfil = async (datos) => {
        try {
            const { data } = await clienteAxios.put('/usuarios/actualizar-perfil', datos);
            setAuth(data); // Actualiza el estado con los nuevos datos
            return { msg: 'Perfil actualizado correctamente', error: false };
        } catch (error) {
            return { msg: error.response?.data?.msg || 'Error al actualizar el perfil', error: true };
        }
    };

    const cambiarPassword = async (datos) => {
        try {
            const { data } = await clienteAxios.put('/usuarios/cambiar-password', datos);
            return { msg: data.msg, error: false };
        } catch (error) {
            return { msg: error.response?.data?.msg || 'Error al cambiar la contraseña', error: true };
        }
    };

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                cambiarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export{
    AuthProvider
}

export default AuthContext