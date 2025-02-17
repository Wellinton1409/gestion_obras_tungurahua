"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Presupuesto {
    codProy: string;
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
        codProy: "",
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
    const [nuevoPresupuesto, setNuevoPresupuesto] = useState<Presupuesto>(tipoPresupuesto);


    const formatearNumerosDollar = (inputValue: string): string => {
        let numericValue = inputValue.replace(/[^0-9,]/g, "");

        const parts = numericValue.split(",");
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatear miles con puntos
        const decimalPart = parts[1] !== undefined ? "," + parts[1].slice(0, 2) : "";

        return integerPart + decimalPart;
    };


    return (
        <div className="box_principal">
            <div className="barra_lateral"></div>
            <div className="container_principal">
                <br />
                <h1 className="box_title">PRESUPUESTOS POR VIAS</h1>
                <div className="pr-box-informacion">
                    <div className="box-info-container">
                        INFORMACION 1 DE PROYECTO
                    </div>
                    <div className="box-info-container">
                        INFORMACION 2 DE PROYECTO
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
                                        value={nuevoPresupuesto.pln11[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pnl11: [
                                                    ...prevPresupuesto.pln11.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln11.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln12[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pnl12: [
                                                    ...prevPresupuesto.pln12.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln12.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln13[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pnl13: [
                                                    ...prevPresupuesto.pln13.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln13.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln14[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pnl14: [
                                                    ...prevPresupuesto.pln14.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln14.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia 1:</span>
                            <span>$ total</span>
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
                                        value={nuevoPresupuesto.pln21[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln21: [
                                                    ...prevPresupuesto.pln21.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln21.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln22[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln22: [
                                                    ...prevPresupuesto.pln22.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln22.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln23[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln23: [
                                                    ...prevPresupuesto.pln23.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln23.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln24[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln24: [
                                                    ...prevPresupuesto.pln24.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln24.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia 2:</span>
                            <span>$ total</span>
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
                                        value={nuevoPresupuesto.pln31[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln31: [
                                                    ...prevPresupuesto.pln31.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln31.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln32[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln32: [
                                                    ...prevPresupuesto.pln32.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln32.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln33[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln33: [
                                                    ...prevPresupuesto.pln33.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln33.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln34[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln34: [
                                                    ...prevPresupuesto.pln34.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln34.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia 3:</span>
                            <span>$ total</span>
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
                                        value={nuevoPresupuesto.pln41[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln41: [
                                                    ...prevPresupuesto.pln41.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln41.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln42[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln42: [
                                                    ...prevPresupuesto.pln42.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln42.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln43[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln43: [
                                                    ...prevPresupuesto.pln43.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln43.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
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
                                        value={nuevoPresupuesto.pln44[index] || ""}
                                        onChange={(e) => {
                                            const formattedValue = formatearNumerosDollar(e.target.value);
                                            setNuevoPresupuesto((prevPresupuesto) => ({
                                                ...prevPresupuesto,
                                                pln44: [
                                                    ...prevPresupuesto.pln44.slice(0, index),
                                                    formattedValue,
                                                    ...prevPresupuesto.pln44.slice(index + 1),
                                                ],
                                            }));
                                        }}
                                        className="input_pnll"
                                        placeholder={`Planilla ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="parr-presupuesto">
                            <span>Presupuesto parroquia 4:</span>
                            <span>$ total</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Presupuestos;