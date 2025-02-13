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
    const [nombreUsusario, setNombreUsuario] = useState("");
    const [nombreFiscalizador, setnombreFiscalizador] = useState("");
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [selectedProyecto, setSelectedProyecto] = useState<any | null>(null); // Proyecto seleccionado
    const initialProyecto = {
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
        comisionCalificar: ["", "", ""], // Asegura que siempre haya un array con valores
        fchPublicacion: "",
        actaProvisional: "",
        actaDefinitiva: "",
        planillas: [],
        reajustes: [],
        ampliaciones: [],
        incremVolumenes: "",
        contrComplementario: "",
        estadoActproyecto: "",
        plazo: "",
        fchAnticipo: "",
        fchInicio: "",
        fchTerminacion: "",
        costoPorcent: "",
        observ: ""
    };
    const [nuevoProyecto, setNuevoProyecto] = useState<any>(initialProyecto);
    const [mensajeError, setMensajeError] = useState("");
    const [existeProyectos, setExisteProyectos] = useState(false);
    const [habilitado, setHabilitado] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string | null>(null);

    useEffect(() => {
        if (nuevoProyecto.fchInicio) {
            const fechaInicio = new Date(nuevoProyecto.fchInicio);
            let diasPlazo = parseInt(nuevoProyecto.plazo, 10) || 0;

            // Sumar todas las ampliaciones
            let diasAmpliaciones = nuevoProyecto.ampliaciones.reduce((total: number, dias: any) => {
                return total + (parseInt(dias, 10) || 0);
            }, 0);

            // Calcular la nueva fecha de terminación
            const totalDias = diasPlazo + diasAmpliaciones;
            if (totalDias > 0) {
                fechaInicio.setDate(fechaInicio.getDate() + totalDias);
                const fechaTerminacion = fechaInicio.toISOString().split("T")[0]; // Formato YYYY-MM-DD

                setNuevoProyecto((prev: any) => ({
                    ...prev,
                    fchTerminacion: fechaTerminacion,
                }));
            }
        }
    }, [nuevoProyecto.fchInicio, nuevoProyecto.plazo, nuevoProyecto.ampliaciones]);

    // Obtener proyectos por cédula
    const buscarProyectos = async () => {
        try {
            setMensajeError("");
            const usuariosRef = collection(db, "usuarios");
            const usuarioQuery = query(usuariosRef, where("codigo", "==", codigo));
            const usuarioSnapshot = await getDocs(usuarioQuery);

            if (usuarioSnapshot.empty) {
                setExisteProyectos(false);
                setHabilitado(false);
                setMensajeError("Código incorrecto");
                setProyectos([]);
                setnombreFiscalizador("");
                return;
            }

            const usuarioData = usuarioSnapshot.docs[0].data();
            setNombreUsuario(usuarioData.nombre || "");

            const proyectosRef = collection(db, "proyectos");
            const proyectosQuery = query(proyectosRef, where("codFiscalizador", "==", codigo));
            const proyectosSnapshot = await getDocs(proyectosQuery);

            if (proyectosSnapshot.empty) {
                setExisteProyectos(true);
                setHabilitado(false);
                setMensajeError("Fiscalizador sin proyectos");
                setProyectos([]);
                return;
            }

            const proyectosData = proyectosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProyectos(proyectosData);
            setSelectedProyecto(null);
            setExisteProyectos(true);
            setProyectoSeleccionado(null);
            setNuevoProyecto(initialProyecto);
            setnombreFiscalizador("");
        } catch (error) {
            console.error("Error al buscar proyectos:", error);
            setMensajeError("Ocurrió un error al buscar los proyectos.");
        }
    };

    // Manejar selección de un proyecto
    const seleccionarProyecto = (proyecto: any) => {
        setHabilitado(true);
        setSelectedProyecto(proyecto);
        setNuevoProyecto(proyecto); // Autocompletar el formulario con datos existentes
        setProyectoSeleccionado(proyecto.id);
    };

    // Crear un nuevo proyecto
    const crearProyecto = () => {
        if (existeProyectos) {
            setHabilitado(true);
        } else {
            setHabilitado(false);
        }

        setNuevoProyecto({
            ...initialProyecto,
            codFiscalizador: codigo,
            fiscalizador: nombreFiscalizador,
        });
        setnombreFiscalizador(nombreUsusario);
        setSelectedProyecto(null);

    };

    // Guardar o actualizar proyecto
    const guardarProyecto = async () => {
        try {
            if (!nuevoProyecto.codFiscalizador.trim() || !nuevoProyecto.nombreProyecto.trim()) {
                alert("El código del fiscalizador y el nombre del proyecto son obligatorios.");
                return;
            }

            if (selectedProyecto) {
                const proyectoRef = doc(db, "proyectos", selectedProyecto.id);
                const { id, ...data } = nuevoProyecto;
                await updateDoc(proyectoRef, data);
                alert("Proyecto actualizado");
            } else {
                const docRef = await addDoc(collection(db, "proyectos"), {
                    codFiscalizador: codigo,
                    ...nuevoProyecto,
                });
                alert("Proyecto creado");
            }
            await buscarProyectos();
        } catch (error) {
            console.error("Error al guardar proyecto:", error);
        }
    };

    // Eliminar proyecto
    const eliminarProyecto = async () => {
        try {
            if (!selectedProyecto) {
                alert("No hay un proyecto seleccionado para eliminar.");
                return;
            }

            const confirmar = confirm(`¿Estás seguro de eliminar el proyecto "${selectedProyecto.nombreProyecto}"?`);
            if (!confirmar) return;

            const proyectoRef = doc(db, "proyectos", selectedProyecto.id);
            await deleteDoc(proyectoRef);
            alert("Proyecto eliminado");

            setProyectos((prev) => prev.filter(proyecto => proyecto.id !== selectedProyecto.id));
            setSelectedProyecto(null);
            setNuevoProyecto({ ...initialProyecto, codFiscalizador: codigo, fiscalizador: nombreFiscalizador });

            await buscarProyectos();
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            alert("Hubo un error al eliminar el proyecto.");
        }
    };

    const formatearNumerosDollar = (inputValue: string): string => {
        let numericValue = inputValue.replace(/[^0-9,]/g, "");

        const parts = numericValue.split(",");
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
        const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

        return integerPart + decimalPart;
    };

    const calcularTotal = (valores: (string | undefined)[]) => {
        const total = valores
            .map((v) => v ?? "0")
            .map((v) => v.replace(/\./g, "").replace(",", ".")) // Convierte a formato numérico correcto
            .map((v) => parseFloat(v) || 0) // Convierte a número
            .reduce((acc, num) => acc + num, 0); // Suma total

        return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
    };


    return (
        <div className="box_principal">
            <div className="barra_lateral">
                <div className="flex space-x-4 mb-4 no-print">
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
                        onKeyDown={(e) => e.key === "Enter" && buscarProyectos()}
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
                <div style={{ padding: "0 6%" }} className="no-print">
                    <strong>Proyectos:</strong>
                </div>
                <br />
                <div className="listadoProyectos no-print">
                    {proyectos.map((proyecto) => (
                        <button
                            key={proyecto.id}
                            onClick={() => seleccionarProyecto(proyecto)}
                            className={`buttonObra ${proyectoSeleccionado === proyecto.id ? "seleccionado" : ""}`}
                        >
                            {proyecto.nombreProyecto}
                        </button>
                    ))}
                </div>
                <br />
                <br />
                <button onClick={crearProyecto} className="buttonCrear no-print">
                    Crear Nuevo Proyecto
                </button>
            </div>
            <div className="container_principal">
                <br />
                <h1 className="box_title no-print">PROYECTOS</h1>
                {/* Formulario del proyecto */}
                <div>
                    <form>
                        {/* Botón Guardar */}
                        <div className={`encabezado_formulario ${habilitado ? "" : "deshabilitado"}`}>
                            <h3 className="subtituloProyectos no-print">Formulario del Proyecto</h3>

                            <div className="boxGuardar">
                                <button
                                    type="button"
                                    onClick={guardarProyecto}
                                    className="buttonActualizar no-print"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                        {/* input_campos del formulario */}
                        <div className={`formularioProyecto ${habilitado ? "" : "deshabilitado"}`}>
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
                                            const formattedValue1 = formatearNumerosDollar(e.target.value);
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
                                            const formattedValue2 = formatearNumerosDollar(e.target.value);
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
                                    <label className="label_campo no-print">
                                        Fecha estimada de adjudicación:
                                    </label>
                                    <label className="label_oculto">
                                        Fecha estimada adjudicación:
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
                                        value={nuevoProyecto.comisionCalificar?.[0] || ""}
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
                                        value={nuevoProyecto.comisionCalificar?.[1] || ""}
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
                                        value={nuevoProyecto.comisionCalificar?.[2] || ""}
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
                            <div className="div_row campo_container_planillas">
                                <label className="label_campo">
                                    Planillas y Reajustes
                                </label>
                                <div className="filaFormulario">
                                    <div className="input_group">
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[0] || ""}
                                            onChange={(e) => {
                                                const formattedValuep1 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        formattedValuep1,
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
                                            value={nuevoProyecto.reajustes[0] || ""}
                                            onChange={(e) => {
                                                const formattedValuer1 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        formattedValuer1,
                                                        ...nuevoProyecto.reajustes.slice(1),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 1"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[1] || ""}
                                            onChange={(e) => {
                                                const formattedValuep2 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        formattedValuep2,
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
                                            value={nuevoProyecto.reajustes[1] || ""}
                                            onChange={(e) => {
                                                const formattedValuer2 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        nuevoProyecto.reajustes[0],
                                                        formattedValuer2,
                                                        ...nuevoProyecto.reajustes.slice(2),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 2"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[2] || ""}
                                            onChange={(e) => {
                                                const formattedValuep3 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        formattedValuep3,
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
                                            value={nuevoProyecto.reajustes[2] || ""}
                                            onChange={(e) => {
                                                const formattedValuer3 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        nuevoProyecto.reajustes[0],
                                                        nuevoProyecto.reajustes[1],
                                                        formattedValuer3,
                                                        ...nuevoProyecto.reajustes.slice(3),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 3"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[3] || ""}
                                            onChange={(e) => {
                                                const formattedValuep4 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        formattedValuep4,
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
                                            value={nuevoProyecto.reajustes[3] || ""}
                                            onChange={(e) => {
                                                const formattedValuer4 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        nuevoProyecto.reajustes[0],
                                                        nuevoProyecto.reajustes[1],
                                                        nuevoProyecto.reajustes[2],
                                                        formattedValuer4,
                                                        ...nuevoProyecto.reajustes.slice(4),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 4"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[4] || ""}
                                            onChange={(e) => {
                                                const formattedValuep5 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        nuevoProyecto.planillas[3],
                                                        formattedValuep5,
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
                                            value={nuevoProyecto.reajustes[4] || ""}
                                            onChange={(e) => {
                                                const formattedValuer5 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        nuevoProyecto.reajustes[0],
                                                        nuevoProyecto.reajustes[1],
                                                        nuevoProyecto.reajustes[2],
                                                        nuevoProyecto.reajustes[3],
                                                        formattedValuer5,
                                                        ...nuevoProyecto.reajustes.slice(5),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 5"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[5] || ""}
                                            onChange={(e) => {
                                                const formattedValuep6 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        nuevoProyecto.planillas[0],
                                                        nuevoProyecto.planillas[1],
                                                        nuevoProyecto.planillas[2],
                                                        nuevoProyecto.planillas[3],
                                                        nuevoProyecto.planillas[4],
                                                        formattedValuep6,
                                                        ...nuevoProyecto.planillas.slice(6),
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 6"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.reajustes[5] || ""}
                                            onChange={(e) => {
                                                const formattedValuer6 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        nuevoProyecto.reajustes[0],
                                                        nuevoProyecto.reajustes[1],
                                                        nuevoProyecto.reajustes[2],
                                                        nuevoProyecto.reajustes[3],
                                                        nuevoProyecto.reajustes[4],
                                                        formattedValuer6,
                                                        ...nuevoProyecto.reajustes.slice(6),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 6"
                                        />
                                    </div>

                                    {/* Segunda fila de 6 inputs */}

                                    <div className="input_group">
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[6] || ""}
                                            onChange={(e) => {
                                                const formattedValuep7 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 6),
                                                        formattedValuep7,
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
                                            value={nuevoProyecto.reajustes[6] || ""}
                                            onChange={(e) => {
                                                const formattedValuer7 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 6),
                                                        formattedValuer7,
                                                        ...nuevoProyecto.reajustes.slice(7),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 7"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[7] || ""}
                                            onChange={(e) => {
                                                const formattedValuep8 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 7),
                                                        formattedValuep8,
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
                                            value={nuevoProyecto.reajustes[7] || ""}
                                            onChange={(e) => {
                                                const formattedValuer8 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 7),
                                                        formattedValuer8,
                                                        ...nuevoProyecto.reajustes.slice(8),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 8"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[8] || ""}
                                            onChange={(e) => {
                                                const formattedValuep9 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 8),
                                                        formattedValuep9,
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
                                            value={nuevoProyecto.reajustes[8] || ""}
                                            onChange={(e) => {
                                                const formattedValuer9 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 8),
                                                        formattedValuer9,
                                                        ...nuevoProyecto.reajustes.slice(9),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 9"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[9] || ""}
                                            onChange={(e) => {
                                                const formattedValuep10 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 9),
                                                        formattedValuep10,
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
                                            value={nuevoProyecto.reajustes[9] || ""}
                                            onChange={(e) => {
                                                const formattedValuer10 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 9),
                                                        formattedValuer10,
                                                        ...nuevoProyecto.reajustes.slice(10),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 10"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[10] || ""}
                                            onChange={(e) => {
                                                const formattedValuep11 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 10),
                                                        formattedValuep11,
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
                                            value={nuevoProyecto.reajustes[10] || ""}
                                            onChange={(e) => {
                                                const formattedValuer11 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 10),
                                                        formattedValuer11,
                                                        ...nuevoProyecto.reajustes.slice(11),
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 11"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.planillas[11] || ""}
                                            onChange={(e) => {
                                                const formattedValuep12 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    planillas: [
                                                        ...nuevoProyecto.planillas.slice(0, 11),
                                                        formattedValuep12,
                                                    ],
                                                });
                                            }}
                                            className="input_planillas"
                                            placeholder="Planilla 12"
                                        />
                                        <span>$</span>
                                        <input
                                            type="text"
                                            value={nuevoProyecto.reajustes[11] || ""}
                                            onChange={(e) => {
                                                const formattedValuer12 = formatearNumerosDollar(e.target.value);
                                                setNuevoProyecto({
                                                    ...nuevoProyecto,
                                                    reajustes: [
                                                        ...nuevoProyecto.reajustes.slice(0, 11),
                                                        formattedValuer12,
                                                    ],
                                                });
                                            }}
                                            className="input_reajuste"
                                            placeholder="Reajuste 12"
                                        />
                                    </div>
                                    <div className="input_group">
                                        <div className="box_dos_centrados">
                                            <div className="campo_container">
                                                <label className="label_campo">
                                                    <strong>Planilla total:</strong>
                                                </label>
                                                <span>$ {calcularTotal(nuevoProyecto.planillas)}</span>
                                            </div>
                                            <div className="campo_container">
                                                <label className="label_campo">
                                                    <strong>Reajuste total:</strong>
                                                </label>
                                                <span>$ {calcularTotal(nuevoProyecto.reajustes)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="box_cuatro div_row">
                                <div className="campo_container">
                                    <label className="label_campo no-print">
                                        Fecha anticipo:
                                    </label>
                                    <label className="label_oculto">
                                        Anticipo:
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevoProyecto.fchAnticipo || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                fchAnticipo: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo no-print">
                                        Fecha inicio:
                                    </label>
                                    <label className="label_oculto">
                                        Inicio:
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevoProyecto.fchInicio || ""}
                                        onChange={(e) =>
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                fchInicio: e.target.value,
                                            })
                                        }
                                        className="input_campos"
                                    />
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Plazo:
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.plazo || ""}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let numericValue = inputValue.replace(/[^0-9]/g, "");
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                plazo: numericValue,
                                            });
                                        }}
                                        className="dias_campo"
                                    />
                                    <span>días</span>
                                </div>
                                <div className="campo_container">
                                    <label className="label_campo no-print">
                                        Fecha terminación:
                                    </label>
                                    <label className="label_oculto">
                                        Terminación:
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevoProyecto.fchTerminacion || ""}
                                        readOnly
                                        className="input_campos"
                                    />
                                </div>
                            </div>

                            {/* AMPLIACIONES */}
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    Ampliaciones:
                                </label>
                                <div className="input_group_ampliaciones">
                                    <div>
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
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
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
                            </div>

                            <div className="box_tres div_row">
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Costo + Porcentaje:
                                    </label>
                                    <span>$ </span>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.costoPorcent || ""}
                                        onChange={(e) => {
                                            const formattedValueCost = formatearNumerosDollar(e.target.value);
                                            setNuevoProyecto({
                                                ...nuevoProyecto,
                                                costoPorcent: formattedValueCost,
                                            });
                                        }}
                                        className="money_campos"
                                    />

                                </div>
                                <div className="campo_container">
                                    <label className="label_campo">
                                        Incremento volumenes:
                                    </label>
                                    <span>$ </span>
                                    <input
                                        type="text"
                                        value={nuevoProyecto.incremVolumenes || ""}
                                        onChange={(e) => {
                                            const formattedValueVol = formatearNumerosDollar(e.target.value);
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
                                            const formattedValueCompl = formatearNumerosDollar(e.target.value);
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
                            <div className="div_row campo_container">
                                <label className="label_campo">
                                    <strong>Observaciones:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={nuevoProyecto.observ || ""}
                                    onChange={(e) =>
                                        setNuevoProyecto({
                                            ...nuevoProyecto,
                                            observ: e.target.value,
                                        })
                                    }
                                    className="input_campos"
                                />
                            </div>
                        </div>
                        <div className={`box_button_delete_guardar ${habilitado ? "" : "deshabilitado"}`}>
                            <button
                                type="button"
                                onClick={eliminarProyecto}
                                className="button_eliminar no-print"
                            >
                                Eliminar Proyecto
                            </button>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="buttonActualizar no-print">
                                Imprimir
                            </button>
                        </div>

                    </form>
                </div >
            </div >
        </div >
    );
};

export default Proyectos;
