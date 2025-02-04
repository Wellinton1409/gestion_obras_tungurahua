
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFPersonal = (fiscalizador: string, proyectos: any[]) => {
    if (typeof window === "undefined") return;

    const doc = new jsPDF("landscape", "mm", "a3"); // Generar en horizontal

    const img = "/logoGADcirculo.png"; // Ruta relativa en public/
    doc.addImage(img, "PNG", 15, 4, 25, 25); // (imagen, formato, x, y, ancho, alto)

    // Título del informe
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INFORME TÉCNICO DE PROYECTOS', 210, 18, { align: 'center' });

    // Espaciado antes de la tabla
    doc.setFontSize(12);
    doc.text(`Fiscalizador: ${fiscalizador}`, 15, 40);

    // Definir estructura de la tabla con anchos de columna
    const columnas = [
        { title: "Proyecto", dataKey: "proyecto", width: 70 },
        { title: "Proceso contratación", dataKey: "proceso", width: 35 },
        { title: "Técnico responsable", dataKey: "tecResponsable", width: 35 },
        { title: "Administrador", dataKey: "admin", width: 35 },
        { title: "Contratista", dataKey: "contratista", width: 40 },
        { title: "Costo del proyecto", dataKey: "costo", width: 25 },
        { title: "Planillas canceladas", dataKey: "planillas", width: 25 },
        { title: "Ampliaciones", dataKey: "ampliaciones", width: 23 },
        { title: "Incremento de volúmenes", dataKey: "volumenes", width: 25 },
        { title: "Contrato complementario", dataKey: "complementario", width: 27 },
        { title: "Acta provisional", dataKey: "actProvisional", width: 25 },
        { title: "Acta definitiva", dataKey: "actDefinitiva", width: 25 }
    ];

    const filas = proyectos.map((proyecto) => ({
        proyecto: proyecto.nombreProyecto,
        proceso: proyecto.codContratacion || "",
        tecResponsable: proyecto.tecnicoResponsable || "",
        admin: proyecto.admiContrato || "",
        contratista: proyecto.contratista || "",
        costo: proyecto.presupuesto
            ? proyecto.presupuesto.includes(",")
                ? `$ ${proyecto.presupuesto}`
                : `$ ${proyecto.presupuesto},00`
            : "",
        planillas: proyecto.planillas
            ? `$ ${(
                proyecto.planillas
                    .map((p: string) => {
                        const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                        return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                    }) // Convertir cada valor a número
                    .reduce((acc: number, val: number) => acc + val, 0) // Sumar
            ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
            : "",
        ampliaciones: proyecto.ampliaciones && proyecto.ampliaciones.length > 0
            ? proyecto.ampliaciones
                .filter((dias: string) => dias.trim() !== "" && !isNaN(Number(dias))) // Filtra los valores vacíos o no numéricos
                .map((dias: string) => `${parseInt(dias)} días`)         // Convierte solo los valores numéricos
                .join("\n")
            : "",
        volumenes: proyecto.incremVolumenes
            ? proyecto.incremVolumenes.includes(",")
                ? `$ ${proyecto.incremVolumenes}`
                : `$ ${proyecto.incremVolumenes},00`
            : "",
        complementario: proyecto.contrComplementario
            ? proyecto.contrComplementario.includes(",")
                ? `$ ${proyecto.contrComplementario}`
                : `$ ${proyecto.contrComplementario},00`
            : "",
        actProvisional: proyecto.actaProvisional || "",
        actDefinitiva: proyecto.actaDefinitiva || ""
    }));

    autoTable(doc, {
        columns: columnas,
        body: filas,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.4 }, // Ajuste de tamaño
        columnStyles: {
            proyecto: { cellWidth: 70 }, // Definir ancho máximo
            proceso: { cellWidth: 35 },
            tecResponsable: { cellWidth: 35 },
            admin: { cellWidth: 35 },
            contratista: { cellWidth: 40 },
            costo: { cellWidth: 25 },
            planillas: { cellWidth: 25 },
            ampliaciones: { cellWidth: 23 },
            volumenes: { cellWidth: 25 },
            complementario: { cellWidth: 27 },
            actProvisional: { cellWidth: 25 },
            actDefinitiva: { cellWidth: 25 },
        },
        headStyles: { fillColor: [112, 128, 144], textColor: [255, 255, 255] }, // Color de encabezado
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

        console.log(`Fiscalizador: ${usuario.nombre} - Proyectos:`, proyectosFiscalizador);

        if (proyectosFiscalizador.length > 0) {
            doc.setFontSize(12);
            doc.text(`Fiscalizador: ${usuario.nombre}`, 15, startY);
            startY += 5;

            const columnas = [
                { title: "Proyecto", dataKey: "proyecto", width: 70 },
                { title: "Proceso contratación", dataKey: "proceso", width: 35 },
                { title: "Técnico responsable", dataKey: "tecResponsable", width: 35 },
                { title: "Administrador", dataKey: "admin", width: 35 },
                { title: "Contratista", dataKey: "contratista", width: 40 },
                { title: "Costo del proyecto", dataKey: "costo", width: 25 },
                { title: "Planillas canceladas", dataKey: "planillas", width: 25 },
                { title: "Ampliaciones", dataKey: "ampliaciones", width: 23 },
                { title: "Incremento de volúmenes", dataKey: "volumenes", width: 25 },
                { title: "Contrato complementario", dataKey: "complementario", width: 27 },
                { title: "Acta provisional", dataKey: "actProvisional", width: 25 },
                { title: "Acta definitiva", dataKey: "actDefinitiva", width: 25 }
            ];

            const filas = proyectosFiscalizador.map((proyecto) => ({
                proyecto: proyecto.nombreProyecto,
                proceso: proyecto.codContratacion || "",
                tecResponsable: proyecto.tecnicoResponsable || "",
                admin: proyecto.admiContrato || "",
                contratista: proyecto.contratista || "",
                costo: proyecto.presupuesto
                    ? proyecto.presupuesto.includes(",")
                        ? `$ ${proyecto.presupuesto}`
                        : `$ ${proyecto.presupuesto},00`
                    : "",
                planillas: proyecto.planillas
                    ? `$ ${(
                        proyecto.planillas
                            .map((p: string) => {
                                const parsedValue = parseFloat(p.replace(',', '.')); // Reemplazar coma por punto para decimales
                                return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número válido, usamos 0
                            }) // Convertir cada valor a número
                            .reduce((acc: number, val: number) => acc + val, 0) // Sumar
                    ).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` // Formato con coma decimal y punto para miles
                    : "",
                ampliaciones: proyecto.ampliaciones && proyecto.ampliaciones.length > 0
                    ? proyecto.ampliaciones
                        .filter((dias: string) => dias.trim() !== "" && !isNaN(Number(dias))) // Filtra los valores vacíos o no numéricos
                        .map((dias: string) => `${parseInt(dias)} días`)         // Convierte solo los valores numéricos
                        .join("\n")
                    : "",
                volumenes: proyecto.incremVolumenes
                    ? proyecto.incremVolumenes.includes(",")
                        ? `$ ${proyecto.incremVolumenes}`
                        : `$ ${proyecto.incremVolumenes},00`
                    : "",
                complementario: proyecto.contrComplementario
                    ? proyecto.contrComplementario.includes(",")
                        ? `$ ${proyecto.contrComplementario}`
                        : `$ ${proyecto.contrComplementario},00`
                    : "",
                actProvisional: proyecto.actaProvisional || "",
                actDefinitiva: proyecto.actaDefinitiva || ""
            }));

            autoTable(doc, {
                columns: columnas,
                body: filas,
                startY,
                styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.4 }, // Ajuste de tamaño
                columnStyles: {
                    proyecto: { cellWidth: 70 }, // Definir ancho máximo
                    proceso: { cellWidth: 35 },
                    tecResponsable: { cellWidth: 35 },
                    admin: { cellWidth: 35 },
                    contratista: { cellWidth: 40 },
                    costo: { cellWidth: 25 },
                    planillas: { cellWidth: 25 },
                    ampliaciones: { cellWidth: 23 },
                    volumenes: { cellWidth: 25 },
                    complementario: { cellWidth: 27 },
                    actProvisional: { cellWidth: 25 },
                    actDefinitiva: { cellWidth: 25 },
                },
                headStyles: { fillColor: [112, 128, 144], textColor: [255, 255, 255] }, // Color de encabezado
            });

            startY = (doc as any).autoTable.previous.finalY + 10; // Mover la siguiente tabla hacia abajo
        }
    });

    // Descargar PDF
    doc.save("Informe_General.pdf");
};
