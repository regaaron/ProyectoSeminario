import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './temas.component.html',
  styleUrl: './temas.component.css'
})
export class TemasComponent {
  @ViewChild('detalleSeccion') detalleSeccion!: ElementRef;

  temas = [
      {
      nombre: 'Matemáticas',
      descripcion: 'Domina los fundamentos numéricos.',
      icono: 'fas fa-calculator',
      temas: [
        { nombre: 'Álgebra', descripcion: 'Ecuaciones y funciones.' },
        { nombre: 'Geometría', descripcion: 'Formas y medidas.' },
        { nombre: 'Cálculo', descripcion: 'Derivadas e integrales.' },
        { nombre: 'Estadística', descripcion: 'Análisis de datos.' }
      ]
    },
    {
      nombre: 'Redes',
      descripcion: 'Aprende sobre conexiones y protocolos.',
      icono: 'fas fa-network-wired',
      temas: [
        { nombre: 'TCP/IP', descripcion: 'Protocolo de comunicación.' },
        { nombre: 'Seguridad de redes', descripcion: 'Protege tus datos.' },
        { nombre: 'Configuración de routers', descripcion: 'Conecta dispositivos.' },
        { nombre: 'Redes inalámbricas', descripcion: 'Conexiones sin cables.' }
      ]
    },
    {
      nombre: 'Ciberseguridad',
      descripcion: 'Protege sistemas y datos críticos.',
      icono: 'fas fa-lock',
      temas: [
        { nombre: 'Criptografía', descripcion: 'Cifrado de información.' },
        { nombre: 'Seguridad en la nube', descripcion: 'Protege tus datos online.' },
        { nombre: 'Análisis forense digital', descripcion: 'Investiga incidentes.' },
        { nombre: 'Gestión de vulnerabilidades', descripcion: 'Identifica y corrige fallos.' },
        { nombre: 'Seguridad en aplicaciones web', descripcion: 'Protege tus aplicaciones.' },
        { nombre: 'Seguridad en redes', descripcion: 'Defiende tus conexiones.' },
        { nombre: 'Seguridad en dispositivos móviles', descripcion: 'Protege tus smartphones.' }

      ]
    },
    {
      nombre: 'Bases de datos',
      descripcion: 'Consulta grandes volúmenes de datos.',
      icono: 'fas fa-database',
      temas: [
        { nombre: 'SQL', descripcion: 'Lenguaje de consulta estructurado.' },
        { nombre: 'NoSQL', descripcion: 'Bases de datos no relacionales.' },
        { nombre: 'Modelado de datos', descripcion: 'Estructura y organización.' },
        { nombre: 'Optimización de consultas', descripcion: 'Mejora el rendimiento.' },
        { nombre: 'Administración de bases de datos', descripcion: 'Mantenimiento y gestión.' },
        { nombre: 'Seguridad en bases de datos', descripcion: 'Protege tus datos.' },
        { nombre: 'Backup y recuperación', descripcion: 'Copia y restauración de datos.' }
      ]
    },
    {
      nombre: 'Sistemas operativos',
      descripcion: 'Comprende cómo funciona tu sistema.',
      icono: 'fas fa-cogs',
      temas: [
        { nombre: 'Linux', descripcion: 'Sistema operativo de código abierto.' },
        { nombre: 'Windows', descripcion: 'Sistema operativo de Microsoft.' },
        { nombre: 'MacOS', descripcion: 'Sistema operativo de Apple.' },
        { nombre: 'Virtualización', descripcion: 'Ejecuta múltiples sistemas.' },
        { nombre: 'Administración de sistemas', descripcion: 'Mantenimiento y gestión.' },
        { nombre: 'Seguridad en sistemas operativos', descripcion: 'Protege tu sistema.' },
        { nombre: 'Automatización de tareas', descripcion: 'Scripts y herramientas.' }
      ]
      
    },
    {
      nombre: 'Algoritmos',
      descripcion: 'Mejora tu lógica y programación.',
      icono: 'fas fa-code-branch',
      temas: [
        { nombre: 'Ordenamiento', descripcion: 'Técnicas para organizar datos.' },
        { nombre: 'Búsqueda', descripcion: 'Encontrar información eficientemente.' },
        { nombre: 'Recursión', descripcion: 'Funciones que se llaman a sí mismas.' },
        { nombre: 'Complejidad computacional', descripcion: 'Análisis de eficiencia.' },
        { nombre: 'Estructuras de datos', descripcion: 'Organización de datos.' },
        { nombre: 'Programación dinámica', descripcion: 'Optimización de problemas.' },
        { nombre: 'Algoritmos de grafos', descripcion: 'Análisis de redes y relaciones.' }
      ]
    }
  ];

  temaSeleccionado: any = null;

  seleccionarTema(tema: any){
    this.temaSeleccionado = tema;
    
    setTimeout ( ()=>{
      this.detalleSeccion?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    },100);
  }

}
