"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<{ id: string; nombre: string; codigo: string }[]>([]);
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [modoEdicion, setModoEdicion] = useState<string | null>(null);
    const [nombreEditado, setNombreEditado] = useState("");
    const [isMounted, setIsMounted] = useState(false);


    const usuariosCollection = collection(db, "usuarios");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cargar usuarios desde Firestore
    useEffect(() => {
        if (isMounted) {
            const fetchUsuarios = async () => {
                const data = await getDocs(usuariosCollection);
                setUsuarios(data.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any)));
            };
            fetchUsuarios();
        }
    }, [isMounted]);

    if (!isMounted) return null;


    // Agregar usuario
    const agregarUsuario = async () => {
        if (!nombre || !codigo) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const existeidentificador = usuarios.some((usuario) => usuario.codigo === codigo);
        if (existeidentificador) {
            alert("Ya existe un usuario con este codigo.");
            return;
        }

        const docRef = await addDoc(usuariosCollection, { nombre, codigo });
        setUsuarios([...usuarios, { id: docRef.id, nombre, codigo }]);

        setNombre("");
        setCodigo("");
        alert("Usuario creado correctamente.");
    };

    // Activar modo edición
    const activarEdicion = (usuario: any) => {
        setModoEdicion(usuario.id);
        setNombreEditado(usuario.nombre);
    };

    // Guardar cambios de edición
    const guardarEdicion = async (id: string) => {
        const userDoc = doc(db, "usuarios", id);
        await updateDoc(userDoc, { nombre: nombreEditado });

        setUsuarios(
            usuarios.map((usuario) =>
                usuario.id === id ? { ...usuario, nombre: nombreEditado } : usuario
            )
        );
        setModoEdicion(null);
        alert("Usuario editado correctamente.");
    };

    // Eliminar usuario
    const eliminarUsuario = async (id: string, codigo: String) => {
        const codigoIngresado = prompt("Ingrese el código del usuario que desea eliminar para confirmar:");

        if (!codigoIngresado) {
            alert("Operación cancelada.");
            return;
        }
        if (codigoIngresado !== codigo) {
            alert("Código incorrecto. No se eliminó el usuario.");
            return;
        }

        await deleteDoc(doc(db, "usuarios", id));
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        alert("Usuario eliminado correctamente.");
    };

    return (
        <div className="box_principal">
            <div className="barra_lateral">
                <div className="formularioCrear">
                    <br />
                    <br />
                    <div className="formTitulo">Creación de Usuario Fiscalizador</div>
                    <br />
                    <br />
                    <br />
                    <input
                        type="text"
                        placeholder="Nombre del Fiscalizador"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="campoTxtCrear"
                    />
                    <input
                        type="text"
                        placeholder="Código"
                        value={codigo.toUpperCase()}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/\s/g, ""))}
                        className="campoTxtCrear"
                    />
                    <button onClick={agregarUsuario} className="buttonCrear">
                        Crear Usuario
                    </button>
                </div>
            </div>

            <div className="container_principal">
                <br />
                <h1 className="box_title">GESTIÓN DE USUARIOS FISCALIZADORES</h1>
                <br />
                <br />
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="item_usuario">
                        {modoEdicion === usuario.id ? (
                            // Modo edición
                            <div className="item_usuario_vista">
                                <input
                                    type="text"
                                    value={nombreEditado}
                                    onChange={(e) => setNombreEditado(e.target.value)}
                                    className="textoNameUser"
                                />
                                <div className="botones">
                                    <button
                                        onClick={() => guardarEdicion(usuario.id)}
                                        className="btn_user_edit"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => setModoEdicion(null)}
                                        className="btn_user_edit"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Modo vista
                            <div className="item_usuario_vista">
                                <div
                                    className="textoNameUser"
                                >
                                    {usuario.nombre}
                                </div>
                                <div className="botones">
                                    <button
                                        onClick={() => activarEdicion(usuario)}
                                        className="btn_user_edit"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(usuario.id, usuario.codigo)}
                                        className="btn_user_edit"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Usuarios;
