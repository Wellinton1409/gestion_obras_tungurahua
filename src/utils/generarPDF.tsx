
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
        { title: "PROYECTO", dataKey: "proyecto", width: 52 },
        { title: "PROCESO CONTRATACION", dataKey: "proceso", width: 19 },
        { title: "TECNICO RESPONSABLE", dataKey: "tecResponsable", width: 18 },
        { title: "ADMINSITRADOR", dataKey: "admin", width: 20 },
        { title: "CONTRATISTA", dataKey: "contratista", width: 33 },
        { title: "PRESUPUESTO INICIAL", dataKey: "presupuesto", width: 21 },
        { title: "PLANILLAS CANCELADAS", dataKey: "planillas", width: 20 },
        { title: "REAJUSTES", dataKey: "reajustes", width: 20 },
        { title: "COSTO + %", dataKey: "costoPorcentaje", width: 20 },
        { title: "INCREMENTO VOLUMENES", dataKey: "volumenes", width: 20 },
        { title: "CONTRATO COMPLEMENTARIO", dataKey: "complementario", width: 22 },
        { title: "FECHA INICIO", dataKey: "fchInicio", width: 16 },
        { title: "AMPLIACIONES", dataKey: "ampliaciones", width: 18 },
        { title: "FECHA TERMINACION", dataKey: "fchTerminacion", width: 17 },
        { title: "ACTA PROVISIONAL", dataKey: "actProvisional", width: 19 },
        { title: "ACTA DEFINITIVA", dataKey: "actDefinitiva", width: 18 },
        { title: "ESTADO PROCESO", dataKey: "estadoActProceso", width: 20 },
        { title: "OBSERVACIONES", dataKey: "observaciones", width: 20 }
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
                        const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                        return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                    }) // Convertir cada valor a número
                    .reduce((acc: number, val: number) => acc + val, 0) // Sumar
            ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
            : "$ 0,00",
        reajustes: proyecto.reajustes
            ? `$ ${(
                proyecto.reajustes
                    .map((p: string) => {
                        const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                        return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                    }) // Convertir cada valor a número
                    .reduce((acc: number, val: number) => acc + val, 0) // Sumar
            ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
            : "0,00",
        costoPorcentaje: proyecto.costoPorcent
            ? proyecto.presupuesto.includes(",")
                ? `$ ${proyecto.presupuesto}`
                : `$ ${proyecto.presupuesto},00`
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

    autoTable(doc, {
        columns: columnas,
        body: filas,
        startY: 45,
        styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.4 }, // Ajuste de tamaño
        headStyles: { fontSize: 6, fillColor: [112, 128, 144], textColor: [255, 255, 255] },
        columnStyles: {
            proyecto: { cellWidth: 52 }, // Definir ancho máximo
            proceso: { cellWidth: 19 },
            tecResponsable: { cellWidth: 18 },
            admin: { cellWidth: 20 },
            contratista: { cellWidth: 33 },
            presupuesto: { cellWidth: 21 },
            planillas: { cellWidth: 20 },
            reajustes: { cellWidth: 20 },
            costoPorcentaje: { cellWidth: 20 },
            volumenes: { cellWidth: 20 },
            complementario: { cellWidth: 22 },
            fchInicio: { cellWidth: 16 },
            ampliaciones: { cellWidth: 18 },
            fchTerminacion: { cellWidth: 17 },
            actProvisional: { cellWidth: 19 },
            actDefinitiva: { cellWidth: 18 },
            estadoActProceso: { cellWidth: 20 },
            observaciones: { cellWidth: 20 },
        },
    });

    // Descargar PDF
    doc.save(`Informe_Fiscalizador_${fiscalizador}.pdf`);
};

export const generarPDFGeneral = (usuarios: any[], proyectos: any[]) => {
    if (typeof window === "undefined") return;

    const doc = new jsPDF("landscape", "mm", "a3"); // Generar en horizontal

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

            const columnas = [
                { title: "PROYECTO", dataKey: "proyecto", width: 52 },
                { title: "PROCESO CONTRATACION", dataKey: "proceso", width: 19 },
                { title: "TECNICO RESPONSABLE", dataKey: "tecResponsable", width: 18 },
                { title: "ADMINSITRADOR", dataKey: "admin", width: 20 },
                { title: "CONTRATISTA", dataKey: "contratista", width: 33 },
                { title: "PRESUPUESTO INICIAL", dataKey: "presupuesto", width: 21 },
                { title: "PLANILLAS CANCELADAS", dataKey: "planillas", width: 20 },
                { title: "REAJUSTES", dataKey: "reajustes", width: 20 },
                { title: "COSTO + %", dataKey: "costoPorcentaje", width: 20 },
                { title: "INCREMENTO VOLUMENES", dataKey: "volumenes", width: 20 },
                { title: "CONTRATO COMPLEMENTARIO", dataKey: "complementario", width: 22 },
                { title: "FECHA INICIO", dataKey: "fchInicio", width: 16 },
                { title: "AMPLIACIONES", dataKey: "ampliaciones", width: 18 },
                { title: "FECHA TERMINACION", dataKey: "fchTerminacion", width: 17 },
                { title: "ACTA PROVISIONAL", dataKey: "actProvisional", width: 19 },
                { title: "ACTA DEFINITIVA", dataKey: "actDefinitiva", width: 18 },
                { title: "ESTADO PROCESO", dataKey: "estadoActProceso", width: 20 },
                { title: "OBSERVACIONES", dataKey: "observaciones", width: 20 }
            ];

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
                                const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                                return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                            }) // Convertir cada valor a número
                            .reduce((acc: number, val: number) => acc + val, 0) // Sumar
                    ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
                    : "$ 0,00",
                reajustes: proyecto.reajustes
                    ? `$ ${(
                        proyecto.reajustes
                            .map((p: string) => {
                                const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                                return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                            }) // Convertir cada valor a número
                            .reduce((acc: number, val: number) => acc + val, 0) // Sumar
                    ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
                    : "0,00",
                costoPorcentaje: proyecto.costoPorcent
                    ? proyecto.presupuesto.includes(",")
                        ? `$ ${proyecto.presupuesto}`
                        : `$ ${proyecto.presupuesto},00`
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

            autoTable(doc, {
                columns: columnas,
                body: filas,
                startY,
                styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.4 }, // Ajuste de tamaño
                headStyles: { fontSize: 6, fillColor: [112, 128, 144], textColor: [255, 255, 255] },
                columnStyles: {
                    proyecto: { cellWidth: 52 }, // Definir ancho máximo
                    proceso: { cellWidth: 19 },
                    tecResponsable: { cellWidth: 18 },
                    admin: { cellWidth: 20 },
                    contratista: { cellWidth: 33 },
                    presupuesto: { cellWidth: 21 },
                    planillas: { cellWidth: 20 },
                    reajustes: { cellWidth: 20 },
                    costoPorcentaje: { cellWidth: 20 },
                    volumenes: { cellWidth: 20 },
                    complementario: { cellWidth: 22 },
                    fchInicio: { cellWidth: 16 },
                    ampliaciones: { cellWidth: 18 },
                    fchTerminacion: { cellWidth: 17 },
                    actProvisional: { cellWidth: 19 },
                    actDefinitiva: { cellWidth: 18 },
                    estadoActProceso: { cellWidth: 20 },
                    observaciones: { cellWidth: 20 },
                },
            });

            startY = (doc as any).autoTable.previous.finalY + 10;
        }
    });

    const fechaActual = new Date().toISOString().split("T")[0];
    doc.save(`Informe_General_${fechaActual}.pdf`);

    //PARA IMPRIMIR LISTA DE DIAS DE APLAICIONES
    // ampliaciones: proyecto.ampliaciones && proyecto.ampliaciones.length > 0
    //     ? proyecto.ampliaciones
    //         .filter((dias: string) => dias.trim() !== "" && !isNaN(Number(dias))) // Filtra los valores vacíos o no numéricos
    //         .map((dias: string) => `${parseInt(dias)} días`)         // Convierte solo los valores numéricos
    //         .join("\n")
    //     : "",
};
