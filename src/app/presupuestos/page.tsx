"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
    collection,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    query,
    where,
} from "firebase/firestore";

interface Presupuesto {
    parr1: string;
    via11: string;
    via12: string;
    via13: string;
    via14: string;
    pln11: string[];
    pln12: string[];
    pln13: string[];
    pln14: string[];
    parr2: string;
    via21: string;
    via22: string;
    via23: string;
    via24: string;
    pln21: string[];
    pln22: string[];
    pln23: string[];
    pln24: string[];
    parr3: string;
    via31: string;
    via32: string;
    via33: string;
    via34: string;
    pln31: string[];
    pln32: string[];
    pln33: string[];
    pln34: string[];
    parr4: string;
    via41: string;
    via42: string;
    via43: string;
    via44: string;
    pln41: string[];
    pln42: string[];
    pln43: string[];
    pln44: string[];
}


const Presupuestos = () => {
    const tipoPresupuesto: Presupuesto = {
        parr1: "",
        via11: "",
        via12: "",
        via13: "",
        via14: "",
        pln11: [],
        pln12: [],
        pln13: [],
        pln14: [],
        parr2: "",
        via21: "",
        via22: "",
        via23: "",
        via24: "",
        pln21: [],
        pln22: [],
        pln23: [],
        pln24: [],
        parr3: "",
        via31: "",
        via32: "",
        via33: "",
        via34: "",
        pln31: [],
        pln32: [],
        pln33: [],
        pln34: [],
        parr4: "",
        via41: "",
        via42: "",
        via43: "",
        via44: "",
        pln41: [],
        pln42: [],
        pln43: [],
        pln44: [],
    };
    const [codigo, setCodigo] = useState("");
    const [proyecto, setProyecto] = useState<any | null>(null);
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [presupuesto, setPresupuesto] = useState<any | null>(null);
    const [nuevoPresupuesto, setNuevoPresupuesto] = useState<Presupuesto>(tipoPresupuesto);
    const [idProyectoSeleccionado, setIDProyectoSeleccionado] = useState<string | null>(null);
    const [mensajeError, setMensajeError] = useState("");
    const [existeProyectos, setExisteProyectos] = useState(false);
    const [habilitado, setHabilitado] = useState(false);

    const formatearNumerosDollar = (inputValue: string): string => {
        let numericValue = inputValue.replace(/[^0-9,]/g, "");

        const parts = numericValue.split(",");
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
        const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

        return integerPart + decimalPart;
    };

    // Manejar selección de un proyecto
    const seleccionarProyecto = (proyecto: any) => {
        setIDProyectoSeleccionado(proyecto.id);
        setHabilitado(true);
        setProyecto(proyecto); // Autocompletar el formulario con datos existentes
        buscarPlanilla(proyecto.id);
    };

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
                return;
            }

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
            setExisteProyectos(true);
            setIDProyectoSeleccionado(null);
            setNuevoPresupuesto(tipoPresupuesto);
            setProyecto(null);
        } catch (error) {
            console.error("Error al buscar proyectos:", error);
            setMensajeError("Ocurrió un error al buscar los proyectos.");
        }
    };

    const buscarPlanilla = async (idProySeleccionado: string) => {
        try {
            setMensajeError("");

            if (!idProySeleccionado) {
                setMensajeError("No se ha seleccionado un proyecto.");
                return;
            }
            const presupuestoRef = doc(db, "presupuestos", idProySeleccionado);
            const presupuestoSnap = await getDoc(presupuestoRef);

            if (!presupuestoSnap.exists()) {
                setMensajeError("Presupuesto vacío. \n Ingrese Datos.");
                setNuevoPresupuesto(tipoPresupuesto);
                return;
            }
            const presupuestoData = presupuestoSnap.data() as Presupuesto;
            setNuevoPresupuesto(presupuestoData);
            console.log(presupuestoData);
        } catch (error) {
            console.error("Error al buscar el presupuesto:", error);
            setMensajeError("Ocurrió un error al buscar los presupuestos.");
        }
    };

    // Guardar o actualizar proyecto
    const guardarPlanillas = async () => {
        try {

            if (idProyectoSeleccionado) {
                const presupuestoRef = doc(db, "presupuestos", idProyectoSeleccionado);
                await updateDoc(presupuestoRef, { ...nuevoPresupuesto });
                alert("Presupuesto actualizado");
            } else {

            }
        } catch (error) {
            console.error("Error al guardar el presupuesto:", error);
        }
    };

    const calcularTotalPlanillas = (valores: (string | undefined)[] = []) => {
        const total = (valores ?? [])
            .map((v) => v ?? "0")
            .map((v) => v.replace(/\./g, "").replace(",", ".")) // Convierte a formato numérico correcto
            .map((v) => parseFloat(v) || 0) // Convierte a número
            .reduce((acc, num) => acc + num, 0); // Suma total

        return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
    };

    const calcularTotalParroquia = (nuevoPresupuesto: Record<string, any>, prefijos: string[]) => {
        const total = prefijos.reduce((acc, prefijo) => {
            const valores: (string | undefined)[] = nuevoPresupuesto[prefijo] || []; // Obtiene la lista de planillas
            const suma = valores
                .map((v: string | undefined) => v ?? "0")
                .map((v: string) => v.replace(/\./g, "").replace(",", ".")) // Convierte a formato numérico correcto
                .map((v: string) => parseFloat(v) || 0) // Convierte a número
                .reduce((acc, num) => acc + num, 0); // Suma total

            return acc + suma;
        }, 0);

        return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
    };

    const calcularTotalProyecto = () => {
        const limpiarNumero = (valor: string | undefined) =>
            parseFloat((valor ?? "0").replace(/\./g, "").replace(",", ".")) || 0;

        const total =
            limpiarNumero(totalParroquia1) +
            limpiarNumero(totalParroquia2) +
            limpiarNumero(totalParroquia3) +
            limpiarNumero(totalParroquia4);

        return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
    };



    const totalParroquia1 = calcularTotalParroquia(nuevoPresupuesto, ["pln11", "pln12", "pln13", "pln14"]);
    const totalParroquia2 = calcularTotalParroquia(nuevoPresupuesto, ["pln21", "pln22", "pln23", "pln24"]);
    const totalParroquia3 = calcularTotalParroquia(nuevoPresupuesto, ["pln31", "pln32", "pln33", "pln34"]);
    const totalParroquia4 = calcularTotalParroquia(nuevoPresupuesto, ["pln41", "pln42", "pln43", "pln44"]);



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
                            className={`buttonObra ${idProyectoSeleccionado === proyecto.id ? "seleccionado" : ""}`}
                        >
                            {proyecto.nombreProyecto}
                        </button>
                    ))}
                </div>
                <br />
                <br />
            </div>
            <div className={`container_principal ${habilitado ? "" : "deshabilitado"}`}>
                <br />
                <h1 className="box_title">PRESUPUESTOS POR VIAS</h1>
                <div className="pr-box-informacion">
                    <div className="box-info-container-principal">
                        <div className="info-izquierdo-principal">
                            <div>Proyecto: </div>
                            <div>Fiscalizador: </div>
                        </div>
                        <div className="info-derecho-principal">
                            <div className="info-proyecto">{proyecto?.nombreProyecto || ""}</div>
                            <div className="info-proyecto">{proyecto?.fiscalizador || ""}</div>
                        </div>
                    </div>
                    <div className="box-info-division">
                        <div className="box-info-container">
                            <div className="info-izquierdo">
                                <div>Proceso de contratación: </div>
                                <div>Presupuesto inicial: </div>
                                <div>Administrador de contrato: </div>
                            </div>
                            <div className="info-derecho">
                                <div className="info-proyecto">{proyecto?.procContratacion || ""}</div>
                                <div className="info-proyecto">{proyecto?.presupuesto || ""}</div>
                                <div className="info-proyecto">{proyecto?.admiContrato || ""}</div>
                            </div>
                        </div>
                        <div className="box-info-container">
                            <div className="info-izquierdo">
                                <div>Estado del Proceso: </div>
                                <div>Código de contratación: </div>
                                <div>Avance: </div>
                            </div>
                            <div className="info-derecho">
                                <div className="info-proyecto">{proyecto?.estadoProceso || ""}</div>
                                <div className="info-proyecto">{proyecto?.codContratacion || ""}</div>
                                <div className="info-proyecto">{proyecto?.avance || ""}</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="pr-box-parroquias">
                    <div className="box-parr-container">
                        {/* Parroquia 1 */}
                        <div className="parr-nombre">
                            <span>Parroquia:</span>
                            <input
                                type="text"
                                value={nuevoPresupuesto.parr1 || ""}
                                onChange={(e) =>
                                    setNuevoPresupuesto({
                                        ...nuevoPresupuesto,
                                        parr1: e.target.value,
                                    })
                                }
                                className="input-parr-nombre"
                            />
                        </div>
                        <div className="parr-planillas">
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via11 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via11: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 1"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln11?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln11: [
                                                    ...(prevPresupuesto.pln11 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln11 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln11)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via12 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via12: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 2"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln12?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln12: [
                                                    ...(prevPresupuesto.pln12 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln12 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln12)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via13 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via13: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 3"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln13?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln13: [
                                                    ...(prevPresupuesto.pln13 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln13 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln13)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via14 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via14: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 4"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln14?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln14: [
                                                    ...(prevPresupuesto.pln14 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln14 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln14)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia {nuevoPresupuesto.parr1}:</span>
                            <div className="totalParroquia">
                                <span>$ {totalParroquia1}</span>
                            </div>
                        </div>
                    </div>
                    <div className="box-parr-container">
                        {/* Parroquia 2 */}
                        <div className="parr-nombre">
                            <span>Parroquia:</span>
                            <input
                                type="text"
                                value={nuevoPresupuesto.parr2 || ""}
                                onChange={(e) =>
                                    setNuevoPresupuesto({
                                        ...nuevoPresupuesto,
                                        parr2: e.target.value,
                                    })
                                }
                                className="input-parr-nombre"
                            />
                        </div>
                        <div className="parr-planillas">
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via21 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via21: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 1"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln21?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln21: [
                                                    ...(prevPresupuesto.pln21 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln21 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln21)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via22 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via22: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 2"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln22?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln22: [
                                                    ...(prevPresupuesto.pln22 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln22 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln22)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via23 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via23: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 3"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln23?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln23: [
                                                    ...(prevPresupuesto.pln23 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln23 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln23)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via24 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via24: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 4"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln24?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln24: [
                                                    ...(prevPresupuesto.pln24 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln24 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln24)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia {nuevoPresupuesto.parr2}:</span>
                            <div className="totalParroquia">
                                <span>$ {totalParroquia2}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pr-box-parroquias">
                    <div className="box-parr-container">
                        {/* Parroquia 3 */}
                        <div className="parr-nombre">
                            <span>Parroquia:</span>
                            <input
                                type="text"
                                value={nuevoPresupuesto.parr3 || ""}
                                onChange={(e) =>
                                    setNuevoPresupuesto({
                                        ...nuevoPresupuesto,
                                        parr3: e.target.value,
                                    })
                                }
                                className="input-parr-nombre"
                            />
                        </div>
                        <div className="parr-planillas">
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via31 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via31: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 1"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln31?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln31: [
                                                    ...(prevPresupuesto.pln31 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln31 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln31)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via32 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via32: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 2"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln32?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln32: [
                                                    ...(prevPresupuesto.pln32 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln32 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln32)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via33 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via33: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 3"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln33?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln33: [
                                                    ...(prevPresupuesto.pln33 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln33 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln33)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via34 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via34: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 4"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln34?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln34: [
                                                    ...(prevPresupuesto.pln34 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln34 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln34)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia {nuevoPresupuesto.parr3}:</span>
                            <div className="totalParroquia">
                                <span>$ {totalParroquia3}</span>
                            </div>
                        </div>
                    </div>
                    <div className="box-parr-container">
                        {/* Parroquia 4 */}
                        <div className="parr-nombre">
                            <span>Parroquia:</span>
                            <input
                                type="text"
                                value={nuevoPresupuesto.parr4 || ""}
                                onChange={(e) =>
                                    setNuevoPresupuesto({
                                        ...nuevoPresupuesto,
                                        parr4: e.target.value,
                                    })
                                }
                                className="input-parr-nombre"
                            />
                        </div>
                        <div className="parr-planillas">
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via41 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via41: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 1"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln41?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln41: [
                                                    ...(prevPresupuesto.pln41 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln41 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln41)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via42 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via42: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 2"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln42?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln42: [
                                                    ...(prevPresupuesto.pln42 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln42 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln42)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via43 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via43: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 3"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln43?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln43: [
                                                    ...(prevPresupuesto.pln43 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln43 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln43)}</span>
                                </div>
                            </div>
                            <div className="vias">
                                <input
                                    type="text"
                                    value={nuevoPresupuesto.via44 || ""}
                                    onChange={(e) =>
                                        setNuevoPresupuesto({
                                            ...nuevoPresupuesto,
                                            via44: e.target.value,
                                        })
                                    }
                                    className="input-parr-via"
                                    placeholder="Vía 4"
                                />
                                {Array.from({ length: 12 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={nuevoPresupuesto.pln44?.[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln44: [
                                                    ...(prevPresupuesto.pln44 ?? []).slice(0, index),
                                                    formattedValue,
                                                    ...(prevPresupuesto.pln44 ?? []).slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                                <div className="totalPlanillas">
                                    <span>$ {calcularTotalPlanillas(nuevoPresupuesto.pln44)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia {nuevoPresupuesto.parr4}:</span>
                            <div className="totalParroquia">
                                <span>$ {totalParroquia4}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="total-general">
                    <div>TOTAL PROYECTO EJECUTADO: $ {calcularTotalProyecto()}</div>
                </div>
                <div className={`box_button_delete_guardar ${habilitado ? "" : "deshabilitado"}`}>
                    <button
                        type="button"
                        onClick={guardarPlanillas}
                        className="buttonActualizar no-print"
                    >
                        Guardar Cambios
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="buttonActualizar no-print">
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Presupuestos;