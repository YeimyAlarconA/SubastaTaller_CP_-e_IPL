import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ListChecks,
  PlayCircle,
  Gauge,
  Trophy,
  Building2,
  Users,
  Briefcase,
  Bell,
  Crown,
  Star,
  CheckCircle2,
  PartyPopper,
  Coins,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  ChevronRight,
  Copy,
  LogOut,
  UserRound,
  Building,
  ShieldCheck,
  Clock3,
  TriangleAlert,
  Check,
} from "lucide-react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { seedClients } from "./seedClients";

const GASTO_META = 500;
const STORAGE_KEY = "subasta_mvp_session";

const COLORS = {
  orange: "#EE7623",
  blue: "#1E3663",
  blueDark: "#002977",
  white: "#FFFFFF",
  bg: "#F5F7FB",
  softBlue: "#EEF3FB",
  border: "#D9E1F0",
  textSoft: "#6B7280",
};

const INTERMEDIARY_PROFILES = [
  {
    id: "juan_perez",
    displayName: "Juan Pérez",
    branchId: "bogota",
    idoneidad: ["Fianzas", "Generales"],
    antiguedad: "6 años",
  },
  {
    id: "laura_gomez",
    displayName: "Laura Gómez",
    branchId: "bogota",
    idoneidad: ["Autos", "Vida"],
    antiguedad: "4 años",
  },
  {
    id: "natalia_ruiz",
    displayName: "Natalia Ruiz",
    branchId: "medellin",
    idoneidad: ["Autos", "Fianzas"],
    antiguedad: "8 años",
  },
  {
    id: "camilo_torres",
    displayName: "Camilo Torres",
    branchId: "medellin",
    idoneidad: ["Vida", "Generales"],
    antiguedad: "5 años",
  },
];

function round2(n) {
  return Math.round(n * 100) / 100;
}

function makeBranches() {
  return {
    bogota: {
      id: "bogota",
      name: "Sucursal Bogotá",
      primas: 0,
      siniestros: 0,
      comisiones: 0,
      gastoMeta: GASTO_META,
    },
    medellin: {
      id: "medellin",
      name: "Sucursal Medellín",
      primas: 0,
      siniestros: 0,
      comisiones: 0,
      gastoMeta: GASTO_META,
    },
  };
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
  if (!branch?.gastoMeta) return 0;
  return Math.min(100, round2((getResultado(branch) / branch.gastoMeta) * 100));
}

function getSemaforo(cobertura) {
  if (cobertura >= 100) {
    return { label: "Verde", dot: "bg-emerald-500", text: "text-emerald-700" };
  }
  if (cobertura >= 60) {
    return { label: "Amarillo", dot: "bg-amber-400", text: "text-amber-700" };
  }
  return { label: "Rojo", dot: "bg-rose-500", text: "text-rose-700" };
}

function riskClasses(risk) {
  if (risk === "Bajo") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (risk === "Medio") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-rose-100 text-rose-700 border-rose-200";
}

function generateCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function formatMoney(value) {
  return `$${value} M`;
}

function readPersisted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writePersisted(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearPersisted() {
  localStorage.removeItem(STORAGE_KEY);
}

function roleLabel(role, branchId = "") {
  if (role === "host") return "Host";
  if (role === "unassigned") return "Sin asignar";
  if (role === "observador") return "Observador";
  if (role === "cliente") return "Cliente";
  if (role === "sucursal") {
    return branchId === "bogota" ? "Sucursal Bogotá" : "Sucursal Medellín";
  }
  if (role === "intermediary") return "Intermediario";
  return role;
}

function roleOptionValue(role, branchId = "") {
  return `${role}|${branchId}`;
}

function getProfileById(profileId) {
  return INTERMEDIARY_PROFILES.find((p) => p.id === profileId) || null;
}

async function ensureAnonAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
}

function CardBox({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-[28px] bg-white shadow-sm border ${className}`}
      style={{ borderColor: COLORS.border, ...style }}
    >
      {children}
    </div>
  );
}

function BadgePill({ children, className = "", style = {} }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

function PanelButton({ active, icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl px-4 py-2.5 text-sm font-medium transition border"
      style={{
        backgroundColor: active ? COLORS.blueDark : COLORS.white,
        color: active ? COLORS.white : COLORS.blue,
        borderColor: active ? COLORS.blueDark : COLORS.border,
        boxShadow: active ? "0 8px 20px rgba(0,41,119,0.18)" : "none",
      }}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {children}
      </span>
    </button>
  );
}

function ActionButton({ children, onClick, disabled = false, variant = "primary", className = "" }) {
  const styles =
    variant === "orange"
      ? {
          backgroundColor: disabled ? "#f1b082" : COLORS.orange,
          color: COLORS.white,
          borderColor: disabled ? "#f1b082" : COLORS.orange,
        }
      : variant === "secondary"
      ? {
          backgroundColor: COLORS.white,
          color: COLORS.blue,
          borderColor: COLORS.border,
        }
      : {
          backgroundColor: disabled ? "#8ba0c8" : COLORS.blue,
          color: COLORS.white,
          borderColor: disabled ? "#8ba0c8" : COLORS.blue,
        };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${className}`}
      style={{
        ...styles,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, accent = COLORS.blue }) {
  return (
    <div
      className="rounded-3xl p-4 border"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
    >
      <div className="text-[11px] uppercase tracking-wide" style={{ color: COLORS.textSoft }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div
          className="rounded-2xl p-2 text-white"
          style={{ backgroundColor: COLORS.blue }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-xl font-semibold" style={{ color: COLORS.blue }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>{subtitle}</p>}
    </div>
  );
}

function LogoHeader() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
        style={{ backgroundColor: COLORS.blueDark }}
      >
        <Building2 className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.textSoft }}>
          Estado
        </div>
        <div className="text-2xl font-semibold" style={{ color: COLORS.blue }}>
          Subasta Interactiva
        </div>
      </div>
    </div>
  );
}

function ClientVisual({ visual }) {
  if (visual === "empresa") {
    return (
      <div
        className="flex h-44 items-center justify-center rounded-[28px] border"
        style={{ borderColor: COLORS.border, background: "linear-gradient(135deg, #fff8f2, #eef3fb)" }}
      >
        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-[28px] shadow-lg text-white"
          style={{ backgroundColor: COLORS.blue }}
        >
          <Building className="h-12 w-12" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-44 items-center justify-center rounded-[28px] border"
      style={{ borderColor: COLORS.border, background: "linear-gradient(135deg, #fff8f2, #eef3fb)" }}
    >
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full shadow-lg text-white"
        style={{ backgroundColor: COLORS.orange }}
      >
        <UserRound className="h-12 w-12" />
      </div>
    </div>
  );
}

function ClientTypeBadge({ type }) {
  const isCompany = type === "Empresa";
  return (
    <BadgePill
      style={{
        backgroundColor: isCompany ? "#E7F0FF" : "#FFF2E8",
        color: isCompany ? COLORS.blueDark : COLORS.orange,
      }}
    >
      <span className="inline-flex items-center gap-1">
        {isCompany ? <Building className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
        {type}
      </span>
    </BadgePill>
  );
}

function BranchBoard({ branch, movements, alerts = [] }) {
  if (!branch) return null;

  const resultado = getResultado(branch);
  const gastoPendiente = getGastoPendiente(branch);
  const utilidad = getUtilidad(branch);
  const cobertura = getCobertura(branch);
  const semaforo = getSemaforo(cobertura);

  const metrics = [
    { label: "Primas", value: branch.primas, color: COLORS.blue, icon: TrendingUp },
    { label: "Siniestros", value: branch.siniestros, color: "#D97706", icon: TrendingDown },
    { label: "Comisiones", value: branch.comisiones, color: COLORS.orange, icon: Coins },
    {
      label: "Resultado",
      value: resultado,
      color: resultado >= 0 ? "#059669" : "#DC2626",
      icon: CircleDollarSign,
    },
  ];

  const maxVal = Math.max(...metrics.map((m) => Math.abs(m.value)), branch.gastoMeta, 1);

  return (
    <CardBox className="p-6">
      <div
        className="rounded-[28px] p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${COLORS.blueDark}, ${COLORS.blue})` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-white/75">Panel de sucursal</div>
            <div className="mt-1 text-2xl font-semibold">{branch.name}</div>
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
        <StatCard label="Primas" value={formatMoney(branch.primas)} accent={COLORS.blue} />
        <StatCard label="Siniestros" value={formatMoney(branch.siniestros)} accent="#B45309" />
        <StatCard label="Comisiones" value={formatMoney(branch.comisiones)} accent={COLORS.orange} />
        <StatCard label="Gasto meta" value={formatMoney(branch.gastoMeta)} accent={COLORS.blueDark} />
        <StatCard label="Gasto pendiente" value={formatMoney(getGastoPendiente(branch))} accent={gastoPendiente > 0 ? COLORS.blueDark : "#059669"} />
        <StatCard label="Utilidad" value={formatMoney(utilidad)} accent={utilidad >= 0 ? "#059669" : "#DC2626"} />
      </div>

      <div className="mt-4 rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
        <div className="mb-2 flex items-center justify-between text-sm" style={{ color: COLORS.textSoft }}>
          <span>Avance para cubrir el gasto meta</span>
          <span className="font-semibold" style={{ color: COLORS.blueDark }}>{cobertura}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cobertura}%` }}
            transition={{ duration: 0.4 }}
            className={`h-full rounded-full ${semaforo.dot}`}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.blue }}>
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
                    <div className="flex items-center gap-2" style={{ color: COLORS.blue }}>
                      <Icon className="h-4 w-4" />
                      {metric.label}
                    </div>
                    <div className="font-semibold" style={{ color: COLORS.blueDark }}>
                      {formatMoney(metric.value)}
                    </div>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.4 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.blue }}>
            <Bell className="h-4 w-4" />
            Novedades
          </div>

          <div className="space-y-3">
            {alerts.length > 0 &&
              alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border p-3"
                  style={{ borderColor: "#FFD7BA", backgroundColor: "#FFF7F1" }}
                >
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="mt-0.5 h-4 w-4" style={{ color: COLORS.orange }} />
                    <div className="text-sm" style={{ color: COLORS.orange }}>
                      {alert.message}
                    </div>
                  </div>
                </div>
              ))}

            {movements.length ? (
              movements.slice(0, 3).map((m) => (
                <div key={m.id} className="rounded-2xl border bg-white p-3" style={{ borderColor: COLORS.border }}>
                  <div className="text-sm font-semibold" style={{ color: COLORS.blueDark }}>{m.clientName}</div>
                  <div className="mt-1 text-xs" style={{ color: COLORS.textSoft }}>Entró por {m.playerName}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <BadgePill style={{ backgroundColor: "#E7F0FF", color: COLORS.blue }}>+{formatMoney(m.premium)}</BadgePill>
                    <BadgePill style={{ backgroundColor: "#FFF2E8", color: COLORS.orange }}>+{formatMoney(m.claims)}</BadgePill>
                  </div>
                </div>
              ))
            ) : alerts.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm" style={{ borderColor: COLORS.border, color: COLORS.textSoft }}>
                Todavía no hay novedades para esta sucursal.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </CardBox>
  );
}

function JoinPage({ onCreateHost, onJoinPlayer, busy }) {
  const [mode, setMode] = useState("player");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (!name.trim()) {
        setError("Escribe tu nombre.");
        return;
      }
      if (mode === "player" && !code.trim()) {
        setError("Escribe el código.");
        return;
      }

      if (mode === "host") {
        await onCreateHost(name.trim());
      } else {
        await onJoinPlayer(name.trim(), code.trim().toUpperCase());
      }
    } catch (e) {
      setError(e.message || "No fue posible entrar.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div
        className="rounded-[28px] p-8 text-white shadow-md border"
        style={{
          background: `linear-gradient(135deg, ${COLORS.blueDark}, ${COLORS.blue})`,
          borderColor: COLORS.blue,
        }}
      >
        <BadgePill style={{ backgroundColor: "rgba(255,255,255,0.14)", color: COLORS.white }}>
          MVP multiusuario
        </BadgePill>
        <h2 className="mt-4 text-4xl font-semibold leading-tight">
          Cada jugador entra desde su propio dispositivo y el host controla la partida en vivo.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-100">
          Esta versión ya separa host, sucursal, intermediario, cliente y observador.
        </p>
      </div>

      <CardBox className="p-6">
        <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>Entrar</h3>
        <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
          Elige si vas a entrar como host o como jugador.
        </p>

        <div className="mt-4 flex gap-2">
          <PanelButton active={mode === "player"} icon={Users} onClick={() => setMode("player")}>
            Jugador
          </PanelButton>
          <PanelButton active={mode === "host"} icon={Gauge} onClick={() => setMode("host")}>
            Host
          </PanelButton>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: COLORS.blue }}>
              Nombre
            </label>
            <input
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: COLORS.border }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          {mode === "player" && (
            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: COLORS.blue }}>
                Código de partida
              </label>
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm uppercase outline-none"
                style={{ borderColor: COLORS.border }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ABCDE"
              />
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-3 text-sm" style={{ backgroundColor: "#FFF2E8", color: COLORS.orange }}>
              {error}
            </div>
          )}

          <ActionButton onClick={handleSubmit} disabled={busy} variant="orange" className="w-full">
            {busy ? "Procesando..." : mode === "host" ? "Crear partida" : "Entrar a la partida"}
          </ActionButton>
        </div>
      </CardBox>
    </div>
  );
}

function WaitingPage({ player }) {
  return (
    <CardBox className="p-8 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: COLORS.orange }}
      >
        <Users className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-2xl font-semibold" style={{ color: COLORS.blue }}>
        Hola, {player?.name}
      </h3>
      <p className="mt-2" style={{ color: COLORS.textSoft }}>
        Entraste correctamente. Espera a que el host te asigne un rol.
      </p>
    </CardBox>
  );
}

function IntermediaryProfileCard({ profile }) {
  if (!profile) {
    return (
      <CardBox className="p-6">
        <div className="rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
          <div className="font-semibold" style={{ color: COLORS.blueDark }}>
            Esperando intermediario asignado
          </div>
          <div className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
            El host ya te asignó el rol, pero todavía no selecciona qué intermediario representas.
          </div>
        </div>
      </CardBox>
    );
  }

  return (
    <CardBox className="p-6">
      <div
        className="rounded-[28px] border p-5"
        style={{
          borderColor: COLORS.blue,
          background: "linear-gradient(135deg, #EEF3FB, #FFFFFF)",
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: COLORS.blue }}
          >
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-semibold" style={{ color: COLORS.blueDark }}>
              {profile.displayName}
            </div>
            <div className="text-sm" style={{ color: COLORS.textSoft }}>
              {profile.branchId === "bogota" ? "Sucursal Bogotá" : "Sucursal Medellín"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.blue }}>
              <Building2 className="h-4 w-4" />
              Sucursal
            </div>
            <div className="mt-2 text-sm" style={{ color: COLORS.blueDark }}>
              {profile.branchId === "bogota" ? "Bogotá" : "Medellín"}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.blue }}>
              <ShieldCheck className="h-4 w-4" />
              Idoneidad
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.idoneidad.map((line) => (
                <BadgePill key={line} style={{ backgroundColor: "#E7F0FF", color: COLORS.blueDark }}>
                  {line}
                </BadgePill>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.blue }}>
              <Clock3 className="h-4 w-4" />
              Antigüedad
            </div>
            <div className="mt-2 text-sm" style={{ color: COLORS.blueDark }}>
              {profile.antiguedad}
            </div>
          </div>
        </div>
      </div>
    </CardBox>
  );
}

function ClientDataBlock({ client }) {
  if (!client) return null;

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Línea" value={client.line} />
        <StatCard label="Prima" value={formatMoney(client.premium)} accent={COLORS.blue} />
        <StatCard label="Siniestro" value={formatMoney(client.claims)} accent="#B45309" />
        <StatCard label="Comisión" value={formatMoney(client.commission)} accent={COLORS.orange} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <BadgePill className={`border ${riskClasses(client.risk)}`}>{client.risk}</BadgePill>
        <BadgePill style={{ backgroundColor: "#FFF2E8", color: COLORS.orange }}>{client.tag}</BadgePill>
      </div>
    </div>
  );
}

function AssignedClientPanel({ assignedClient, session, player, onChooseApplicant }) {
  const currentClient = session?.currentClient || null;
  const isCurrent = currentClient?.id === assignedClient?.id;
  const applicants = isCurrent ? currentClient?.applicants || [] : [];
  const status = isCurrent ? currentClient?.status || "activo" : "pendiente";

  if (!assignedClient) {
    return (
      <CardBox className="p-8 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: COLORS.orange }}
        >
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold" style={{ color: COLORS.blue }}>
          Esperando cliente asignado
        </h3>
        <p className="mt-2" style={{ color: COLORS.textSoft }}>
          El host ya te asignó el rol de cliente, pero todavía no ha seleccionado cuál cliente representas.
        </p>
      </CardBox>
    );
  }

  return (
    <CardBox className="p-6">
      <div
        className="rounded-[28px] border p-5"
        style={{
          borderColor: COLORS.orange,
          background: "linear-gradient(135deg, #FFF8F2, #EEF3FB)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: assignedClient.customerType === "Empresa" ? COLORS.blue : COLORS.orange }}
            >
              {assignedClient.customerType === "Empresa" ? (
                <Building className="h-6 w-6" />
              ) : (
                <UserRound className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="text-xl font-semibold" style={{ color: COLORS.blueDark }}>
                {assignedClient.name}
              </div>
              <div className="mt-1">
                <ClientTypeBadge type={assignedClient.customerType} />
              </div>
            </div>
          </div>

          <BadgePill
            style={{
              backgroundColor: status === "active" ? COLORS.orange : COLORS.blue,
              color: COLORS.white,
            }}
          >
            {status}
          </BadgePill>
        </div>

        <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
          <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>
            Necesidad
          </div>
          <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
            {assignedClient.need || "Sin necesidad registrada"}
          </p>
        </div>

        <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
          <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>
            Contexto del caso
          </div>
          <p className="mt-2 text-sm leading-6" style={{ color: COLORS.textSoft }}>
            {assignedClient.context || "Sin contexto registrado"}
          </p>
        </div>

        <ClientDataBlock client={assignedClient} />

        {isCurrent && applicants.length > 0 && currentClient?.status === "active" && (
          <div className="mt-6 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
            <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>
              Intermediarios que aplicaron por ti
            </div>
            <div className="mt-4 space-y-3">
              {applicants.map((app) => (
                <div
                  key={app.playerId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
                >
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.blueDark }}>
                      {app.playerName}
                    </div>
                    <div className="text-sm" style={{ color: COLORS.textSoft }}>
                      {app.branchName}
                    </div>
                  </div>

                  <ActionButton
                    onClick={() => onChooseApplicant(app)}
                    variant="orange"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Elegir intermediario
                    </span>
                  </ActionButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCurrent && applicants.length === 0 && currentClient?.status === "active" && (
          <div className="mt-6 rounded-2xl p-4 text-sm" style={{ backgroundColor: "#FFF7F1", color: COLORS.orange }}>
            Todavía no hay intermediarios aplicando por este cliente.
          </div>
        )}
      </div>
    </CardBox>
  );
}

function FacilitatorClientCard({ currentClient }) {
  if (!currentClient) {
    return (
      <CardBox className="p-8 text-center text-sm" style={{ color: COLORS.textSoft }}>
        No hay cliente activo. Usa “Siguiente cliente”.
      </CardBox>
    );
  }

  const isCompany = currentClient.customerType === "Empresa";

  return (
    <CardBox className="p-6">
      <div
        className="rounded-[28px] border p-6"
        style={{
          borderColor: COLORS.orange,
          background: "linear-gradient(135deg, #FFF7F0 0%, #EEF3FB 100%)",
        }}
      >
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex items-center justify-center">
            <div
              className="flex h-36 w-36 items-center justify-center rounded-[32px] text-white shadow-lg"
              style={{ backgroundColor: isCompany ? COLORS.blue : COLORS.orange }}
            >
              {isCompany ? <Building className="h-16 w-16" /> : <UserRound className="h-16 w-16" />}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.blueDark }}>
                {currentClient.name}
              </h3>
              <ClientTypeBadge type={currentClient.customerType} />
              <BadgePill style={{ backgroundColor: COLORS.orange, color: COLORS.white }}>
                {currentClient.status}
              </BadgePill>
            </div>

            <p className="mt-3 text-base font-medium" style={{ color: COLORS.blue }}>
              {currentClient.need}
            </p>

            <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
              <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>
                Contexto del caso
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: COLORS.textSoft }}>
                {currentClient.context}
              </p>
            </div>

            <ClientDataBlock client={currentClient} />

            {currentClient?.applicants?.length > 0 && currentClient.status === "active" && (
              <div className="mt-5 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>
                  Intermediarios aplicando
                </div>
                <div className="mt-3 space-y-2">
                  {currentClient.applicants.map((app) => (
                    <div
                      key={app.playerId}
                      className="rounded-2xl border p-3"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
                    >
                      <div className="font-semibold" style={{ color: COLORS.blueDark }}>{app.playerName}</div>
                      <div className="text-sm" style={{ color: COLORS.textSoft }}>{app.branchName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentClient.takenBy && (
              <div
                className="mt-5 rounded-2xl p-4 text-sm"
                style={{ backgroundColor: "#E8F6EE", color: "#047857" }}
              >
                Elegido: <span className="font-semibold">{currentClient.takenBy.playerName}</span> ·{" "}
                {currentClient.takenBy.branchName}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardBox>
  );
}

function GameSetupPage({
  session,
  players,
  onAssignRole,
  onCloseSession,
  onGoFacilitator,
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel de juego"
        subtitle="Aquí preparas la partida y asignas los roles."
        icon={PlayCircle}
      />

      <CardBox className="p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: COLORS.textSoft }}>
              Código de acceso
            </div>
            <div className="mt-1 flex items-center gap-3">
              <div className="text-3xl font-semibold tracking-[0.25em]" style={{ color: COLORS.blueDark }}>
                {session?.code}
              </div>
              <ActionButton onClick={() => navigator.clipboard.writeText(session?.code || "")} variant="secondary">
                <span className="inline-flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar
                </span>
              </ActionButton>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <ActionButton onClick={onGoFacilitator} variant="orange">
              Ir a facilitador
            </ActionButton>
            <ActionButton onClick={onCloseSession} variant="secondary">
              Cerrar sesión local
            </ActionButton>
          </div>
        </div>
      </CardBox>

      <CardBox className="p-6">
        <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>
          Jugadores conectados
        </h3>
        <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
          Asigna rol y perfil del personaje.
        </p>

        <div className="mt-4 space-y-4">
          {players.length ? (
            players.map((player) => (
              <div
                key={player.id}
                className="rounded-3xl border p-4"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_220px_300px]">
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.blueDark }}>
                      {player.name}
                    </div>
                    <div className="text-sm" style={{ color: COLORS.textSoft }}>
                      {roleLabel(player.role, player.branchId)}
                    </div>
                  </div>

                  <select
                    className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none"
                    style={{ borderColor: COLORS.border }}
                    value={roleOptionValue(player.role || "unassigned", player.branchId || "")}
                    onChange={(e) => {
                      const [role, branchId] = e.target.value.split("|");
                      onAssignRole({
                        playerId: player.id,
                        role,
                        branchId: role === "sucursal" ? (branchId || "") : "",
                        assignedClientId: role === "cliente" ? player.assignedClientId || "" : "",
                        assignedIntermediaryId: role === "intermediary" ? player.assignedIntermediaryId || "" : "",
                      });
                    }}
                  >
                    <option value="unassigned|">Sin asignar</option>
                    <option value="observador|">Observador</option>
                    <option value="cliente|">Cliente</option>
                    <option value="sucursal|bogota">Sucursal Bogotá</option>
                    <option value="sucursal|medellin">Sucursal Medellín</option>
                    <option value="intermediary|">Intermediario</option>
                  </select>

                  {player.role === "cliente" ? (
                    <select
                      className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none"
                      style={{ borderColor: COLORS.border }}
                      value={player.assignedClientId || ""}
                      onChange={(e) =>
                        onAssignRole({
                          playerId: player.id,
                          role: "cliente",
                          branchId: "",
                          assignedClientId: e.target.value,
                          assignedIntermediaryId: "",
                        })
                      }
                    >
                      <option value="">Seleccionar cliente</option>
                      {seedClients.map((client) => (
                        <option key={client.id} value={String(client.id)}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  ) : player.role === "intermediary" ? (
                    <select
                      className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none"
                      style={{ borderColor: COLORS.border }}
                      value={player.assignedIntermediaryId || ""}
                      onChange={(e) =>
                        onAssignRole({
                          playerId: player.id,
                          role: "intermediary",
                          branchId: "",
                          assignedClientId: "",
                          assignedIntermediaryId: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccionar intermediario</option>
                      {INTERMEDIARY_PROFILES.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.displayName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed p-6 text-sm" style={{ borderColor: COLORS.border, color: COLORS.textSoft }}>
              Aún no han entrado jugadores.
            </div>
          )}
        </div>
      </CardBox>
    </div>
  );
}

function FacilitatorPage({ session, onPublishNextClient, onGoFinal }) {
  const currentClient = session?.currentClient || null;
  const branches = session?.branches || {};
  const alerts = session?.alerts || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel del facilitador"
        subtitle="Aquí diriges la dinámica en vivo."
        icon={Gauge}
      />

      <div className="flex flex-wrap gap-3">
        <ActionButton onClick={onPublishNextClient} variant="orange">
          Siguiente cliente
        </ActionButton>
        <ActionButton onClick={onGoFinal} variant="primary">
          Ir a ranking final
        </ActionButton>
      </div>

      <FacilitatorClientCard currentClient={currentClient} />

      {alerts.length > 0 && (
        <CardBox className="p-6">
          <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>
            Alertas IPL
          </h3>
          <div className="mt-4 space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="rounded-2xl border p-4"
                style={{ borderColor: "#FFD7BA", backgroundColor: "#FFF7F1" }}
              >
                <div className="flex items-start gap-2">
                  <TriangleAlert className="mt-0.5 h-4 w-4" style={{ color: COLORS.orange }} />
                  <div className="text-sm" style={{ color: COLORS.orange }}>
                    {alert.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBox>
      )}

      <div className="space-y-6">
        <BranchBoard
          branch={branches.bogota}
          movements={(session?.history || []).filter((m) => m.branchId === "bogota")}
          alerts={alerts.filter((a) => a.branchId === "bogota")}
        />
        <BranchBoard
          branch={branches.medellin}
          movements={(session?.history || []).filter((m) => m.branchId === "medellin")}
          alerts={alerts.filter((a) => a.branchId === "medellin")}
        />
      </div>
    </div>
  );
}

function SucursalPage({ player, session }) {
  const branch = session?.branches?.[player.branchId];
  const movements = (session?.history || []).filter((m) => m.branchId === player.branchId);
  const alerts = (session?.alerts || []).filter((a) => a.branchId === player.branchId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={roleLabel(player.role, player.branchId)}
        subtitle={`Bienvenida, ${player.name}. Aquí ves solo el tablero de tu sucursal.`}
        icon={Building2}
      />
      <BranchBoard branch={branch} movements={movements} alerts={alerts} />
    </div>
  );
}

function IntermediaryPage({ player, session, onApplyClient }) {
  const currentClient = session?.currentClient || null;
  const profile = getProfileById(player?.assignedIntermediaryId || "");
  const alerts = session?.alerts || [];
  const myLatestAlert = alerts.find((a) => a.playerId === player.id);
  const alreadyApplied = currentClient?.applicants?.some((a) => a.playerId === player.id);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel de intermediario"
        subtitle={`${player.name} · ${profile?.displayName || "Sin intermediario asignado"}`}
        icon={Users}
      />

      <IntermediaryProfileCard profile={profile} />

      {myLatestAlert && (
        <CardBox className="p-4" style={{ backgroundColor: "#FFF7F1", borderColor: "#FFD7BA" }}>
          <div className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4" style={{ color: COLORS.orange }} />
            <div className="text-sm" style={{ color: COLORS.orange }}>
              {myLatestAlert.message}
            </div>
          </div>
        </CardBox>
      )}

      {!currentClient ? (
        <CardBox className="p-8 text-center text-sm" style={{ color: COLORS.textSoft }}>
          No hay cliente activo en este momento. Espera a que el host publique uno.
        </CardBox>
      ) : (
        <CardBox className="p-6">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <ClientVisual visual={currentClient.visual} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-semibold" style={{ color: COLORS.blueDark }}>
                  {currentClient.name}
                </h3>
                <ClientTypeBadge type={currentClient.customerType} />
                <BadgePill style={{ backgroundColor: COLORS.orange, color: COLORS.white }}>
                  {currentClient.status}
                </BadgePill>
              </div>

              <p className="mt-2 text-base font-medium" style={{ color: COLORS.blue }}>
                {currentClient.need}
              </p>

              <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
                <div className="text-sm font-semibold" style={{ color: COLORS.blue }}>Contexto del caso</div>
                <p className="mt-2 text-sm leading-6" style={{ color: COLORS.textSoft }}>{currentClient.context}</p>
              </div>

              <ClientDataBlock client={currentClient} />

              <div className="mt-5 flex flex-wrap gap-3">
                <ActionButton
                  onClick={onApplyClient}
                  disabled={currentClient.status !== "active" || !profile || alreadyApplied}
                  variant="orange"
                >
                  Aplicar
                </ActionButton>
              </div>

              {alreadyApplied && currentClient.status === "active" && (
                <div className="mt-4 rounded-2xl p-3 text-sm" style={{ backgroundColor: "#E7F0FF", color: COLORS.blueDark }}>
                  Ya aplicaste por este cliente.
                </div>
              )}

              {currentClient.takenBy && currentClient.takenBy.playerId === player.id && (
                <div className="mt-4 rounded-2xl p-3 text-sm" style={{ backgroundColor: "#E8F6EE", color: "#047857" }}>
                  El cliente te eligió a ti para continuar el proceso.
                </div>
              )}
            </div>
          </div>
        </CardBox>
      )}
    </div>
  );
}

function ClientePage({ player, session, onChooseApplicant }) {
  const assignedClientId = player?.assignedClientId ? String(player.assignedClientId) : "";
  const assignedClient = assignedClientId
    ? seedClients.find((c) => String(c.id) === assignedClientId)
    : null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel de cliente"
        subtitle={`${player?.name || "Jugador"} · Aquí interpretas el cliente asignado.`}
        icon={Briefcase}
      />
      <AssignedClientPanel
        assignedClient={assignedClient}
        session={session}
        player={player}
        onChooseApplicant={onChooseApplicant}
      />
    </div>
  );
}

function ObservadorPage({ session }) {
  const currentClient = session?.currentClient || null;
  const branches = session?.branches || {};

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Vista observador"
        subtitle="Sigue la partida sin intervenir."
        icon={LayoutDashboard}
      />

      <FacilitatorClientCard currentClient={currentClient} />

      <div className="space-y-6">
        <BranchBoard
          branch={branches.bogota}
          movements={(session?.history || []).filter((m) => m.branchId === "bogota")}
          alerts={(session?.alerts || []).filter((a) => a.branchId === "bogota")}
        />
        <BranchBoard
          branch={branches.medellin}
          movements={(session?.history || []).filter((m) => m.branchId === "medellin")}
          alerts={(session?.alerts || []).filter((a) => a.branchId === "medellin")}
        />
      </div>
    </div>
  );
}

function FinalPage({ session }) {
  const branches = Object.values(session?.branches || {});
  const history = session?.history || [];

  const ranking = [...branches].sort((a, b) => getUtilidad(b) - getUtilidad(a));
  const byPlayer = {};
  history.forEach((m) => {
    if (!byPlayer[m.playerName]) byPlayer[m.playerName] = 0;
    byPlayer[m.playerName] += 1;
  });
  const bestPlayer = Object.entries(byPlayer).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ranking final"
        subtitle="Cierre rápido de la partida."
        icon={Trophy}
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <CardBox className="p-6">
          <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>Podio de sucursales</h3>

          <div className="mt-4 space-y-3">
            {ranking.map((r, idx) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-3xl border p-4"
                style={{
                  borderColor: idx === 0 ? "#F7C59A" : COLORS.border,
                  backgroundColor: idx === 0 ? "#FFF5EB" : COLORS.softBlue,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                    style={{ backgroundColor: idx === 0 ? COLORS.orange : COLORS.blue }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.blueDark }}>{r.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textSoft }}>Operatividad {getCobertura(r)}%</div>
                  </div>
                </div>
                <BadgePill style={{ backgroundColor: COLORS.blue, color: COLORS.white }}>
                  {formatMoney(getUtilidad(r))}
                </BadgePill>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox className="p-6">
          <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>Reconocimientos</h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
              <div className="mb-2 flex items-center gap-2 font-semibold" style={{ color: COLORS.blue }}>
                <Crown className="h-4 w-4" />
                Sucursal ganadora
              </div>
              <div className="text-2xl font-semibold" style={{ color: COLORS.blueDark }}>{ranking[0]?.name || "-"}</div>
            </div>

            <div className="rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
              <div className="mb-2 flex items-center gap-2 font-semibold" style={{ color: COLORS.blue }}>
                <Star className="h-4 w-4" />
                Intermediario destacado
              </div>
              <div className="text-2xl font-semibold" style={{ color: COLORS.blueDark }}>{bestPlayer?.[0] || "-"}</div>
            </div>

            <div className="rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
              <div className="mb-2 flex items-center gap-2 font-semibold" style={{ color: COLORS.blue }}>
                <CheckCircle2 className="h-4 w-4" />
                Clientes captados
              </div>
              <div className="text-2xl font-semibold" style={{ color: COLORS.blueDark }}>{history.length}</div>
            </div>

            <div className="rounded-3xl border p-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}>
              <div className="mb-2 flex items-center gap-2 font-semibold" style={{ color: COLORS.blue }}>
                <PartyPopper className="h-4 w-4" />
                Último movimiento
              </div>
              <div className="text-lg font-semibold" style={{ color: COLORS.blueDark }}>{history[0]?.clientName || "-"}</div>
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  );
}

export default function App() {
  const persisted = readPersisted();

  const [authReady, setAuthReady] = useState(false);
  const [uid, setUid] = useState(null);
  const [sessionId, setSessionId] = useState(persisted?.sessionId || "");
  const [isHost, setIsHost] = useState(Boolean(persisted?.isHost));
  const [screen, setScreen] = useState("inicio");
  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerDoc, setPlayerDoc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const ref = doc(db, "sessions", sessionId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setSession(null);
        return;
      }
      setSession({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const q = query(collection(db, "sessions", sessionId, "players"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setPlayers(data);
    });
    return () => unsub();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !uid || isHost) {
      setPlayerDoc(null);
      return;
    }
    const ref = doc(db, "sessions", sessionId, "players", uid);
    const unsub = onSnapshot(ref, (snap) => {
      setPlayerDoc(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return () => unsub();
  }, [sessionId, uid, isHost]);

  const createHostSession = async (hostName) => {
    setBusy(true);
    setGlobalError("");
    try {
      const user = await ensureAnonAuth();
      const code = generateCode();
      const ref = doc(collection(db, "sessions"));

      await setDoc(ref, {
        code,
        status: "lobby",
        hostId: user.uid,
        hostName,
        createdAtMs: Date.now(),
        currentClient: null,
        remainingClients: seedClients,
        history: [],
        alerts: [],
        branches: makeBranches(),
      });

      setSessionId(ref.id);
      setIsHost(true);
      writePersisted({ sessionId: ref.id, isHost: true });
      setScreen("juego");
    } catch (e) {
      setGlobalError(e.message || "No fue posible crear la partida.");
    } finally {
      setBusy(false);
    }
  };

  const joinPlayerSession = async (name, code) => {
    setBusy(true);
    setGlobalError("");
    try {
      const user = await ensureAnonAuth();

      const q = query(
        collection(db, "sessions"),
        where("code", "==", code),
        limit(1)
      );
      const result = await getDocs(q);

      if (result.empty) {
        throw new Error("No encontré una partida con ese código.");
      }

      const sessionDoc = result.docs[0];
      const playerRef = doc(db, "sessions", sessionDoc.id, "players", user.uid);

      await setDoc(
        playerRef,
        {
          uid: user.uid,
          name,
          role: "unassigned",
          branchId: "",
          assignedClientId: "",
          assignedIntermediaryId: "",
          joinedAtMs: Date.now(),
        },
        { merge: true }
      );

      setSessionId(sessionDoc.id);
      setIsHost(false);
      writePersisted({ sessionId: sessionDoc.id, isHost: false });
      setScreen("juego");
    } catch (e) {
      setGlobalError(e.message || "No fue posible entrar.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const assignRole = async ({
    playerId,
    role,
    branchId = "",
    assignedClientId = "",
    assignedIntermediaryId = "",
  }) => {
    if (!sessionId) return;

    let finalBranchId = branchId;
    if (role === "intermediary" && assignedIntermediaryId) {
      const profile = getProfileById(assignedIntermediaryId);
      finalBranchId = profile?.branchId || "";
    }

    const ref = doc(db, "sessions", sessionId, "players", playerId);
    await updateDoc(ref, {
      role,
      branchId: role === "sucursal" || role === "intermediary" ? finalBranchId : "",
      assignedClientId: role === "cliente" ? assignedClientId : "",
      assignedIntermediaryId: role === "intermediary" ? assignedIntermediaryId : "",
    });
  };

  const publishNextClient = async () => {
    if (!sessionId) return;
    const ref = doc(db, "sessions", sessionId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe.");

        const data = snap.data();
        const current = data.currentClient;

        if (current && current.status === "active") {
          throw new Error("Ya hay un cliente activo.");
        }

        const remaining = [...(data.remainingClients || [])];
        if (!remaining.length) {
          throw new Error("No quedan clientes por publicar.");
        }

        const next = remaining.shift();

        tx.update(ref, {
          currentClient: {
            ...next,
            status: "active",
            publishedAtMs: Date.now(),
            takenBy: null,
            applicants: [],
          },
          remainingClients: remaining,
          status: "live",
        });
      });
    } catch (e) {
      alert(e.message || "No fue posible publicar el cliente.");
    }
  };

  const applyToClient = async () => {
    if (!sessionId || !playerDoc || playerDoc.role !== "intermediary") return;

    const ref = doc(db, "sessions", sessionId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe.");

        const data = snap.data();
        const current = data.currentClient;
        if (!current || current.status !== "active") {
          throw new Error("Este cliente ya no está disponible.");
        }

        const playerSnap = await tx.get(doc(db, "sessions", sessionId, "players", playerDoc.id));
        const playerData = playerSnap.data();
        const profile = getProfileById(playerData?.assignedIntermediaryId || "");

        if (!profile) {
          throw new Error("No tienes un intermediario asignado.");
        }

        const hasIdoneidad = profile.idoneidad.includes(current.line);
        const alerts = [...(data.alerts || [])];

        if (!hasIdoneidad) {
          const message = `${profile.displayName} intentó tomar ${current.name} – ${current.line}, pero no tiene idoneidad en ${current.line}.`;
          const alertObj = {
            id: `a_${Date.now()}`,
            type: "ipl_block",
            createdAtMs: Date.now(),
            message,
            branchId: profile.branchId,
            playerId: playerDoc.id,
            profileId: profile.id,
          };

          tx.update(ref, {
            alerts: [alertObj, ...alerts].slice(0, 50),
          });
          return;
        }

        const applicants = [...(current.applicants || [])];
        const alreadyApplied = applicants.some((a) => a.playerId === playerDoc.id);

        if (alreadyApplied) return;

        applicants.push({
          playerId: playerDoc.id,
          playerName: profile.displayName,
          branchId: profile.branchId,
          branchName: profile.branchId === "bogota" ? "Sucursal Bogotá" : "Sucursal Medellín",
          profileId: profile.id,
        });

        tx.update(ref, {
          currentClient: {
            ...current,
            applicants,
          },
        });
      });
    } catch (e) {
      alert(e.message || "No fue posible aplicar por el cliente.");
    }
  };

  const chooseApplicant = async (applicant) => {
    if (!sessionId || !playerDoc || playerDoc.role !== "cliente") return;

    const ref = doc(db, "sessions", sessionId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe.");

        const data = snap.data();
        const current = data.currentClient;
        if (!current || current.status !== "active") {
          throw new Error("Este cliente ya no está disponible.");
        }

        const playerSnap = await tx.get(doc(db, "sessions", sessionId, "players", playerDoc.id));
        const playerData = playerSnap.data();

        if (String(playerData?.assignedClientId || "") !== String(current.id)) {
          throw new Error("Este no es tu cliente asignado.");
        }

        const selectedApplicant = (current.applicants || []).find((a) => a.playerId === applicant.playerId);
        if (!selectedApplicant) {
          throw new Error("Ese intermediario ya no está disponible.");
        }

        const branches = JSON.parse(JSON.stringify(data.branches || makeBranches()));
        const target = branches[selectedApplicant.branchId];
        if (!target) throw new Error("La sucursal del intermediario no existe.");

        target.primas = round2(target.primas + current.premium);
        target.siniestros = round2(target.siniestros + current.claims);
        target.comisiones = round2(target.comisiones + current.commission);

        const movement = {
          id: `m_${Date.now()}`,
          createdAtMs: Date.now(),
          clientId: current.id,
          clientName: current.name,
          playerId: selectedApplicant.playerId,
          playerName: selectedApplicant.playerName,
          branchId: selectedApplicant.branchId,
          branchName: target.name,
          premium: current.premium,
          claims: current.claims,
          commission: current.commission,
        };

        tx.update(ref, {
          branches,
          currentClient: {
            ...current,
            status: "taken",
            selectedAtMs: Date.now(),
            takenBy: {
              playerId: selectedApplicant.playerId,
              playerName: selectedApplicant.playerName,
              branchId: selectedApplicant.branchId,
              branchName: target.name,
            },
          },
          history: [movement, ...(data.history || [])].slice(0, 50),
        });
      });
    } catch (e) {
      alert(e.message || "No fue posible elegir al intermediario.");
    }
  };

  const closeLocalSession = () => {
    clearPersisted();
    setSessionId("");
    setSession(null);
    setPlayers([]);
    setPlayerDoc(null);
    setIsHost(false);
    setScreen("inicio");
  };

  const goFinal = () => setScreen("final");
  const goFacilitator = () => setScreen("facilitador");

  if (!authReady) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bg, color: COLORS.blueDark }}>
        <div className="mx-auto max-w-7xl">
          <LogoHeader />
          <div className="mt-10 rounded-3xl border bg-white p-8" style={{ borderColor: COLORS.border, color: COLORS.textSoft }}>
            Cargando autenticación...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.blueDark }}>
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3">
              <LogoHeader />
            </div>
            <p className="text-sm" style={{ color: COLORS.textSoft }}>
              Host, sucursal, intermediario, cliente y observador en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PanelButton active={screen === "inicio"} icon={LayoutDashboard} onClick={() => setScreen("inicio")}>
              Inicio
            </PanelButton>

            {!sessionId && (
              <PanelButton active={screen === "registro"} icon={Users} onClick={() => setScreen("registro")}>
                Entrar
              </PanelButton>
            )}

            <PanelButton active={screen === "reglas"} icon={ListChecks} onClick={() => setScreen("reglas")}>
              Reglas
            </PanelButton>
            <PanelButton active={screen === "juego"} icon={PlayCircle} onClick={() => setScreen("juego")}>
              Juego
            </PanelButton>
            <PanelButton active={screen === "facilitador"} icon={Gauge} onClick={() => setScreen("facilitador")}>
              Facilitador
            </PanelButton>
            <PanelButton active={screen === "final"} icon={Trophy} onClick={() => setScreen("final")}>
              Ranking final
            </PanelButton>

            {(sessionId || session) && (
              <ActionButton onClick={closeLocalSession} variant="secondary">
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Salir
                </span>
              </ActionButton>
            )}
          </div>
        </div>

        {globalError && (
          <div className="mb-4 rounded-2xl p-3 text-sm" style={{ backgroundColor: "#FFF2E8", color: COLORS.orange }}>
            {globalError}
          </div>
        )}

        {!sessionId ? (
          <AnimatePresence mode="wait">
            {screen === "inicio" && (
              <motion.div
                key="inicio_publico"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div
                    className="rounded-[28px] p-8 text-white shadow-md border"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.blueDark}, ${COLORS.blue})`,
                      borderColor: COLORS.blue,
                    }}
                  >
                    <BadgePill style={{ backgroundColor: "rgba(255,255,255,0.14)", color: COLORS.white }}>
                      Entorno corporativo
                    </BadgePill>

                    <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight">
                      Cada decisión comercial impacta el desempeño de la sucursal en tiempo real.
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm text-slate-100">
                      Los intermediarios pertenecen a una sucursal, los clientes llegan uno por uno y el resultado final se mide en cobertura del gasto meta, utilidad y capacidad comercial.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ActionButton onClick={() => setScreen("reglas")} variant="secondary">
                        Ver dinámica
                      </ActionButton>

                      <ActionButton onClick={() => setScreen("registro")} variant="orange">
                        <span className="inline-flex items-center gap-2">
                          Empezar
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </ActionButton>
                    </div>
                  </div>

                  <CardBox className="p-6">
                    <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>
                      Roles del juego
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
                      Cada rol vive una experiencia distinta.
                    </p>

                    <div className="mt-4 space-y-4">
                      <div className="rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                        <div className="mb-1 font-semibold" style={{ color: COLORS.blueDark }}>
                          Sucursal
                        </div>
                        <p className="text-sm" style={{ color: COLORS.textSoft }}>
                          Arranca en cero y debe ir cubriendo un gasto meta de 500 millones.
                        </p>
                      </div>

                      <div className="rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                        <div className="mb-1 font-semibold" style={{ color: COLORS.blueDark }}>
                          Intermediario
                        </div>
                        <p className="text-sm" style={{ color: COLORS.textSoft }}>
                          Tiene perfil fijo, sucursal, idoneidad y antigüedad.
                        </p>
                      </div>

                      <div className="rounded-3xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                        <div className="mb-1 font-semibold" style={{ color: COLORS.blueDark }}>
                          Cliente
                        </div>
                        <p className="text-sm" style={{ color: COLORS.textSoft }}>
                          Ve su ficha completa y puede elegir entre intermediarios que aplicaron.
                        </p>
                      </div>
                    </div>
                  </CardBox>
                </div>
              </motion.div>
            )}

            {screen === "registro" && (
              <motion.div
                key="registro_publico"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <JoinPage onCreateHost={createHostSession} onJoinPlayer={joinPlayerSession} busy={busy} />
              </motion.div>
            )}

            {screen === "reglas" && (
              <motion.div
                key="reglas_publico"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>
                    Reglas base
                  </h3>

                  <div className="mt-4 space-y-4">
                    {[
                      "Hay 2 sucursales, 4 intermediarios y 14 clientes base.",
                      "El host asigna rol a cada jugador que entra.",
                      "Si el rol es cliente, se le asigna una ficha específica.",
                      "Si el rol es intermediario, se le asigna un perfil fijo con idoneidad.",
                      "Los intermediarios aplican y el cliente elige con quién se queda.",
                    ].map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 rounded-3xl border p-4"
                        style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: idx % 2 === 0 ? COLORS.blue : COLORS.orange }}
                        >
                          {idx + 1}
                        </div>
                        <p className="text-sm" style={{ color: COLORS.blueDark }}>
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <ActionButton onClick={() => setScreen("inicio")} variant="secondary">
                      Volver
                    </ActionButton>
                    <ActionButton onClick={() => setScreen("registro")} variant="orange">
                      Empezar
                    </ActionButton>
                  </div>
                </CardBox>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {screen === "inicio" && (
              <motion.div
                key="inicio_privado"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <CardBox
                    className="p-8 text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${COLORS.blueDark}, ${COLORS.blue})`, borderColor: COLORS.blue }}
                  >
                    <BadgePill style={{ backgroundColor: "rgba(255,255,255,0.14)", color: COLORS.white }}>
                      MVP tiempo real
                    </BadgePill>
                    <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight">
                      Esta base ya soporta host, jugadores conectados y lógica de aplicación por cliente.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm text-slate-100">
                      El host asigna roles, publica clientes, los intermediarios aplican y el cliente elige con quién continuar.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <ActionButton onClick={() => setScreen("juego")} variant="orange">
                        <span className="inline-flex items-center gap-2">
                          Ir al juego
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </ActionButton>
                    </div>
                  </CardBox>

                  <CardBox className="p-6">
                    <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>Estado actual</h3>
                    <div className="mt-4 grid gap-3">
                      <StatCard label="Código" value={session?.code || "-"} />
                      <StatCard label="Jugadores" value={players.length} />
                      <StatCard label="Clientes pendientes" value={session?.remainingClients?.length || 0} />
                      <StatCard label="Movimientos" value={session?.history?.length || 0} />
                    </div>
                  </CardBox>
                </div>
              </motion.div>
            )}

            {screen === "reglas" && (
              <motion.div
                key="reglas_privado"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold" style={{ color: COLORS.blue }}>Reglas base</h3>
                  <div className="mt-4 space-y-4">
                    {[
                      "Hay 2 sucursales, 4 intermediarios y 14 clientes base.",
                      "El host asigna rol a cada jugador que entra.",
                      "Todos los intermediarios ven el mismo cliente al tiempo.",
                      "Los intermediarios aplican si tienen idoneidad.",
                      "El cliente ve quién aplicó y elige con cuál se va.",
                    ].map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 rounded-3xl border p-4"
                        style={{ borderColor: COLORS.border, backgroundColor: COLORS.softBlue }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: idx % 2 === 0 ? COLORS.blue : COLORS.orange }}
                        >
                          {idx + 1}
                        </div>
                        <p className="text-sm" style={{ color: COLORS.blueDark }}>{rule}</p>
                      </div>
                    ))}
                  </div>
                </CardBox>
              </motion.div>
            )}

            {screen === "juego" && (
              <motion.div
                key="juego"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {isHost ? (
                  <GameSetupPage
                    session={session}
                    players={players}
                    onAssignRole={assignRole}
                    onCloseSession={closeLocalSession}
                    onGoFacilitator={goFacilitator}
                  />
                ) : !playerDoc ? (
                  <CardBox className="p-8 text-sm" style={{ color: COLORS.textSoft }}>
                    Cargando jugador...
                  </CardBox>
                ) : playerDoc.role === "unassigned" ? (
                  <WaitingPage player={playerDoc} />
                ) : playerDoc.role === "sucursal" ? (
                  <SucursalPage player={playerDoc} session={session} />
                ) : playerDoc.role === "intermediary" ? (
                  <IntermediaryPage player={playerDoc} session={session} onApplyClient={applyToClient} />
                ) : playerDoc.role === "cliente" ? (
                  <ClientePage player={playerDoc} session={session} onChooseApplicant={chooseApplicant} />
                ) : (
                  <ObservadorPage session={session} />
                )}
              </motion.div>
            )}

            {screen === "facilitador" && (
              <motion.div
                key="facilitador"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <FacilitatorPage
                  session={session}
                  onPublishNextClient={publishNextClient}
                  onGoFinal={goFinal}
                />
              </motion.div>
            )}

            {screen === "final" && (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <FinalPage session={session} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}