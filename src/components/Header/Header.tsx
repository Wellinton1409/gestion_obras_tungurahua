'use client';
import React from 'react';
import './Header.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const Header = () => {

    const router = useRouter();

    let links;
    links = (
        <>
            <li><Link href='/' className="enlace">INICIO</Link></li>
            <li><Link href='/fiscalizadores' className="enlace">FISCALIZADORES</Link></li>
            <li><Link href='/proyectos' className="enlace">PROYECTOS</Link></li>
            <li><Link href='/presupuestos' className="enlace">PRESUPUESTOS POR VIAS</Link></li>
            <li><Link href='/informes' className="enlace">INFORMES</Link></li>
        </>
    );

    return (
        <header className="header">
            <div className="headerImg">

                <img src='/logoGADcirculo.png' />
            </div>
            <div className='titulo_oculto'>
                <strong>INFORME DE PROYECTO</strong>
            </div>
            <nav className="barraNavegacion">
                <ul>
                    {links}
                </ul>
            </nav>
        </header>
    );
};
export default Header;
