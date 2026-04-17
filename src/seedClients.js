export const seedClients = [
  {
    id: 1,
    name: "Mecánicos Asociados S.A.S",
    customerType: "Cliente Jurídico",
    line: "Autos / Generales",
    context:
      "Empresa con 18 años en mantenimiento automotriz, 5 sedes en Cali.",
    need:
      "Busca asegurar su nueva flota de distribución y cubrir riesgos frente a terceros durante operaciones diarias.",
    premium: 120,
    claims: 60,
    commission: 18,
    detailByRamos: [
      { ramo: "Seguro de Automóviles", valor: 90 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 30 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 2,
    name: "Clínica Médico Quirúrgica S.A.S",
    customerType: "Cliente Jurídico",
    line: "Vida / Generales",
    context:
      "Clínica privada con 25 años de experiencia, ubicada en Bogotá y con una sede nueva en Bucaramanga. Cuenta con más de 200 empleados.",
    need:
      "La clínica busca proteger a su personal médico ante posibles demandas por mala praxis, así como garantizar cobertura de vida para sus empleados en caso de eventos inesperados.",
    premium: 200,
    claims: 90,
    commission: 30,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 120 },
      { ramo: "Seguro de Responsabilidad Civil Profesional Médica", valor: 80 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 3,
    name: "Consorcio Circulemos Digital",
    customerType: "Cliente Jurídico",
    line: "Fianzas",
    context:
      "Empresa tecnológica con presencia en seis ciudades, especializada en la gestión de sistemas de tránsito inteligente.",
    need:
      "La empresa requiere respaldo contractual con el Estado, así como cobertura ante posibles incumplimientos.",
    premium: 150,
    claims: 40,
    commission: 22,
    detailByRamos: [
      { ramo: "Seguro de Cumplimiento (Contratos Estatales)", valor: 150 },
    ],
    visual: " empresa",
    status: "pending",
  },
  {
    id: 4,
    name: "Cooperativa de Hospitales de Antioquia",
    customerType: "Cliente Jurídico",
    line: "Vida",
    context:
      "Red de 15 hospitales con más de 30 años en operación en Antioquia.",
    need:
      "Busca una cobertura colectiva de vida para el personal de toda la red hospitalaria.",
    premium: 180,
    claims: 195,
    commission: 27,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 180 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 5,
    name: "Grancall S.A.S",
    customerType: "Cliente Jurídico",
    line: "Vida",
    context:
      "Call center con más de 1.000 empleados, con operación en Bogotá y Barranquilla.",
    need:
      "Busca fortalecer sus beneficios laborales mediante seguros de vida, con el objetivo de mejorar la retención de talento.",
    premium: 90,
    claims: 30,
    commission: 13,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 90 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 6,
    name: "Constructora Morichal S.A.S",
    customerType: "Cliente Jurídico",
    line: "Fianzas / Generales",
    context:
      "Constructora con proyectos en Villavicencio, Bogotá y Pereira, con amplia experiencia en obra civil.",
    need:
      "Requiere cobertura para contratos, así como protección frente a riesgos operativos y posibles incumplimientos en sus proyectos.",
    premium: 220,
    claims: 110,
    commission: 35,
    detailByRamos: [
      { ramo: "Seguro de Cumplimiento (Contratos de Obra)", valor: 140 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 80 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 7,
    name: "Society Protection Technics Colombia Ltda",
    customerType: "Cliente Jurídico",
    line: "Generales",
    context:
      "Empresa de seguridad electrónica con presencia en ocho ciudades, especializada en soluciones tecnológicas para monitoreo y protección.",
    need:
      "Busca asegurar sus equipos tecnológicos y contar con cobertura frente a fallas o incumplimientos en el servicio a sus clientes.",
    premium: 130,
    claims: 50,
    commission: 20,
    detailByRamos: [
      { ramo: "Seguro Todo Riesgo Daños Materiales", valor: 90 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 40 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 8,
    name: "Instituto Tecnológico Metropolitano",
    customerType: "Cliente Jurídico",
    line: "Vida / Generales",
    context:
      "Institución educativa con más de 20.000 estudiantes en Medellín, con una amplia comunidad académica y trayectoria en formación.",
    need:
      "Requiere cobertura para su comunidad académica, así como protección en eventos y actividades desarrolladas dentro del campus.",
    premium: 160,
    claims: 60,
    commission: 24,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 100 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 60 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 9,
    name: "MPI Logística S.A.S",
    customerType: "Cliente Jurídico",
    line: "Autos / Generales",
    context:
      "Operador logístico con presencia en puertos y centros de distribución a nivel nacional, especializado en el manejo y transporte de mercancías.",
    need:
      "Requiere asegurar su flota, así como la mercancía transportada, garantizando cobertura frente a riesgos durante la operación.",
    premium: 210,
    claims: 180,
    commission: 38,
    detailByRamos: [
      { ramo: "Seguro de Automóviles", valor: 130 },
      { ramo: "Seguro de Transporte de Mercancías", valor: 80 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 10,
    name: "Procesos Energéticos Integrales S.A.S",
    customerType: "Cliente Jurídico",
    line: "Generales / Fianzas",
    context:
      "Empresa energética con operaciones en la Costa Caribe y Santander, con experiencia en la gestión y distribución de recursos energéticos.",
    need:
      "Busca una cobertura integral para su infraestructura, así como respaldo en sus contratos energéticos frente a posibles riesgos e incumplimientos.",
    premium: 250,
    claims: 140,
    commission: 38,
    detailByRamos: [
      { ramo: "Seguro Todo Riesgo Daños Materiales", valor: 150 },
      { ramo: "Seguro de Cumplimiento (Contratos Energéticos)", valor: 100 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 11,
    name: "Servicasinos Catering S.A.S",
    customerType: "Cliente Jurídico",
    line: "Vida / Generales",
    context:
      "Empresa del sector de alimentos con operación en 10 ciudades, enfocada en la producción y distribución a nivel nacional.",
    need:
      "Requiere cobertura para riesgos operativos, así como protección para sus empleados frente a eventualidades en el desarrollo de sus actividades.",
    premium: 110,
    claims: 40,
    commission: 16,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 60 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 50 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 12,
    name: "Transportes Especiales Brasilia S.A.S",
    customerType: "Cliente Jurídico",
    line: "Autos",
    context:
      "Empresa de transporte de pasajeros con cobertura a nivel nacional, con amplia experiencia en la movilización de usuarios.",
    need:
      "Requiere asegurar su flota y cumplir con los seguros obligatorios, garantizando protección tanto para los pasajeros como para la operación.",
    premium: 300,
    claims: 280,
    commission: 32,
    detailByRamos: [
      { ramo: "Seguro de Automóviles", valor: 230 },
      { ramo: "Seguro de Responsabilidad Civil Extracontractual", valor: 70 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 13,
    name: "Universidad Minuto de Dios",
    customerType: "Cliente Jurídico",
    line: "Vida",
    context:
      "Institución educativa con presencia en más de 15 ciudades, con una amplia cobertura a nivel nacional.",
    need:
      "Busca protección para su comunidad académica y respaldo ante riesgos asociados a sus operaciones y actividades educativas.",
    premium: 280,
    claims: 150,
    commission: 42,
    detailByRamos: [
      { ramo: "Seguro de Vida Grupo", valor: 280 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 14,
    name: "Colombia Móvil S.A.S",
    customerType: "Cliente Jurídico",
    line: "Generales / Vida",
    context:
      "Empresa de telecomunicaciones con cobertura nacional, enfocada en la conectividad y prestación de servicios tecnológicos.",
    need:
      "Requiere proteger su infraestructura crítica y su personal estratégico, garantizando continuidad operativa frente a posibles riesgos.",
    premium: 350,
    claims: 180,
    commission: 50,
    detailByRamos: [
      { ramo: "Seguro Todo Riesgo Daños Materiales", valor: 200 },
      { ramo: "Seguro de Vida Grupo", valor: 150 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 15,
    name: "Juan Pablo Ríos",
    customerType: "Cliente Natural",
    line: "Vida / Autos / Generales",
    context:
      "Empresario independiente con 3 negocios (transporte y comercio), vive en Bogotá, 42 años.",
    need:
      "Busca proteger su patrimonio familiar, asegurar sus vehículos de trabajo y garantizar estabilidad económica para su familia en caso de fallecimiento o incapacidad.",
    premium: 95,
    claims: 40,
    commission: 14,
    detailByRamos: [
      { ramo: "Seguro de Vida Individual", valor: 40 },
      { ramo: "Seguro de Automóviles", valor: 35 },
      { ramo: "Seguro de Hogar", valor: 20 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 16,
    name: "María Fernanda Castro",
    customerType: "Cliente Natural",
    line: "Vida / Generales / Autos",
    context:
      "Alta ejecutiva en multinacional, vive en Medellín, viaja constantemente, 38 años.",
    need:
      "Quiere asegurar su vida, proteger su apartamento y contar con cobertura para sus viajes frecuentes al exterior.",
    premium: 110,
    claims: 50,
    commission: 18,
    detailByRamos: [
      { ramo: "Seguro de Vida Individual", valor: 50 },
      { ramo: "Seguro de Hogar", valor: 30 },
      { ramo: "Seguro de Automóviles", valor: 30 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 17,
    name: "Andrés Felipe Moreno",
    customerType: "Cliente Natural",
    line: "Generales / Autos / Vida",
    context:
      "Ingeniero civil independiente, trabaja en proyectos en Bogotá y Tunja, 45 años.",
    need:
      "Necesita proteger su responsabilidad profesional y asegurar su vehículo de trabajo, además de contar con respaldo personal.",
    premium: 85,
    claims: 105,
    commission: 12,
    detailByRamos: [
      { ramo: "Seguro de Responsabilidad Civil Profesional", valor: 30 },
      { ramo: "Seguro de Automóviles", valor: 35 },
      { ramo: "Seguro de Vida Individual", valor: 20 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 18,
    name: "Catalina Gómez",
    customerType: "Cliente Natural",
    line: "Generales / Vida",
    context:
      "Emprendedora digital con tienda online, vive en Cali, 33 años.",
    need:
      "Busca proteger su vivienda, asegurar sus equipos tecnológicos y contar con un seguro de vida básico.",
    premium: 70,
    claims: 30,
    commission: 10,
    detailByRamos: [
      { ramo: "Seguro de Hogar", valor: 40 },
      { ramo: "Seguro de Vida Individual", valor: 30 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 19,
    name: "Luis Alberto Ramírez",
    customerType: "Cliente Natural",
    line: "Generales",
    context:
      "Comerciante con local propio en Barranquilla, 50 años.",
    need:
      "Quiere asegurar su local comercial, proteger su inventario y contar con respaldo ante eventos inesperados.",
    premium: 80,
    claims: 120,
    commission: 25,
    detailByRamos: [
      { ramo: "Seguro Todo Riesgo Daños Materiales (Comercio)", valor: 80 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 20,
    name: "Diana Carolina Pardo",
    customerType: "Cliente Natural",
    line: "Generales / Vida",
    context:
      "Médica especialista independiente en Bogotá, 41 años.",
    need:
      "Necesita protegerse ante posibles demandas profesionales, asegurar su vida y proteger su patrimonio familiar.",
    premium: 105,
    claims: 60,
    commission: 16,
    detailByRamos: [
      { ramo: "Seguro de Responsabilidad Civil Profesional Médica", valor: 55 },
      { ramo: "Seguro de Vida Individual", valor: 50 },
    ],
    visual: "persona",
    status: "pending",
  },
  {
    id: 21,
    name: "Sebastián Torres",
    customerType: "Cliente Natural",
    line: "Autos / Generales / Vida",
    context:
      "Joven profesional en tecnología, trabaja remoto desde Medellín, 29 años.",
    need:
      "Busca asegurar su primer vehículo, proteger su apartamento recién adquirido y empezar a construir protección financiera a futuro.",
    premium: 75,
    claims: 20,
    commission: 11,
    detailByRamos: [
      { ramo: "Seguro de Automóviles", valor: 35 },
      { ramo: "Seguro de Hogar", valor: 25 },
      { ramo: "Seguro de Vida Individual", valor: 15 },
    ],
    visual: "persona",
    status: "pending",
  },
];