import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
export const metadata = {
  title: "Gestión de Proyectos",
  icons: {
    icon: "/logoGADcirculo.png", // Ruta del ícono en la carpeta "public"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
