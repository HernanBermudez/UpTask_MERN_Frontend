import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const Registrar = () => {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()
        if ([nombre, email, password, repetirPassword].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        if (password !== repetirPassword){
            setAlerta({
                msg: 'Las contraseñas no coinciden',
                error: true
            })
            return
        }
        if (password.length < 7){
            setAlerta({
                msg: 'Contraseña muy débil. Debe tener mínimo de 7 caracteres',
                error: true
            })
            return
        }
        setAlerta({})
        // Ahora a crear el usuario en la API
        try {
            // todo: mover hacia cliente axios
            const {data} = await clienteAxios.post('/usuarios', {nombre, email, password})

            setAlerta({
                msg: data.msg,
                error: false
            })

            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const {msg } = alerta

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu cuenta y administra tus {''} 
            <span className="text-slate-700">proyectos</span>
        </h1>

        {msg && <Alerta alerta={alerta}/>}

        <form 
            className="my-10 bg-white shadow rounded-lg p-5"
            onSubmit={handleSubmit}
        >

            <div className="my-5">
                <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
                <input type="text" id="nombre" placeholder="Tu nombre" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            <div className="my-5">
                <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
                <input type="email" id="email" placeholder="Email de registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>

            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
                <input type="password" id="password" placeholder="Password de registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Repetir Contraseña</label>
                <input type="password" id="password2" placeholder="Repite tu contraseña" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)}/>
            </div>

            <input type="submit" value="Crear cuenta" className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" name="" id="" />

        </form>

        <nav className="lg:flex lg:justify-between">
            <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="/">¿Ya tienes una cuenta? Inicia sesión
            </Link>

            <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="olvide-password">Olvidé mi contraseña
            </Link>
        </nav>
      </>
  )
}

export default Registrar