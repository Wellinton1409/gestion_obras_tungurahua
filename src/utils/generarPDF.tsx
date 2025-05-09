
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFPersonal = (fiscalizador: string, proyectos: any[]) => {
    if (typeof window === "undefined") return;

    const doc = new jsPDF("landscape", "mm", "a3"); // Generar en horizontal

    const img = "/logoGADcirculo.png"; // Ruta relativa en public/
    doc.addImage(img, "PNG", 15, 4, 30, 30); // (imagen, formato, x, y, ancho, alto)

    // Título del informe
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INFORME TÉCNICO DE PROYECTOS', 210, 18, { align: 'center' });

    // Espaciado antes de la tabla
    doc.setFontSize(12);
    doc.text(`Fiscalizador: ${fiscalizador}`, 15, 40);

    // Definir estructura de la tabla con anchos de columna
    const columnas = [
        { title: "PROYECTO", dataKey: "proyecto" },
        { title: "PROCESO CONTRATACION", dataKey: "proceso" },
        { title: "TECNICO RESPONSABLE", dataKey: "tecResponsable" },
        { title: "ADMINSITRADOR", dataKey: "admin" },
        { title: "CONTRATISTA", dataKey: "contratista" },
        { title: "PRESUPUESTO INICIAL", dataKey: "presupuesto" },
        { title: "PLANILLAS CANCELADAS", dataKey: "planillas" },
        { title: "REAJUSTES", dataKey: "reajustes" },
        { title: "COSTO + %", dataKey: "costoPorcentaje" },
        { title: "INCREMENTO VOLUMENES", dataKey: "volumenes" },
        { title: "CONTRATO COMPLEMENTARIO", dataKey: "complementario" },
        { title: "FECHA INICIO", dataKey: "fchInicio" },
        { title: "AMPLIACIONES", dataKey: "ampliaciones" },
        { title: "FECHA TERMINACION", dataKey: "fchTerminacion" },
        { title: "ACTA PROVISIONAL", dataKey: "actProvisional" },
        { title: "ACTA DEFINITIVA", dataKey: "actDefinitiva" },
        { title: "ESTADO PROCESO", dataKey: "estadoActProceso" },
        { title: "OBSERVACIONES", dataKey: "observaciones" }
    ];


    const filas = proyectos.map((proyecto) => ({

        proyecto: proyecto.nombreProyecto,
        proceso: proyecto.codContratacion || "",
        tecResponsable: proyecto.tecnicoResponsable || "",
        admin: proyecto.admiContrato || "",
        contratista: proyecto.contratista || "",
        presupuesto: proyecto.presupuesto
            ? proyecto.presupuesto.includes(",")
                ? `$ ${proyecto.presupuesto}`
                : `$ ${proyecto.presupuesto},00`
            : "$ 0,00",
        planillas: proyecto.planillas
            ? `$ ${(
                proyecto.planillas
                    .map((p: string) => {
                        const parsedValue = parseFloat(p.replace(/\./g, "").replace(",", "."));
                        return isNaN(parsedValue) ? 0 : parsedValue;
                    })
                    .reduce((acc: number, val: number) => acc + val, 0)
            ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "$ 0,00",
        reajustes: proyecto.reajustes
            ? `$ ${(
                proyecto.reajustes
                    .map((p: string) => {
                        const parsedValue = parseFloat(p.replace(/\./g, "").replace(",", "."));
                        return isNaN(parsedValue) ? 0 : parsedValue;
                    })
                    .reduce((acc: number, val: number) => acc + val, 0)
            ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "$ 0,00",
        costoPorcentaje: proyecto.costoPorcent
            ? proyecto.costoPorcent.includes(",")
                ? `$ ${proyecto.costoPorcent}`
                : `$ ${proyecto.costoPorcent},00`
            : "$ 0,00",
        fchInicio: proyecto.fchInicio || "",
        ampliaciones: proyecto.ampliaciones && proyecto.ampliaciones.length > 0
            ? `${proyecto.ampliaciones
                .map((p: string) => (p ? parseInt(p, 10) || 0 : 0))
                .reduce((acc: number, val: number) => acc + val, 0)} días`
            : "0 días",
        fchTerminacion: proyecto.fchTerminacion || "",
        volumenes: proyecto.incremVolumenes
            ? proyecto.incremVolumenes.includes(",")
                ? `$ ${proyecto.incremVolumenes}`
                : `$ ${proyecto.incremVolumenes},00`
            : "$ 0,00",
        complementario: proyecto.contrComplementario
            ? proyecto.contrComplementario.includes(",")
                ? `$ ${proyecto.contrComplementario}`
                : `$ ${proyecto.contrComplementario},00`
            : "$ 0,00",
        actProvisional: proyecto.actaProvisional || "",
        actDefinitiva: proyecto.actaDefinitiva || "",
        estadoActProceso: proyecto.estadoActproyecto || "",
        observaciones: proyecto.observ || ""
    }));

    const head = [[
        "PROYECTO", "PROCESO CONTRATACION", "TECNICO RESPONSABLE", "ADMINSITRADOR", "CONTRATISTA",
        "PRESUPUESTO INICIAL", "PLANILLAS CANCELADAS", "REAJUSTES", "COSTO + %",
        "INCREMENTO VOLUMENES", "CONTRATO COMPLEMENTARIO", "FECHA INICIO", "AMPLIACIONES",
        "FECHA TERMINACION", "ACTA PROVISIONAL", "ACTA DEFINITIVA", "ESTADO PROCESO", "OBSERVACIONES"
    ]];

    const columnStyles = {
        0: { cellWidth: 52, halign: 'left' as 'left' },
        1: { cellWidth: 19, halign: 'center' as 'center' },
        2: { cellWidth: 18, halign: 'center' as 'center' },
        3: { cellWidth: 20, halign: 'center' as 'center' },
        4: { cellWidth: 33, halign: 'center' as 'center' },
        5: { cellWidth: 21, halign: 'center' as 'center' },
        6: { cellWidth: 20, halign: 'center' as 'center' },
        7: { cellWidth: 20, halign: 'center' as 'center' },
        8: { cellWidth: 20, halign: 'center' as 'center' },
        9: { cellWidth: 20, halign: 'center' as 'center' },
        10: { cellWidth: 22, halign: 'center' as 'center' },
        11: { cellWidth: 16, halign: 'center' as 'center' },
        12: { cellWidth: 18, halign: 'center' as 'center' },
        13: { cellWidth: 17, halign: 'center' as 'center' },
        14: { cellWidth: 19, halign: 'center' as 'center' },
        15: { cellWidth: 18, halign: 'center' as 'center' },
        16: { cellWidth: 20, halign: 'center' as 'center' },
        17: { cellWidth: 20, halign: 'center' as 'center' },
    };

    autoTable(doc, {
        head,
        columns: columnas,
        body: filas,
        startY: 45,
        styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.4 },
        headStyles: { fontSize: 6, fillColor: [112, 128, 144], textColor: [255, 255, 255] },
        columnStyles,
    });


    // Descargar PDF
    doc.save(`Informe_Fiscalizador_${fiscalizador}.pdf`);
};

export const generarPDFGeneral = (usuarios: any[], proyectos: any[]) => {
    if (typeof window === "undefined") return;

    const doc = new jsPDF("landscape", "mm", "a3") as jsPDF & { lastAutoTable?: { finalY: number } }; // Generar en horizontal

    // Agregar imagen al encabezado
    const img = "/logoGADcirculo.png"; // Ruta relativa en public/
    doc.addImage(img, "PNG", 15, 4, 25, 25); // (imagen, formato, x, y, ancho, alto)

    // Título del informe
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INFORME TÉCNICO GENERAL DE PROYECTOS', 210, 18, { align: 'center' });

    let startY = 35; // Para manejar la posición de cada sección

    usuarios.forEach((usuario) => {
        const proyectosFiscalizador = proyectos.filter(
            (proyecto) => proyecto.codFiscalizador === usuario.codigo
        );

        if (proyectosFiscalizador.length > 0) {
            doc.setFontSize(12);
            doc.text(`Fiscalizador: ${usuario.nombre}`, 15, startY);
            startY += 5;

            const head = [[
                "PROYECTO", "PROCESO CONTRATACION", "TECNICO RESPONSABLE", "ADMINSITRADOR", "CONTRATISTA",
                "PRESUPUESTO INICIAL", "PLANILLAS CANCELADAS", "REAJUSTES", "COSTO + %",
                "INCREMENTO VOLUMENES", "CONTRATO COMPLEMENTARIO", "FECHA INICIO", "AMPLIACIONES",
                "FECHA TERMINACION", "ACTA PROVISIONAL", "ACTA DEFINITIVA", "ESTADO PROCESO", "OBSERVACIONES"
            ]];

            const filas = proyectosFiscalizador.map((proyecto) => ({
                proyecto: proyecto.nombreProyecto,
                proceso: proyecto.codContratacion || "",
                tecResponsable: proyecto.tecnicoResponsable || "",
                admin: proyecto.admiContrato || "",
                contratista: proyecto.contratista || "",
                presupuesto: proyecto.presupuesto
                    ? proyecto.presupuesto.includes(",")
                        ? `$ ${proyecto.presupuesto}`
                        : `$ ${proyecto.presupuesto},00`
                    : "$ 0,00",
                planillas: proyecto.planillas
                    ? `$ ${(
                        proyecto.planillas
                            .map((p: string) => {
                                const parsedValue = parseFloat(p.replace(/\./g, "").replace(",", "."));
                                return isNaN(parsedValue) ? 0 : parsedValue;
                            })
                            .reduce((acc: number, val: number) => acc + val, 0)
                    ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "$ 0,00",
                reajustes: proyecto.reajustes
                    ? `$ ${(
                        proyecto.reajustes
                            .map((p: string) => {
                                const parsedValue = parseFloat(p.replace(/\./g, "").replace(",", "."));
                                return isNaN(parsedValue) ? 0 : parsedValue;
                            })
                            .reduce((acc: number, val: number) => acc + val, 0)
                    ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "$ 0,00",
                costoPorcentaje: proyecto.costoPorcent
                    ? proyecto.costoPorcent.includes(",")
                        ? `$ ${proyecto.costoPorcent}`
                        : `$ ${proyecto.costoPorcent},00`
                    : "$ 0,00",
                fchInicio: proyecto.fchInicio || "",
                ampliaciones: proyecto.ampliaciones && proyecto.ampliaciones.length > 0
                    ? `${proyecto.ampliaciones
                        .map((p: string) => (p ? parseInt(p, 10) || 0 : 0))
                        .reduce((acc: number, val: number) => acc + val, 0)} días`
                    : "0 días",
                fchTerminacion: proyecto.fchTerminacion || "",
                volumenes: proyecto.incremVolumenes
                    ? proyecto.incremVolumenes.includes(",")
                        ? `$ ${proyecto.incremVolumenes}`
                        : `$ ${proyecto.incremVolumenes},00`
                    : "$ 0,00",
                complementario: proyecto.contrComplementario
                    ? proyecto.contrComplementario.includes(",")
                        ? `$ ${proyecto.contrComplementario}`
                        : `$ ${proyecto.contrComplementario},00`
                    : "$ 0,00",
                actProvisional: proyecto.actaProvisional || "",
                actDefinitiva: proyecto.actaDefinitiva || "",
                estadoActProceso: proyecto.estadoActproyecto || "",
                observaciones: proyecto.observ || ""
            }));

            const columnas = [
                { title: "PROYECTO", dataKey: "proyecto" },
                { title: "PROCESO CONTRATACION", dataKey: "proceso" },
                { title: "TECNICO RESPONSABLE", dataKey: "tecResponsable" },
                { title: "ADMINSITRADOR", dataKey: "admin" },
                { title: "CONTRATISTA", dataKey: "contratista" },
                { title: "PRESUPUESTO INICIAL", dataKey: "presupuesto" },
                { title: "PLANILLAS CANCELADAS", dataKey: "planillas" },
                { title: "REAJUSTES", dataKey: "reajustes" },
                { title: "COSTO + %", dataKey: "costoPorcentaje" },
                { title: "INCREMENTO VOLUMENES", dataKey: "volumenes" },
                { title: "CONTRATO COMPLEMENTARIO", dataKey: "complementario" },
                { title: "FECHA INICIO", dataKey: "fchInicio" },
                { title: "AMPLIACIONES", dataKey: "ampliaciones" },
                { title: "FECHA TERMINACION", dataKey: "fchTerminacion" },
                { title: "ACTA PROVISIONAL", dataKey: "actProvisional" },
                { title: "ACTA DEFINITIVA", dataKey: "actDefinitiva" },
                { title: "ESTADO PROCESO", dataKey: "estadoActProceso" },
                { title: "OBSERVACIONES", dataKey: "observaciones" }
            ];

            const columnStyles = {
                0: { cellWidth: 52, halign: 'left' as 'left' },
                1: { cellWidth: 19, halign: 'center' as 'center' },
                2: { cellWidth: 18, halign: 'center' as 'center' },
                3: { cellWidth: 20, halign: 'center' as 'center' },
                4: { cellWidth: 33, halign: 'center' as 'center' },
                5: { cellWidth: 21, halign: 'center' as 'center' },
                6: { cellWidth: 20, halign: 'center' as 'center' },
                7: { cellWidth: 20, halign: 'center' as 'center' },
                8: { cellWidth: 20, halign: 'center' as 'center' },
                9: { cellWidth: 20, halign: 'center' as 'center' },
                10: { cellWidth: 22, halign: 'center' as 'center' },
                11: { cellWidth: 16, halign: 'center' as 'center' },
                12: { cellWidth: 18, halign: 'center' as 'center' },
                13: { cellWidth: 17, halign: 'center' as 'center' },
                14: { cellWidth: 19, halign: 'center' as 'center' },
                15: { cellWidth: 18, halign: 'center' as 'center' },
                16: { cellWidth: 20, halign: 'center' as 'center' },
                17: { cellWidth: 20, halign: 'center' as 'center' },
            };

            autoTable(doc, {
                head,
                columns: columnas,
                body: filas,
                startY,
                styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.4 },
                headStyles: { fontSize: 6, fillColor: [112, 128, 144], textColor: [255, 255, 255] },
                columnStyles,
            });

            startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : startY + 10;
        }
    });

    const fechaActual = new Date().toISOString().split("T")[0];
    doc.save(`Informe_General_${fechaActual}.pdf`);
};
