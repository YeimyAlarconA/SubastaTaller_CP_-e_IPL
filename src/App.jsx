import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Coins,
  Bell,
  Star,
  Users,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  PlayCircle,
  Crown,
  BarChart3,
  Building2,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Gauge,
  PartyPopper,
  CheckCircle2,
  RotateCcw,
  Eye,
  EyeOff,
  User,
} from "lucide-react";

const GASTO_META = 500;

const branchSeeds = [
  {
    id: "bogota",
    nombre: "Sucursal Bogotá",
    color: "from-slate-800 via-slate-700 to-slate-900",
    primas: 0,
    siniestros: 0,
    comisiones: 0,
    gastoMeta: GASTO_META,
  },
  {
    id: "medellin",
    nombre: "Sucursal Medellín",
    color: "from-slate-700 via-slate-600 to-slate-900",
    primas: 0,
    siniestros: 0,
    comisiones: 0,
    gastoMeta: GASTO_META,
  },
];

const intermediarySeeds = [
  {
    id: 1,
    nombre: "Laura Gómez",
    avatar: "LG",
    sucursal: "bogota",
    antiguedad: 7,
    lineas: ["Autos", "Vida"],
    fortalezas: ["Cierre comercial", "Retención", "Conocimiento técnico"],
    perfil: "Fuerte en clientes persona natural y movilidad.",
    relacion: 90,
    cierre: 87,
    tecnica: 85,
  },
  {
    id: 2,
    nombre: "Andrés Ruiz",
    avatar: "AR",
    sucursal: "bogota",
    antiguedad: 11,
    lineas: ["Fianzas", "Generales"],
    fortalezas: ["Negociación", "Sector empresarial", "Prospección"],
    perfil: "Muy sólido en negocios corporativos y cierre estructurado.",
    relacion: 84,
    cierre: 79,
    tecnica: 91,
  },
  {
    id: 3,
    nombre: "Camilo Vélez",
    avatar: "CV",
    sucursal: "medellin",
    antiguedad: 9,
    lineas: ["Vida", "Generales"],
    fortalezas: ["Fidelización", "Cross-sell", "Empatía comercial"],
    perfil: "Muy fuerte en profundización y mantenimiento de cartera.",
    relacion: 92,
    cierre: 80,
    tecnica: 82,
  },
  {
    id: 4,
    nombre: "Natalia Mesa",
    avatar: "NM",
    sucursal: "medellin",
    antiguedad: 6,
    lineas: ["Autos", "Fianzas"],
    fortalezas: ["Prospección", "Energía comercial", "Negociación"],
    perfil: "Buena para abrir negocio y activar oportunidades nuevas.",
    relacion: 76,
    cierre: 88,
    tecnica: 79,
  },
];

const clientSeeds = [
  {
    id: 101,
    nombre: "Van Colombia",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Asegurar flota corporativa",
    contexto:
      "La empresa acaba de ampliar su operación y necesita asegurar 12 vehículos de distribución urbana.",
    linea: "Autos",
    prima: 120,
    siniestro: 38,
    comision: 12,
    riesgo: "Medio",
    tag: "Alta oportunidad",
  },
  {
    id: 102,
    nombre: "Carlos Ramírez",
    tipo: "Persona natural",
    visual: "hombre",
    necesidad: "Asegurar vehículo particular",
    contexto:
      "Va a comprar un Mazda 2 modelo 2024 y busca cobertura para uso diario en Bogotá.",
    linea: "Autos",
    prima: 4.2,
    siniestro: 1.1,
    comision: 0.42,
    riesgo: "Bajo",
    tag: "Cierre rápido",
  },
  {
    id: 103,
    nombre: "Constructora Horizonte",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Garantías para contratos",
    contexto:
      "Necesita respaldo para participar en nuevos procesos contractuales durante el trimestre.",
    linea: "Fianzas",
    prima: 180,
    siniestro: 20,
    comision: 16,
    riesgo: "Bajo",
    tag: "Cliente estratégico",
  },
  {
    id: 104,
    nombre: "Grupo Vital",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Cobertura de vida colectiva",
    contexto:
      "Busca una solución para su equipo directivo y personal clave.",
    linea: "Vida",
    prima: 90,
    siniestro: 25,
    comision: 9,
    riesgo: "Medio",
    tag: "Alta retención",
  },
  {
    id: 105,
    nombre: "Logística Nova",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Renovar pólizas de vehículos y carga",
    contexto:
      "Viene de una mala experiencia con su aseguradora actual, pero tiene siniestralidad presionada.",
    linea: "Generales",
    prima: 140,
    siniestro: 62,
    comision: 14,
    riesgo: "Alto",
    tag: "Riesgo alto",
  },
  {
    id: 106,
    nombre: "Mónica Londoño",
    tipo: "Persona natural",
    visual: "mujer",
    necesidad: "Proteger vehículo y hogar",
    contexto:
      "Busca agrupar seguros con una sola compañía si le ofrecen buena atención.",
    linea: "Generales",
    prima: 8.5,
    siniestro: 2.3,
    comision: 0.85,
    riesgo: "Bajo",
    tag: "Cross-sell",
  },
  {
    id: 107,
    nombre: "Red Médica Integral",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Cobertura de vida y patrimoniales",
    contexto:
      "Busca una solución integral y valora mucho el acompañamiento técnico.",
    linea: "Vida",
    prima: 130,
    siniestro: 34,
    comision: 13,
    riesgo: "Medio",
    tag: "Cliente valioso",
  },
  {
    id: 108,
    nombre: "Agroinsumos del Centro",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Póliza patrimonial",
    contexto:
      "Quiere asegurar inventario y operación, pero todavía está comparando propuestas.",
    linea: "Generales",
    prima: 72,
    siniestro: 21,
    comision: 7,
    riesgo: "Medio",
    tag: "Oportunidad media",
  },
  {
    id: 109,
    nombre: "María José Díaz",
    tipo: "Persona natural",
    visual: "mujer",
    necesidad: "Seguro de vida individual",
    contexto:
      "Está organizando sus finanzas y quiere proteger a su familia.",
    linea: "Vida",
    prima: 5.8,
    siniestro: 1.4,
    comision: 0.58,
    riesgo: "Bajo",
    tag: "Rentable",
  },
  {
    id: 110,
    nombre: "TecnoMarket SAS",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Cumplimiento y manejo",
    contexto:
      "Requiere una respuesta rápida para cerrar un negocio en menos de una semana.",
    linea: "Fianzas",
    prima: 110,
    siniestro: 15,
    comision: 10,
    riesgo: "Bajo",
    tag: "Urgente",
  },
  {
    id: 111,
    nombre: "MoviExpress",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Póliza de flota mixta",
    contexto:
      "Tiene alto movimiento operativo y antecedentes de reclamaciones recientes.",
    linea: "Autos",
    prima: 155,
    siniestro: 74,
    comision: 15,
    riesgo: "Alto",
    tag: "Cliente complejo",
  },
  {
    id: 112,
    nombre: "Isabela Cárdenas",
    tipo: "Persona natural",
    visual: "mujer",
    necesidad: "Asegurar su primer carro",
    contexto:
      "Busca respaldo, facilidad y una experiencia sencilla de compra.",
    linea: "Autos",
    prima: 3.9,
    siniestro: 1.0,
    comision: 0.39,
    riesgo: "Bajo",
    tag: "Fácil de cerrar",
  },
  {
    id: 113,
    nombre: "Felipe Torres",
    tipo: "Persona natural",
    visual: "hombre",
    necesidad: "Seguro de vida y accidentes",
    contexto:
      "Quiere proteger a su familia y busca una cobertura sencilla con buen respaldo.",
    linea: "Vida",
    prima: 6.2,
    siniestro: 1.8,
    comision: 0.62,
    riesgo: "Bajo",
    tag: "Persona natural",
  },
  {
    id: 114,
    nombre: "Distribuciones Andina SAS",
    tipo: "Empresa",
    visual: "empresa",
    necesidad: "Póliza patrimonial y transporte",
    contexto:
      "Necesita asegurar inventario y mercancía por expansión de operaciones.",
    linea: "Generales",
    prima: 160,
    siniestro: 40,
    comision: 15,
    riesgo: "Medio",
    tag: "Empresa clave",
  },
];

const rules = [
  "Hay 2 sucursales, 4 intermediarios y 14 clientes ficticios.",
  "Cada intermediario pertenece a una sucursal y puede llevar clientes a ella.",
  "La sucursal arranca en cero y va construyendo su resultado a medida que entren clientes.",
  "Cada sucursal debe cubrir un gasto meta inicial de 500 millones.",
  "Los clientes aparecen uno por uno como carta revelable y luego pasan a la sucursal.",
];

function round2(n) {
  return Math.round(n * 100) / 100;
}

function getResultado(branch) {
  return round2(branch.primas - branch.siniestros - branch.comisiones);
}

function getGastoPendiente(branch) {
  return Math.max(0, round2(branch.gastoMeta - getResultado(branch)));
}

function getUtilidad(branch) {
  return round2(getResultado(branch) - branch.gastoMeta);
}

function getCobertura(branch) {
  if (branch.gastoMeta <= 0) return 100;
  return Math.min(100, round2((getResultado(branch) / branch.gastoMeta) * 100));
}

function getSemaforo(cobertura) {
  if (cobertura >= 100)
    return { label: "Verde", dot: "bg-emerald-500", text: "text-emerald-700" };
  if (cobertura >= 60)
    return { label: "Amarillo", dot: "bg-amber-400", text: "text-amber-700" };
  return { label: "Rojo", dot: "bg-rose-500", text: "text-rose-700" };
}

function riskClasses(risk) {
  if (risk === "Bajo") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (risk === "Medio") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-rose-100 text-rose-700 border-rose-200";
}

function fitScore(client, intermediary) {
  const lineMatch = intermediary.lineas.includes(client.linea) ? 18 : 0;
  const riskPenalty = client.riesgo === "Alto" ? 14 : client.riesgo === "Medio" ? 7 : 0;
  const retentionValue = 100 - Math.min(95, client.siniestro * 0.9);

  return Math.max(
    1,
    Math.round(
      intermediary.relacion * 0.3 +
        intermediary.cierre * 0.3 +
        intermediary.tecnica * 0.2 +
        retentionValue * 0.2 +
        lineMatch -
        riskPenalty
    )
  );
}

function formatMoney(value) {
  return `$${value} M`;
}

function PanelButton({ active, icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {children}
      </span>
    </button>
  );
}

function CardBox({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent = "text-slate-900" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

function BadgePill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function AvatarBubble({ text, bg = "bg-slate-900" }) {
  return (
    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${bg} text-sm font-bold text-white shadow-sm`}>
      {text}
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

function LogoHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
        <Building2 className="h-5 w-5" />
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-900">Subasta Interactiva</div>
      </div>
    </div>
  );
}

function ClientVisual({ visual }) {
  if (visual === "empresa") {
    return (
      <div className="flex h-44 items-center justify-center rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative flex h-28 w-28 items-end justify-center rounded-[28px] bg-slate-800 shadow-lg">
          <div className="mb-4 grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-sm bg-white/85" />
            ))}
          </div>
          <div className="absolute -top-3 h-5 w-20 rounded-full bg-white/20 blur-sm" />
        </div>
      </div>
    );
  }

  if (visual === "mujer") {
    return (
      <div className="flex h-44 items-end justify-center rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="relative h-36 w-28">
          <div className="absolute left-1/2 top-3 h-20 w-20 -translate-x-1/2 rounded-full bg-[#5b3b35]" />
          <div className="absolute left-1/2 top-8 h-20 w-16 -translate-x-1/2 rounded-[40px] bg-[#f2c7a7]" />
          <div className="absolute left-1/2 top-[92px] h-10 w-8 -translate-x-1/2 rounded-b-xl bg-[#f2c7a7]" />
          <div className="absolute bottom-0 left-1/2 h-16 w-24 -translate-x-1/2 rounded-t-[28px] bg-[#d7dce8]" />
          <div className="absolute left-5 top-16 h-2 w-2 rounded-full bg-slate-800" />
          <div className="absolute right-5 top-16 h-2 w-2 rounded-full bg-slate-800" />
          <div className="absolute left-1/2 top-[76px] h-2 w-4 -translate-x-1/2 rounded-full bg-rose-300" />
          <div className="absolute left-1/2 top-20 h-3 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-rose-500" />
          <div className="absolute left-2 top-10 h-16 w-10 rounded-l-full bg-[#5b3b35]" />
          <div className="absolute right-2 top-10 h-16 w-10 rounded-r-full bg-[#5b3b35]" />
          <div className="absolute left-1/2 top-[50px] h-10 w-10 -translate-x-1/2 rounded-full border-2 border-slate-300" />
          <div className="absolute left-[18px] top-[50px] h-10 w-10 rounded-full border-2 border-slate-300" />
          <div className="absolute left-[58px] top-[64px] h-0.5 w-10 bg-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-44 items-end justify-center rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="relative h-36 w-28">
        <div className="absolute left-1/2 top-3 h-20 w-20 -translate-x-1/2 rounded-full bg-[#3c2f2f]" />
        <div className="absolute left-1/2 top-8 h-20 w-16 -translate-x-1/2 rounded-[40px] bg-[#f2c7a7]" />
        <div className="absolute left-1/2 top-[92px] h-10 w-8 -translate-x-1/2 rounded-b-xl bg-[#f2c7a7]" />
        <div className="absolute bottom-0 left-1/2 h-16 w-24 -translate-x-1/2 rounded-t-[28px] bg-[#dce8f2]" />
        <div className="absolute left-5 top-16 h-2 w-2 rounded-full bg-slate-800" />
        <div className="absolute right-5 top-16 h-2 w-2 rounded-full bg-slate-800" />
        <div className="absolute left-1/2 top-[76px] h-2 w-4 -translate-x-1/2 rounded-full bg-[#e6b18b]" />
        <div className="absolute left-1/2 top-20 h-3 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-rose-500" />
        <div className="absolute left-1/2 top-[6px] h-8 w-16 -translate-x-1/2 rounded-t-full bg-[#3c2f2f]" />
      </div>
    </div>
  );
}

function BranchBoard({ branch, movements }) {
  const resultado = getResultado(branch);
  const gastoPendiente = getGastoPendiente(branch);
  const utilidad = getUtilidad(branch);
  const cobertura = getCobertura(branch);
  const semaforo = getSemaforo(cobertura);

  const metrics = [
    { label: "Primas", value: branch.primas, color: "bg-sky-500", icon: TrendingUp },
    { label: "Siniestros", value: branch.siniestros, color: "bg-amber-400", icon: TrendingDown },
    { label: "Comisiones", value: branch.comisiones, color: "bg-slate-500", icon: Coins },
    {
      label: "Resultado",
      value: resultado,
      color: resultado >= 0 ? "bg-emerald-500" : "bg-rose-500",
      icon: CircleDollarSign,
    },
  ];

  const maxVal = Math.max(...metrics.map((m) => Math.abs(m.value)), branch.gastoMeta, 1);

  return (
    <CardBox className="p-6">
      <div className={`rounded-[28px] bg-gradient-to-r ${branch.color} p-5 text-white`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-white/70">Panel de sucursal</div>
            <div className="mt-1 text-2xl font-semibold">{branch.nombre}</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <div className="text-xs text-white/70">Operatividad</div>
            <div className="mt-1 flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${semaforo.dot}`} />
              <span className="text-lg font-semibold">{cobertura}%</span>
              <span className="text-xs text-white/75">{semaforo.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-6">
        <StatCard label="Primas" value={formatMoney(branch.primas)} accent="text-sky-700" />
        <StatCard label="Siniestros" value={formatMoney(branch.siniestros)} accent="text-amber-700" />
        <StatCard label="Comisiones" value={formatMoney(branch.comisiones)} accent="text-slate-700" />
        <StatCard label="Gasto meta" value={formatMoney(branch.gastoMeta)} accent="text-slate-700" />
        <StatCard
          label="Gasto pendiente"
          value={formatMoney(gastoPendiente)}
          accent={gastoPendiente > 0 ? "text-slate-700" : "text-emerald-700"}
        />
        <StatCard
          label="Utilidad"
          value={formatMoney(utilidad)}
          accent={utilidad >= 0 ? "text-emerald-700" : "text-rose-700"}
        />
      </div>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Avance para cubrir el gasto meta</span>
          <span className="font-semibold text-slate-900">{cobertura}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cobertura}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${semaforo.dot}`}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <BarChart3 className="h-4 w-4" />
            Comportamiento del tablero
          </div>

          <div className="space-y-4">
            {metrics.map((metric) => {
              const percentage = Math.max(4, Math.round((Math.abs(metric.value) / maxVal) * 100));
              const Icon = metric.icon;

              return (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Icon className="h-4 w-4" />
                      {metric.label}
                    </div>
                    <div className="font-semibold text-slate-900">{formatMoney(metric.value)}</div>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${metric.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Bell className="h-4 w-4" />
            Movimientos recientes
          </div>

          <div className="space-y-3">
            {movements.length ? (
              movements.slice(0, 4).map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="text-sm font-semibold text-slate-900">{m.cliente}</div>
                  <div className="mt-1 text-xs text-slate-500">Entró por {m.intermediario}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <BadgePill className="bg-sky-100 text-sky-700">+{formatMoney(m.prima)}</BadgePill>
                    <BadgePill className="bg-amber-100 text-amber-700">+{formatMoney(m.siniestro)}</BadgePill>
                    <BadgePill className="bg-slate-200 text-slate-700">+{formatMoney(m.comision)}</BadgePill>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                Todavía no hay clientes captados para esta sucursal.
              </div>
            )}
          </div>
        </div>
      </div>
    </CardBox>
  );
}

function IntermediaryCard({ intermediary, selected, onClick }) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <div
        onClick={onClick}
        className={`cursor-pointer rounded-[28px] border p-5 transition-all ${
          selected
            ? "border-slate-900 bg-slate-50 shadow-md ring-1 ring-slate-900"
            : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
        }`}
      >
        <div className="mb-4 flex items-start gap-4">
          <AvatarBubble
            text={intermediary.avatar}
            bg={intermediary.sucursal === "bogota" ? "bg-slate-800" : "bg-slate-700"}
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{intermediary.nombre}</h3>
              <BadgePill className="border border-slate-300 bg-white text-slate-700">
                {intermediary.antiguedad} años
              </BadgePill>
            </div>
            <p className="mt-1 text-sm text-slate-500">{intermediary.perfil}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {intermediary.lineas.map((linea) => (
            <BadgePill key={linea} className="bg-slate-900 text-white">
              {linea}
            </BadgePill>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Relación" value={intermediary.relacion} />
          <StatCard label="Cierre" value={intermediary.cierre} />
          <StatCard label="Técnica" value={intermediary.tecnica} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {intermediary.fortalezas.map((f) => (
            <BadgePill key={f} className="border border-slate-300 bg-white text-slate-700">
              {f}
            </BadgePill>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ClientDeckCard({
  client,
  revealed,
  selected,
  onReveal,
  onHide,
  onSelect,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <ClientVisual visual={client.visual} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold text-slate-900">{client.nombre}</h3>
              <BadgePill className="border border-slate-300 bg-white text-slate-700">
                {client.tipo}
              </BadgePill>
            </div>

            <p className="mt-2 text-base font-medium text-slate-700">{client.necesidad}</p>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="text-sm font-semibold text-slate-800">Contexto del caso</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{client.contexto}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {!revealed ? (
                <button
                  onClick={onReveal}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Revelar detalles
                  </span>
                </button>
              ) : (
                <button
                  onClick={onHide}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Ocultar detalles
                  </span>
                </button>
              )}

              {revealed && (
                <button
                  onClick={onSelect}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                    selected
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {selected ? "Cliente seleccionado" : "Seleccionar cliente"}
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, rotateX: -8, y: 10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-5"
            >
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatCard label="Línea" value={client.linea} />
                <StatCard label="Prima" value={formatMoney(client.prima)} />
                <StatCard label="Siniestro" value={formatMoney(client.siniestro)} />
                <StatCard label="Comisión" value={formatMoney(client.comision)} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <BadgePill className={`border ${riskClasses(client.riesgo)}`}>{client.riesgo}</BadgePill>
                <BadgePill className="bg-slate-200 text-slate-700">{client.tag}</BadgePill>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
        {children}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Seguir jugando
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("inicio");
  const [gameTab, setGameTab] = useState("panel");
  const [branches, setBranches] = useState(branchSeeds);
  const [intermediaries] = useState(intermediarySeeds);
  const [clients, setClients] = useState(clientSeeds);
  const [selectedBranch, setSelectedBranch] = useState("bogota");
  const [selectedIntermediary, setSelectedIntermediary] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([
    { id: 1, text: "Bienvenida. El juego está listo para iniciar.", tone: "info" },
  ]);
  const [openSummary, setOpenSummary] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [clientRevealed, setClientRevealed] = useState(false);

  useEffect(() => {
    if (selectedIntermediary && selectedIntermediary.sucursal !== selectedBranch) {
      setSelectedIntermediary(null);
    }
  }, [selectedBranch, selectedIntermediary]);

  useEffect(() => {
    if (currentClientIndex > clients.length - 1) {
      setCurrentClientIndex(Math.max(0, clients.length - 1));
    }
  }, [clients.length, currentClientIndex]);

  useEffect(() => {
    if (selectedClient) {
      const stillExists = clients.some((c) => c.id === selectedClient.id);
      if (!stillExists) setSelectedClient(null);
    }
  }, [clients, selectedClient]);

  const currentBranch = branches.find((b) => b.id === selectedBranch);
  const branchIntermediaries = useMemo(
    () => intermediaries.filter((i) => i.sucursal === selectedBranch),
    [intermediaries, selectedBranch]
  );
  const currentClient = clients[currentClientIndex] || null;

  const pushAlert = (text, tone = "info") => {
    const newAlert = { id: Date.now() + Math.random(), text, tone };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 8));
  };

  const assignClient = () => {
    if (!selectedClient || !selectedIntermediary) return;

    const move = {
      id: Date.now(),
      sucursal: selectedBranch,
      cliente: selectedClient.nombre,
      intermediario: selectedIntermediary.nombre,
      prima: selectedClient.prima,
      siniestro: selectedClient.siniestro,
      comision: selectedClient.comision,
      linea: selectedClient.linea,
      fit: fitScore(selectedClient, selectedIntermediary),
    };

    setBranches((prev) =>
      prev.map((b) =>
        b.id === selectedBranch
          ? {
              ...b,
              primas: round2(b.primas + selectedClient.prima),
              siniestros: round2(b.siniestros + selectedClient.siniestro),
              comisiones: round2(b.comisiones + selectedClient.comision),
            }
          : b
      )
    );

    setHistory((prev) => [move, ...prev]);
    setLastMove(move);
    pushAlert(`Nuevo cliente asignado: ${selectedClient.nombre} entró por ${selectedIntermediary.nombre}.`, "success");

    const updatedBranch = {
      ...currentBranch,
      primas: round2(currentBranch.primas + selectedClient.prima),
      siniestros: round2(currentBranch.siniestros + selectedClient.siniestro),
      comisiones: round2(currentBranch.comisiones + selectedClient.comision),
    };

    const cobertura = getCobertura(updatedBranch);
    const sem = getSemaforo(cobertura);
    pushAlert(
      `Operatividad de ${currentBranch.nombre}: ${cobertura}% (${sem.label}).`,
      sem.label === "Verde" ? "success" : sem.label === "Amarillo" ? "warning" : "danger"
    );

    setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
    setSelectedClient(null);
    setClientRevealed(false);
    setCurrentClientIndex(0);
    setOpenSummary(true);
    setGameTab("panel");
  };

  const nextClient = () => {
    if (!clients.length) return;
    setCurrentClientIndex((prev) => (prev + 1) % clients.length);
    setClientRevealed(false);
    setSelectedClient(null);
  };

  const facilitatorRows = branches.map((b) => {
    const resultado = getResultado(b);
    const gastoPendiente = getGastoPendiente(b);
    const utilidad = getUtilidad(b);
    const cobertura = getCobertura(b);
    const captados = history.filter((h) => h.sucursal === b.id).length;
    return { ...b, resultado, gastoPendiente, utilidad, cobertura, captados };
  });

  const ranking = [...facilitatorRows].sort((a, b) => b.utilidad - a.utilidad);

  const topIntermediary = useMemo(() => {
    if (!history.length) return null;
    const byName = {};
    history.forEach((h) => {
      if (!byName[h.intermediario]) byName[h.intermediario] = { nombre: h.intermediario, clientes: 0, fit: 0 };
      byName[h.intermediario].clientes += 1;
      byName[h.intermediario].fit += h.fit;
    });
    return Object.values(byName).sort((a, b) => b.fit - a.fit || b.clientes - a.clientes)[0];
  }, [history]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3">
              <LogoHeader />
            </div>
            <p className="text-sm text-slate-500">
              Sucursales, intermediarios y clientes en una experiencia visual y estratégica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PanelButton active={screen === "inicio"} icon={LayoutDashboard} onClick={() => setScreen("inicio")}>Inicio</PanelButton>
            <PanelButton active={screen === "reglas"} icon={ListChecks} onClick={() => setScreen("reglas")}>Reglas</PanelButton>
            <PanelButton active={screen === "juego"} icon={PlayCircle} onClick={() => setScreen("juego")}>Juego</PanelButton>
            <PanelButton active={screen === "facilitador"} icon={Gauge} onClick={() => setScreen("facilitador")}>Facilitador</PanelButton>
            <PanelButton active={screen === "final"} icon={Trophy} onClick={() => setScreen("final")}>Ranking final</PanelButton>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screen === "inicio" && (
            <motion.div key="inicio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <CardBox className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-md">
                  <BadgePill className="mb-4 bg-white/10 text-white">Entorno corporativo</BadgePill>
                  <h2 className="max-w-2xl text-4xl font-semibold leading-tight">
                    Cada decisión comercial impacta el desempeño de la sucursal en tiempo real.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm text-slate-200">
                    Los intermediarios pertenecen a una sucursal, los clientes llegan uno por uno y el resultado final se mide en cobertura del gasto meta, utilidad y capacidad comercial.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setScreen("juego")}
                      className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                    >
                      <span className="inline-flex items-center gap-2">
                        Empezar
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </button>
                    <button
                      onClick={() => setScreen("reglas")}
                      className="rounded-2xl border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                    >
                      Ver dinámica
                    </button>
                  </div>
                </CardBox>

                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Roles del juego</h3>
                  <p className="mt-1 text-sm text-slate-500">Cada rol vive una experiencia distinta.</p>

                  <div className="mt-4 space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="mb-1 font-semibold">Sucursal</div>
                      <p className="text-sm text-slate-600">Arranca en cero y debe ir cubriendo un gasto meta de 500 millones.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="mb-1 font-semibold">Intermediario</div>
                      <p className="text-sm text-slate-600">Tiene fortalezas, se muestra en que líneas de negocio tiene idoneidad y contexto comercial.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="mb-1 font-semibold">Cliente</div>
                      <p className="text-sm text-slate-600"> Un contexto sobre cada uno de ellos.</p>
                    </div>
                  </div>
                </CardBox>
              </div>
            </motion.div>
          )}

          {screen === "reglas" && (
            <motion.div key="reglas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <CardBox className="p-6">
                <h3 className="text-xl font-semibold">Cómo funciona la dinámica</h3>
                <p className="mt-1 text-sm text-slate-500">Versión base para probar la experiencia mientras llegan los datos reales.</p>

                <div className="mt-4 space-y-4">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardBox>

              <CardBox className="p-6">
                <h3 className="text-xl font-semibold">Elementos destacados</h3>
                <p className="mt-1 text-sm text-slate-500">Lo que estructura la experiencia.</p>

                <div className="mt-4 space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-1 font-semibold">Panel del facilitador</div>
                    <p className="text-sm text-slate-600">Permite seguir el desempeño de ambas sucursales en una sola pantalla.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-1 font-semibold">Dos vistas dentro del juego</div>
                    <p className="text-sm text-slate-600">Una para panel sucursal y otra para asignación comercial con intermediarios y clientes al tiempo.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-1 font-semibold">Cartas revelables</div>
                    <p className="text-sm text-slate-600">El caso se ve primero y las cifras se revelan después. Luego puedes seleccionar el cliente.</p>
                  </div>
                </div>
              </CardBox>
            </motion.div>
          )}

          {screen === "juego" && (
            <motion.div key="juego" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <PanelButton active={gameTab === "panel"} icon={Building2} onClick={() => setGameTab("panel")}>
                  Panel sucursal
                </PanelButton>
                <PanelButton active={gameTab === "asignacion"} icon={Users} onClick={() => setGameTab("asignacion")}>
                  Asignación comercial
                </PanelButton>
              </div>

              {gameTab === "panel" && (
                <div className="space-y-6">
                  <SectionHeader title="Panel de sucursal" subtitle="Aquí solo se visualiza el resultado de la sucursal." icon={Building2} />

                  <div className="mb-4 flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <PanelButton
                        key={branch.id}
                        active={selectedBranch === branch.id}
                        icon={Building2}
                        onClick={() => setSelectedBranch(branch.id)}
                      >
                        {branch.nombre}
                      </PanelButton>
                    ))}
                  </div>

                  <BranchBoard branch={currentBranch} movements={history.filter((h) => h.sucursal === selectedBranch)} />
                </div>
              )}

              {gameTab === "asignacion" && (
                <div className="space-y-6">
                  <SectionHeader
                    title="Asignación comercial"
                    subtitle="Selecciona la sucursal, el intermediario y el cliente en una sola vista."
                    icon={Users}
                  />

                  <CardBox className="p-6">
                    <h3 className="text-xl font-semibold">Mesa de asignación</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Primero define lo que vas a asignar y luego haz la selección.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
                        <div className="font-semibold text-slate-900">Sucursal elegida</div>
                        <div className="mt-1 text-slate-600">{currentBranch?.nombre}</div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
                        <div className="font-semibold text-slate-900">Intermediario elegido</div>
                        <div className="mt-1 text-slate-600">
                          {selectedIntermediary ? selectedIntermediary.nombre : "Sin seleccionar"}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
                        <div className="font-semibold text-slate-900">Cliente elegido</div>
                        <div className="mt-1 text-slate-600">
                          {selectedClient ? selectedClient.nombre : "Sin seleccionar"}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-900 p-4 text-white">
                        <div className="text-sm text-white/70">Estado</div>
                        <div className="mt-1 text-lg font-semibold">
                          {selectedIntermediary && selectedClient ? "Listo para asignar" : "Completa la selección"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {branches.map((branch) => (
                        <PanelButton
                          key={branch.id}
                          active={selectedBranch === branch.id}
                          icon={Building2}
                          onClick={() => setSelectedBranch(branch.id)}
                        >
                          {branch.nombre}
                        </PanelButton>
                      ))}

                      <button
                        onClick={assignClient}
                        disabled={!selectedClient || !selectedIntermediary}
                        className={`rounded-2xl px-4 py-2 text-sm font-medium text-white ${
                          !selectedClient || !selectedIntermediary
                            ? "cursor-not-allowed bg-slate-400"
                            : "bg-slate-900 hover:bg-slate-800"
                        }`}
                      >
                        Llevar a sucursal
                      </button>
                    </div>
                  </CardBox>

                  <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <CardBox className="p-6">
                      <h3 className="flex items-center gap-2 text-xl font-semibold">
                        <Users className="h-5 w-5" />
                        Intermediarios
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Elige el intermediario que tomará el caso.
                      </p>

                      <div className="mt-4 space-y-4">
                        {branchIntermediaries.map((intermediary) => (
                          <IntermediaryCard
                            key={intermediary.id}
                            intermediary={intermediary}
                            selected={selectedIntermediary?.id === intermediary.id}
                            onClick={() => setSelectedIntermediary(intermediary)}
                          />
                        ))}
                      </div>
                    </CardBox>

                    <div className="space-y-6">
                      <CardBox className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="flex items-center gap-2 text-xl font-semibold">
                              <Briefcase className="h-5 w-5" />
                              Cliente actual
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              El cliente expone su caso y luego se revelan los detalles.
                            </p>
                          </div>

                          <button
                            onClick={nextClient}
                            disabled={!clients.length}
                            className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                              !clients.length
                                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <RotateCcw className="h-4 w-4" />
                              Siguiente cliente
                            </span>
                          </button>
                        </div>

                        <div className="mt-4">
                          {currentClient ? (
                            <ClientDeckCard
                              client={currentClient}
                              revealed={clientRevealed}
                              selected={selectedClient?.id === currentClient.id}
                              onReveal={() => setClientRevealed(true)}
                              onHide={() => {
                                setClientRevealed(false);
                                setSelectedClient(null);
                              }}
                              onSelect={() => setSelectedClient(currentClient)}
                            />
                          ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                              Ya no quedan clientes en el mazo.
                            </div>
                          )}
                        </div>
                      </CardBox>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {screen === "facilitador" && (
            <motion.div key="facilitador" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <SectionHeader title="Panel del facilitador" subtitle="Control general del juego en una sola vista." icon={Gauge} />

              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Comparativo entre sucursales</h3>
                  <p className="mt-1 text-sm text-slate-500">Resumen financiero y operativo en vivo.</p>

                  <div className="mt-4 space-y-4">
                    {facilitatorRows.map((row) => {
                      const semaforo = getSemaforo(row.cobertura);
                      return (
                        <div key={row.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="font-semibold text-slate-900">{row.nombre}</div>
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${semaforo.dot}`} />
                              <span className={`text-sm font-semibold ${semaforo.text}`}>{row.cobertura}%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            <StatCard label="Primas" value={formatMoney(row.primas)} />
                            <StatCard label="Siniestros" value={formatMoney(row.siniestros)} />
                            <StatCard label="Comisiones" value={formatMoney(row.comisiones)} />
                            <StatCard label="Pendiente" value={formatMoney(row.gastoPendiente)} accent={row.gastoPendiente > 0 ? "text-slate-700" : "text-emerald-700"} />
                            <StatCard label="Clientes" value={row.captados} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBox>

                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Alertas del juego</h3>
                  <p className="mt-1 text-sm text-slate-500">Cambios y novedades en tiempo real.</p>

                  <div className="mt-4 space-y-3">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className={`rounded-2xl p-4 text-sm ${
                          a.tone === "success"
                            ? "bg-emerald-50 text-emerald-800"
                            : a.tone === "warning"
                            ? "bg-amber-50 text-amber-800"
                            : a.tone === "danger"
                            ? "bg-rose-50 text-rose-800"
                            : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {a.text}
                      </div>
                    ))}
                  </div>
                </CardBox>
              </div>

              <CardBox className="p-6">
                <h3 className="text-xl font-semibold">Historial de movimientos</h3>
                <p className="mt-1 text-sm text-slate-500">Quién captó a quién y por medio de qué intermediario.</p>

                <div className="mt-4 space-y-3">
                  {history.length ? (
                    history.map((h) => (
                      <div key={h.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {h.cliente} entró a {branches.find((b) => b.id === h.sucursal)?.nombre}
                            </div>
                            <div className="text-sm text-slate-500">
                              Intermediario {h.intermediario} · Línea {h.linea}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <BadgePill className="bg-slate-900 text-white">Fit {h.fit}</BadgePill>
                            <BadgePill className="border border-slate-300 bg-white text-slate-700">
                              Prima {formatMoney(h.prima)}
                            </BadgePill>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                      Aún no hay movimientos registrados.
                    </div>
                  )}
                </div>
              </CardBox>
            </motion.div>
          )}

          {screen === "final" && (
            <motion.div key="final" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <SectionHeader title="Ranking final" subtitle="Cierre del juego con los indicadores más importantes." icon={Trophy} />

              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Podio de sucursales</h3>
                  <p className="mt-1 text-sm text-slate-500">Se ordena por utilidad final.</p>

                  <div className="mt-4 space-y-3">
                    {ranking.map((r, idx) => (
                      <div
                        key={r.id}
                        className={`flex items-center justify-between rounded-3xl border p-4 ${
                          idx === 0
                            ? "border-amber-200 bg-amber-50"
                            : "border-slate-200 bg-slate-50/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{r.nombre}</div>
                            <div className="text-xs text-slate-500">Operatividad {r.cobertura}%</div>
                          </div>
                        </div>
                        <BadgePill className="bg-slate-900 text-white">{formatMoney(r.utilidad)}</BadgePill>
                      </div>
                    ))}
                  </div>
                </CardBox>

                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Reconocimientos</h3>
                  <p className="mt-1 text-sm text-slate-500">Una forma más sobria de cerrar el taller.</p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <Crown className="h-4 w-4" />
                        Sucursal ganadora
                      </div>
                      <div className="text-2xl font-semibold text-slate-900">{ranking[0]?.nombre || "-"}</div>
                      <div className="mt-1 text-sm text-slate-500">Mayor utilidad final del juego.</div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <Star className="h-4 w-4" />
                        Intermediario destacado
                      </div>
                      <div className="text-2xl font-semibold text-slate-900">{topIntermediary?.nombre || "-"}</div>
                      <div className="mt-1 text-sm text-slate-500">Mayor acumulado de afinidad.</div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Clientes captados
                      </div>
                      <div className="text-2xl font-semibold text-slate-900">{history.length}</div>
                      <div className="mt-1 text-sm text-slate-500">Total de movimientos realizados.</div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <PartyPopper className="h-4 w-4" />
                        Mejor jugada reciente
                      </div>
                      <div className="text-lg font-semibold text-slate-900">{history[0]?.cliente || "-"}</div>
                      <div className="mt-1 text-sm text-slate-500">Último cliente captado registrado.</div>
                    </div>
                  </div>
                </CardBox>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={openSummary} onClose={() => setOpenSummary(false)}>
        <h3 className="text-xl font-semibold">Movimiento registrado</h3>
        <p className="mt-1 text-sm text-slate-500">La sucursal acaba de actualizar su tablero.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-xs text-slate-500">Cliente</div>
            <div className="font-semibold">{lastMove?.cliente || "-"}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-xs text-slate-500">Intermediario</div>
            <div className="font-semibold">{lastMove?.intermediario || "-"}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-xs text-slate-500">Prima</div>
            <div className="font-semibold">{lastMove ? formatMoney(lastMove.prima) : "-"}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-xs text-slate-500">Sucursal</div>
            <div className="font-semibold">{currentBranch?.nombre || "-"}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}