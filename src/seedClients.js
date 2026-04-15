export const seedClients = [
  {
    id: 1,
    name: "Mecánicos Asociados S.A.S",
    customerType: "Empresa",
    line: "Autos / Generales",
    context:
      "Empresa con 18 años en mantenimiento automotriz, con 5 sedes en Bogotá, Medellín y Cali.",
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
    customerType: "Empresa",
    line: "Vida / Generales",
    context:
      "Clínica privada con 25 años de trayectoria, sedes en Bogotá y Bucaramanga, y más de 200 empleados.",
    need:
      "Necesita proteger a su personal médico ante demandas y brindar cobertura de vida a sus empleados.",
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
    customerType: "Empresa",
    line: "Fianzas",
    context:
      "Empresa tecnológica con operación en 6 ciudades, dedicada a la gestión de sistemas de tránsito inteligente.",
    need:
      "Requiere respaldo contractual con el Estado y cobertura ante posibles incumplimientos.",
    premium: 150,
    claims: 40,
    commission: 22,
    detailByRamos: [
      { ramo: "Seguro de Cumplimiento (Contratos Estatales)", valor: 150 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 4,
    name: "Cooperativa de Hospitales de Antioquia",
    customerType: "Empresa",
    line: "Vida",
    context:
      "Red de 15 hospitales con más de 30 años en operación en Antioquia.",
    need:
      "Busca una cobertura colectiva de vida para el personal de toda la red hospitalaria.",
    premium: 180,
    claims: 70,
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
    customerType: "Empresa",
    line: "Vida",
    context:
      "Call center con cerca de 1.000 empleados y operación en Bogotá y Barranquilla.",
    need:
      "Quiere fortalecer los beneficios laborales con seguros de vida para apoyar la retención de talento.",
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
    customerType: "Empresa",
    line: "Fianzas / Generales",
    context:
      "Constructora con proyectos activos en Villavicencio, Bogotá y Pereira.",
    need:
      "Necesita cubrir contratos y riesgos operativos asociados a sus obras civiles.",
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
    customerType: "Empresa",
    line: "Generales",
    context:
      "Empresa de seguridad electrónica con presencia en 8 ciudades del país.",
    need:
      "Busca asegurar sus equipos tecnológicos y cubrir eventuales fallas frente a sus clientes.",
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
    customerType: "Empresa",
    line: "Vida / Generales",
    context:
      "Institución educativa con más de 20.000 estudiantes y operación en Medellín.",
    need:
      "Necesita cobertura para su comunidad académica y para eventos realizados dentro del campus.",
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
    customerType: "Empresa",
    line: "Autos / Generales",
    context:
      "Operador logístico con presencia en puertos y centros de distribución a nivel nacional.",
    need:
      "Requiere asegurar su flota y la mercancía transportada en sus operaciones.",
    premium: 210,
    claims: 120,
    commission: 32,
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
    customerType: "Empresa",
    line: "Generales / Fianzas",
    context:
      "Empresa del sector energético con operaciones en la Costa Caribe y Santander.",
    need:
      "Busca una cobertura integral para su infraestructura y para sus contratos energéticos.",
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
    customerType: "Empresa",
    line: "Vida / Generales",
    context:
      "Empresa de alimentos con operación en 10 ciudades del país.",
    need:
      "Necesita cubrir riesgos de operación y proteger a sus empleados.",
    premium: 110,
    claims: 40,
    commission: 16,
    detailByRamos: [],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 12,
    name: "Transportes Especiales Brasilia S.A.S",
    customerType: "Empresa",
    line: "Autos / SOAT",
    context:
      "Empresa de transporte de pasajeros con cobertura nacional.",
    need:
      "Requiere asegurar su flota y cumplir con los seguros obligatorios del sector.",
    premium: 300,
    claims: 200,
    commission: 45,
    detailByRamos: [
      { ramo: "Seguro de Automóviles", valor: 180 },
      { ramo: "Seguro Obligatorio de Accidentes de Tránsito (SOAT)", valor: 120 },
    ],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 13,
    name: "Universidad Minuto de Dios",
    customerType: "Empresa",
    line: "Vida",
    context:
      "Institución educativa con presencia en más de 15 ciudades del país.",
    need:
      "Busca fortalecer su estrategia de bienestar institucional mediante seguros de vida.",
    premium: 280,
    claims: 150,
    commission: 42,
    detailByRamos: [],
    visual: "empresa",
    status: "pending",
  },
  {
    id: 14,
    name: "Colombia Móvil S.A.S",
    customerType: "Empresa",
    line: "Generales / Vida",
    context:
      "Empresa de telecomunicaciones con cobertura nacional.",
    need:
      "Necesita proteger su infraestructura y a su personal estratégico.",
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
];