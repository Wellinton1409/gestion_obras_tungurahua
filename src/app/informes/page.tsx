"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { generarPDFPersonal, generarPDFGeneral } from "../../utils/generarPDF";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [proyectos, setproyectos] = useState<any[]>([]);
    const [codigoInput, setCodigoInput] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
            setUsuarios(usuariosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            const proyectosSnapshot = await getDocs(collection(db, "proyectos"));
            setproyectos(proyectosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, []);

    const handleGenerarPDFPersonal = () => {
        const fiscalizador = usuarios.find((u) => u.codigo === codigoInput);
        if (fiscalizador) {
            const proyectosFiscalizador = proyectos.filter((proyecto) => proyecto.codFiscalizador === fiscalizador.codigo);
            generarPDFPersonal(fiscalizador.nombre, proyectosFiscalizador);
        } else {
            alert("No se encontró ningún fiscalizador con ese código");
        }
    };


    return (
        <div className="box_principal">
            <div className="barra_lateral"></div>
            <div className="container_principal">
                <br />
                <h1 className="box_title">GENERAR INFORMES</h1>
                <div>
                    <br />
                    <br />
                    <br />
                    <span className="label_texto_informes">Informe Personal:</span>
                    <div className="item_generar_pdf">
                        <span>Ingrese el código del Fiscalizador:</span>
                        <input type="text" value={codigoInput} onChange={(e) => setCodigoInput(e.target.value)} className="IDbuscarPDF" />
                        <span></span>
                        <button className="button_PDF" onClick={handleGenerarPDFPersonal}>
                            Generar PDF
                        </button>
                    </div>
                    <br />
                    <br />
                    <br />
                    <span className="label_texto_informes">Informe General:</span>
                    <div className="item_generar_pdf">
                        <span>Informe de todos los Fiscalizadores :</span>
                        <span></span>
                        <span></span>
                        <button className="button_PDF" onClick={() => generarPDFGeneral(usuarios, proyectos)}>
                            Generar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Usuarios;
