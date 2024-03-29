import { useEffect} from "react"
import { useParams, Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/modalEliminarTarea"
import ModalEliminarColaborador from "../components/modalEliminarColaborador"
import Tarea from '../components/Tarea'
import Alerta from "../components/Alerta"
import Colaborador from "../components/Colaborador"
import io from 'socket.io-client'

let socket

const Proyecto = () => {

    const params = useParams()
    const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea} = useProyectos()
    const admin = useAdmin()

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id)
    }, [])

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id){
                submitTareasProyecto(tareaNueva)
            }
        })
        socket.on('tarea eliminada', tareaEliminada => {
            if(tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto._id === proyecto._id){
                actualizarTareaProyecto(tareaActualizada)
            }
        })
        socket.on('nuevo estado', nuevoEstadoTarea => {
            if(nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })

    const {nombre} = proyecto
    if(cargando) return <div className="px-5 py-10">'Cargando...'</div> 

    const {msg} = alerta

    return (
        <>
            <div className="flex justify-between px-5 py-10">
                <h1 className="font-black text-4xl">{nombre}</h1>

                {admin && (
                    <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <Link 
                            to={`/proyectos/editar/${params.id}`}
                            className="uppercase font-bold"
                            >Editar</Link>
                    </div>
                )}
            </div>  
                {admin && (
                    <button 
                        onClick={handleModalTarea}
                        type="button"
                        className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white flex gap-2 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Nueva tarea
                    </button>
                )}
                
                <p className="font-bold text-xl mt-10">Tareas del proyecto</p>

                <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.tareas?.length ? 
                    proyecto.tareas?.map(tarea => (
                        <Tarea
                            key={tarea._id}
                            tarea={tarea}
                        />
                    )) : 
                    <p className="text-center my-5 p-10">No hay tareas en este proyecto
                    </p>
                    }
                </div>
                {admin && (
                    <>
                        <div className="flex items-center justify-between">
                                <p className="font-bold text-xl mt-10">Colaboradores</p>
                                <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                    className="text-gray-400 hover:text-black uppercase font-bold pr-5">Añadir
                                </Link>
                        </div>
                        

                        <div className="bg-white shadow mt-10 rounded-lg">
                            {proyecto.colaboradores?.length ? 
                            proyecto.colaboradores?.map(colaborador => (
                                <Colaborador
                                    key={colaborador._id}
                                    colaborador={colaborador}
                                />
                            )) : 
                            <p className="text-center my-5 p-10">No hay Colaboradores en este proyecto
                            </p>
                            }
                        </div>
                    </>
                )}
                

                <ModalFormularioTarea />
                <ModalEliminarTarea/>
                <ModalEliminarColaborador/>

        </>
    )
}

export default Proyecto