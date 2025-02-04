"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

const Proyectos: React.FC = () => {
    const [codigo, setCodigo] = useState("");
    const [nombreFiscalizador, setnombreFiscalizador] = useState("");
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [selectedProyecto, setSelectedProyecto] = useState<any | null>(null); // Proyecto seleccionado
    const [nuevoProyecto, setNuevoProyecto] = useState<any>({
        codFiscalizador: "",
        nombreProyecto: "",
        tecnicoResponsable: "",
        estadoProceso: "",
        presupuesto: "",
        avance: "",
        procContratacion: "",
        codContratacion: "",
        contratista: "",
        fchAdjudicacion: "",
        admiContrato: "",
        fiscalizador: "",
        comisionCalificar: [],
        fchPublicacion: "",
        actaProvisional: "",
        actaDefinitiva: "",
        planillas: [],
        ampliaciones: [],
        incremVolumenes: "",
        contrComplementario: "",
        estadoActproyecto: ""
    });
    const [mensajeError, setMensajeError] = useState("");


    // Obtener proyectos por cédula
    const buscarProyectos = async () => {
        try {
            setMensajeError(""); // Limpiar mensajes anteriores

            //Buscar si el usuario con ese código existe en "usuarios"
            const usuariosRef = collection(db, "usuarios");
            const usuarioQuery = query(usuariosRef, where("codigo", "==", codigo));
            const usuarioSnapshot = await getDocs(usuarioQuery);

            if (usuarioSnapshot.empty) {
                setMensajeError("Código incorrecto");
                setProyectos([]);
                setNuevoProyecto({
                    ...nuevoProyecto,
                    fiscalizador: nombreFiscalizador // Limpiar el campo de fiscalizador si no existe
                });
                return;
            }

            const usuarioData = usuarioSnapshot.docs[0].data();
            const fiscalizadorNombre = usuarioData.nombre || "";
            setnombreFiscalizador(fiscalizadorNombre);

            // Buscar proyectos en "proyectos" con el mismo código
            const proyectosRef = collection(db, "proyectos");
            const proyectosQuery = query(proyectosRef, where("codFiscalizador", "==", codigo));
            const proyectosSnapshot = await getDocs(proyectosQuery);

            if (proyectosSnapshot.empty) {
                setMensajeError("Fiscalizador sin proyectos");
                setProyectos([]);
                return;
            }

            // 3️⃣ Extraer y guardar los proyectos
            const proyectosData = proyectosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProyectos(proyectosData);
            setSelectedProyecto(null); // Limpiar selección previa


        } catch (error) {
            console.error("Error al buscar proyectos:", error);
            setMensajeError("Ocurrió un error al buscar los proyectos.");
        }
    };

    // Manejar selección de un proyecto
    const seleccionarProyecto = (proyecto: any) => {
        setSelectedProyecto(proyecto);
        setNuevoProyecto(proyecto); // Autocompletar el formulario con datos existentes
    };

    // Crear un nuevo proyecto
    const crearProyecto = () => {
        setNuevoProyecto({
            codFiscalizador: codigo,
            nombreProyecto: "",
            tecnicoResponsable: "",
            estadoProceso: "",
            presupuesto: "",
            avance: "",
            procContratacion: "",
            codContratacion: "",
            contratista: "",
            fchAdjudicacion: "",
            admiContrato: "",
            fiscalizador: nombreFiscalizador,
            comisionCalificar: [],
            fchPublicacion: "",
            actaProvisional: "",
            actaDefinitiva: "",
            planillas: [],
            ampliaciones: [],
            incremVolumenes: "",
            contrComplementario: "",
            estadoActproyecto: ""
        });
        setSelectedProyecto(null);
    };

    // Guardar o actualizar proyecto
    const guardarProyecto = async () => {
        if (!nuevoProyecto.codFiscalizador.trim()) {
            alert("El identificador del Fiscalizador es obligatorio.");
            return;
        }
        if (!nuevoProyecto.nombreProyecto.trim()) {
            alert("El nombre del proyecto es obligatorio.");
            return;
        }

        if (selectedProyecto) {
            // Actualizar proyecto existente
            const proyectoRef = doc(db, "proyectos", selectedProyecto.id);
            await updateDoc(proyectoRef, nuevoProyecto);
            alert("Proyecto actualizado");
        } else {
            // Crear nuevo proyecto
            const proyectoVacio = {
                codFiscalizador: codigo,
                ...nuevoProyecto,
            };
            const docRef = await addDoc(collection(db, "proyectos"), proyectoVacio);
            alert("Proyecto creado");
        }
        buscarProyectos(); // Refrescar lista
    };

    // Eliminar proyecto
    const eliminarProyecto = async () => {
        if (selectedProyecto) {
            const confirmar = confirm(`¿Estás seguro de eliminar el proyecto "${selectedProyecto.nombreProyecto}"?`);
            if (!confirmar) return;

            try {
                const proyectoRef = doc(db, "proyectos", selectedProyecto.id);
                await deleteDoc(proyectoRef);

                alert("Proyecto eliminado");

                setProyectos(proyectos.filter(proyecto => proyecto.id !== selectedProyecto.id));
                setSelectedProyecto(null);
                setNuevoProyecto({});

            } catch (error) {
                console.error("Error al eliminar el proyecto:", error);
                alert("Hubo un error al eliminar el proyecto.");
            }
        } else {
            alert("No hay un proyecto seleccionado para eliminar.");
        }
    };

    return (
        <div className="box_principal">
            <div className="barra_lateral">
                <div className="flex space-x-4 mb-4">
                    <br />
                    <br />
                    <div className="formTitulo">
                        Listado de proyectos
                    </div>
                    <br />
                    <br />
                    <br />
                    <input
                        type="text"
                        placeholder="Código Fiscalizador"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                        className="campoTxtBuscar"
                    />
                    <button
                        onClick={buscarProyectos}
                        className="btnBuscar"
                    >
                        Buscar
                    </button>
                </div>
                {mensajeError && <p className="mensajeError">{mensajeError}</p>}
                {/* Lista de proyectos */}
                <br />
                <div style={{ padding: "0 6%" }}>
                    <strong>Proyectos:</strong>
                </div>
                <br />
                <div className="listadoProyectos">
                    {proyectos.map((proyecto) => (
                        <button
                            key={proyecto.id}
                            onClick={() => seleccionarProyecto(proyecto)}
                            className="buttonObra"
                        >
                            {proyecto.nombreProyecto}
                        </button>
                    ))}
                </div>
                <br />
                <br />
                <button onClick={crearProyecto} className="buttonCrear">
                    Crear Nuevo Proyecto
                </button>
            </div>
            <div className="container_principal">
                <br />
                <h1 className="box_title">PROYECTOS</h1>
                {/* Formulario del proyecto */}
                <div className="border p-4 rounded bg-gray-50">

                    <form>
                        {/* Botón Guardar */}
                        <div className="encabezado_formulario">
                            <h3 className="subtituloProyectos">Formulario del Proyecto</h3>

                            <div className="boxGuardar">
                                <button
                                    type="button"
                                    onClick={guardarProyecto}
                                    className="buttonActualizar"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                        {/* input_campos del formulario */}
                        <div className="formularioProyecto">
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    <strong>Proyecto:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={nuevoProyecto.nombreProyecto || ""}
                                    onChange={(e) =>
                                        setNuevoProyecto({
                                            ...nuevoProyecto,
                                            nombreProyecto: e.target.value,
                                        })
                                    }
                                    className="input_campos"
                                />
                            </div>
                            <div className="box_dos div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        <strong>Fiscalizador:</strong>
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.fiscalizador || nombreFiscalizador}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                fiscalizador: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />

                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Estado del proceso:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.estadoProceso || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                estadoProceso: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>

                            </div>
                            <div className="box_dos div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Proceso contratación:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.procContratacion || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                procContratacion: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Código contratación:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.codContratacion || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                codContratacion: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>

                            </div>

                            <div className="box_dos div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Presupuesto inicial:
                                    </label>
                                    <span>$</span>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.presupuesto || ""}
                                        onChange={(e) => {
                                            const inputValue1 = e.target.value;
                                            let numericValue1 = inputValue1.replace(/[^0-9,]/g, "");

                                            const parts1 = numericValue1.split(",");
                                            const integerPart1 = parts1[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                            const decimalPart1 = parts1[1] !== undefined ? "," + parts1[1].slice(0, 2) : "";

                                            const formattedValue1 = integerPart1 + decimalPart1;
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                presupuesto: formattedValue1,
                                            });
                                        }}
                                        className="money_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        <strong>Avance:</strong>
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.avance}
                                        onChange={(e) => {
                                            const inputValue2 = e.target.value;
                                            let numericValue2 = inputValue2.replace(/[^0-9,]/g, "");

                                            const parts2 = numericValue2.split(",");
                                            const integerPart2 = parts2[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                            const decimalPart2 = parts2[1] !== undefined ? "," + parts2[1].slice(0, 2) : "";

                                            const formattedValue2 = integerPart2 + decimalPart2;
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                avance: formattedValue2,
                                            });
                                        }}
                                        className="porcent_campo"
                                    />
                                    <div style={{ color: "#c20000" }}><strong>%</strong></div>
                                </div>

                            </div>
                            <div className="div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Administrador de Contrato:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.admiContrato || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                admiContrato: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>

                            </div>
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    Contratista:
                                </label>
                                <input
                                    type="text"
                                    value={nuevoProyecto.contratista || ""}
                                    onChange={(e) =>
                                        setNuevoProyecto({
                                            ...nuevoProyecto,
                                            contratista: e.target.value,
                                        })
                                    }
                                    className="input_campos"
                                />
                            </div>

                            <div className="box_dos div_row">
                                <div>
                                    <label className="label_campo">
                                        Fecha de publicación:
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevoProyecto.fchPublicacion || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                fchPublicacion: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                                <div>
                                    <label className="label_campo">
                                        Fecha estimada de adjudicación:
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevoProyecto.fchAdjudicacion || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                fchAdjudicacion: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                            </div>

                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    <strong>Técnico responsable:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={nuevoProyecto.tecnicoResponsable || ""}
                                    onChange={(e) =>
                                        setNuevoProyecto({
                                            ...nuevoProyecto,
                                            tecnicoResponsable: e.target.value,
                                        })
                                    }
                                    className="input_campos"
                                />
                            </div>

                            <div className="box_cuatro div_row">
                                <label className="label_campo">
                                    Comisión técnica para calificar:
                                </label>
                                <div className="campo_container">
                                    <input
                                        type="text"
                                        value={nuevoProyecto.comisionCalificar[0] || ""}
                                        onChange={(e) => {
                                            const nuevosCalificadores = [...nuevoProyecto.comisionCalificar];
                                            nuevosCalificadores[0] = e.target.value;
                                            setNuevoProyecto({ ...nuevoProyecto, comisionCalificar: nuevosCalificadores });
                                        }}
                                        placeholder="Encargado 1"
                                        className="input_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <input
                                        type="text"
                                        value={nuevoProyecto.comisionCalificar[1] || ""}
                                        onChange={(e) => {
                                            const nuevosCalificadores = [...nuevoProyecto.comisionCalificar];
                                            nuevosCalificadores[1] = e.target.value;
                                            setNuevoProyecto({ ...nuevoProyecto, comisionCalificar: nuevosCalificadores });
                                        }}
                                        placeholder="Encargado 2"
                                        className="input_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <input
                                        type="text"
                                        value={nuevoProyecto.comisionCalificar[2] || ""}
                                        onChange={(e) => {
                                            const nuevosCalificadores = [...nuevoProyecto.comisionCalificar];
                                            nuevosCalificadores[2] = e.target.value;
                                            setNuevoProyecto({ ...nuevoProyecto, comisionCalificar: nuevosCalificadores });
                                        }}
                                        placeholder="Encargado 3"
                                        className="input_campos"
                                    />
                                </div>
                            </div>

                            <div className="box_dos div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Acta provisional:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.actaProvisional || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                actaProvisional: e.target.value,
                                            })
                                        }
                                        className="input_campos"

                                    />
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Acta definitiva:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.actaDefinitiva || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                actaDefinitiva: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                            </div>

                            {/* PLANILLAS */}
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    Planillas:
                                </label>
                                <div className="filaFormulario">
                                    <div className="input_group">
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[0] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(1),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 1"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[1] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(2),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 2"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[2] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(3),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 3"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[3] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(4),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 4"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[4] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        nuevoProyecto.planillas[3],
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(5),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 5"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[5] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        nuevoProyecto.planillas[3],
                                                        nuevoProyecto.planillas[4],
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(6),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 6"
                                        />
                                    </div>

                                    {/* Segunda fila de 6 inputs */}

                                    <div className="input_group">
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[6] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 6),
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(7),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 7"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[7] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 7),
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(8),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 8"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[8] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 8),
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(9),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 9"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[9] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 9),
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(10),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 10"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[10] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 10),
                                                        formattedValue,
                                                        ...nuevoProyecto.planillas.slice(11),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 11"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[11] || ""}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let numericValue = inputValue.replace(/[^0-9,]/g, "");

                                                const parts = numericValue.split(",");
                                                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                                const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

                                                const formattedValue = integerPart + decimalPart;
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 11),
                                                        formattedValue,
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 12"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* AMPLIACIONES */}
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    Ampliaciones:
                                </label>
                                <div className="input_group_ampliaciones">
                                    <input
                                        type="text"
                                        value={nuevoProyecto.ampliaciones[0] || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                ampliaciones: [
                                                    numericValue,
                                                    nuevoProyecto.ampliaciones[1] || "",
                                                    nuevoProyecto.ampliaciones[2] || "",
                                                    nuevoProyecto.ampliaciones[3] || "",
                                                    nuevoProyecto.ampliaciones[4] || "",
                                                ],
                                            });
                                        }}
                                        className="input_ampliaciones"
                                        placeholder="Ampliación 1"
                                    />
                                    <span>días</span>

                                    <input
                                        type="text"
                                        value={nuevoProyecto.ampliaciones[1] || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                ampliaciones: [
                                                    nuevoProyecto.ampliaciones[0] || "",
                                                    numericValue,
                                                    nuevoProyecto.ampliaciones[2] || "",
                                                    nuevoProyecto.ampliaciones[3] || "",
                                                    nuevoProyecto.ampliaciones[4] || "",
                                                ],
                                            });
                                        }}
                                        className="input_ampliaciones"
                                        placeholder="Ampliación 2"
                                    />
                                    <span>días</span>

                                    <input
                                        type="text"
                                        value={nuevoProyecto.ampliaciones[2] || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                ampliaciones: [
                                                    nuevoProyecto.ampliaciones[0] || "",
                                                    nuevoProyecto.ampliaciones[1] || "",
                                                    numericValue,
                                                    nuevoProyecto.ampliaciones[3] || "",
                                                    nuevoProyecto.ampliaciones[4] || "",
                                                ],
                                            });
                                        }}
                                        className="input_ampliaciones"
                                        placeholder="Ampliación 3"
                                    />
                                    <span>días</span>

                                    <input
                                        type="text"
                                        value={nuevoProyecto.ampliaciones[3] || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                ampliaciones: [
                                                    nuevoProyecto.ampliaciones[0] || "",
                                                    nuevoProyecto.ampliaciones[1] || "",
                                                    nuevoProyecto.ampliaciones[2] || "",
                                                    numericValue,
                                                    nuevoProyecto.ampliaciones[4] || "",
                                                ],
                                            });
                                        }}
                                        className="input_ampliaciones"
                                        placeholder="Ampliación 4"
                                    />
                                    <span>días</span>

                                    <input
                                        type="text"
                                        value={nuevoProyecto.ampliaciones[4] || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                ampliaciones: [
                                                    nuevoProyecto.ampliaciones[0] || "",
                                                    nuevoProyecto.ampliaciones[1] || "",
                                                    nuevoProyecto.ampliaciones[2] || "",
                                                    nuevoProyecto.ampliaciones[3] || "",
                                                    numericValue,
                                                ],
                                            });
                                        }}
                                        className="input_ampliaciones"
                                        placeholder="Ampliación 5"
                                    />
                                    <span>días</span>
                                </div>
                            </div>

                            <div className="box_dos div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Incremento volumenes:
                                    </label>
                                    <span>$ </span>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.incremVolumenes || ""}
                                        onChange={(e) => {
                                            const inputVolum = e.target.value;
                                            let numericValueVol = inputVolum.replace(/[^0-9,]/g, "");

                                            const parts1 = numericValueVol.split(",");
                                            const integerPart1 = parts1[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                            const decimalPart1 = parts1[1] !== undefined ? "," + parts1[1].slice(0, 2) : "";

                                            const formattedValueVol = integerPart1 + decimalPart1;
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                incremVolumenes: formattedValueVol,
                                            });
                                        }}
                                        className="money_campos"
                                    />

                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Contrato complementario:
                                    </label>
                                    <span>$ </span>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.contrComplementario || ""}
                                        onChange={(e) => {
                                            const inputComplementario = e.target.value;
                                            let numericValueCompl = inputComplementario.replace(/[^0-9,]/g, "");

                                            const parts1 = numericValueCompl.split(",");
                                            const integerPart1 = parts1[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
                                            const decimalPart1 = parts1[1] !== undefined ? "," + parts1[1].slice(0, 2) : "";

                                            const formattedValueCompl = integerPart1 + decimalPart1;
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                contrComplementario: formattedValueCompl,
                                            });
                                        }}
                                        className="money_campos"
                                    />
                                </div>

                            </div>
                            <div className="div_row2 campo_container">
                                <label className="label_campo">
                                    <strong>Estado actual del proyecto:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={nuevoProyecto.estadoActproyecto || ""}
                                    onChange={(e) =>
                                        setNuevoProyecto({
                                            ...nuevoProyecto,
                                            estadoActproyecto: e.target.value,
                                        })
                                    }
                                    className="input_campos"
                                />
                            </div>
                        </div>
                        <div className="box_button_delete_guardar">
                            <button
                                type="button"
                                onClick={eliminarProyecto}
                                className="button_eliminar"
                            >
                                Eliminar Proyecto
                            </button>
                            <button
                                type="button"
                                onClick={guardarProyecto}
                                className="buttonActualizar"
                            >
                                Guardar Cambios
                            </button>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    );
};

export default Proyectos;
