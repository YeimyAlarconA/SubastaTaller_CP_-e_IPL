import React, { useEffect, useMemo, useState } from "react";
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
  RotateCcw,
  Eye,
  EyeOff,
  User,
  Copy,
  LogOut,
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

function fitScore(client, intermediary) {
  const lineMatch = intermediary.lineas?.includes(client.line) ? 18 : 0;
  const riskPenalty = client.risk === "Alto" ? 14 : client.risk === "Medio" ? 7 : 0;
  const retentionValue = 100 - Math.min(95, client.claims * 0.9);

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
  if (role === "intermediary") {
    return branchId === "bogota" ? "Intermediario Bogotá" : "Intermediario Medellín";
  }
  return role;
}

function roleOptionValue(role, branchId = "") {
  return `${role}|${branchId}`;
}

async function ensureAnonAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
}

function CardBox({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
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

function StatCard({ label, value, accent = "text-slate-900" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</div>
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
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Estado</div>
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
      </div>
    </div>
  );
}

function BranchBoard({ branch, movements }) {
  if (!branch) return null;

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
      <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-white/70">Panel de sucursal</div>
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
        <StatCard label="Primas" value={formatMoney(branch.primas)} accent="text-sky-700" />
        <StatCard label="Siniestros" value={formatMoney(branch.siniestros)} accent="text-amber-700" />
        <StatCard label="Comisiones" value={formatMoney(branch.comisiones)} accent="text-slate-700" />
        <StatCard label="Gasto meta" value={formatMoney(branch.gastoMeta)} accent="text-slate-700" />
        <StatCard label="Gasto pendiente" value={formatMoney(gastoPendiente)} accent={gastoPendiente > 0 ? "text-slate-700" : "text-emerald-700"} />
        <StatCard label="Utilidad" value={formatMoney(utilidad)} accent={utilidad >= 0 ? "text-emerald-700" : "text-rose-700"} />
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
            transition={{ duration: 0.4 }}
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
                      transition={{ duration: 0.4 }}
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
              movements.slice(0, 5).map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="text-sm font-semibold text-slate-900">{m.clientName}</div>
                  <div className="mt-1 text-xs text-slate-500">Entró por {m.playerName}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <BadgePill className="bg-sky-100 text-sky-700">+{formatMoney(m.premium)}</BadgePill>
                    <BadgePill className="bg-amber-100 text-amber-700">+{formatMoney(m.claims)}</BadgePill>
                    <BadgePill className="bg-slate-200 text-slate-700">+{formatMoney(m.commission)}</BadgePill>
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
      <CardBox className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white">
        <BadgePill className="mb-4 bg-white/10 text-white">MVP multiusuario</BadgePill>
        <h2 className="text-4xl font-semibold leading-tight">
          Cada jugador entra desde su propio dispositivo y el host controla la partida en vivo.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-200">
          Esta versión ya separa host, sucursal, intermediario, cliente y observador. El primero que selecciona el cliente lo bloquea para los demás.
        </p>
      </CardBox>

      <CardBox className="p-6">
        <h3 className="text-xl font-semibold">Entrar</h3>
        <p className="mt-1 text-sm text-slate-500">Elige si vas a entrar como host o como jugador.</p>

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
            <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
            <input
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          {mode === "player" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Código de partida</label>
              <input
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none focus:border-slate-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ABCDE"
              />
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={busy}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-medium text-white ${
              busy ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {busy ? "Procesando..." : mode === "host" ? "Crear partida" : "Entrar a la partida"}
          </button>
        </div>
      </CardBox>
    </div>
  );
}

function WaitingPage({ player }) {
  return (
    <CardBox className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
        <Users className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-2xl font-semibold">Hola, {player?.name}</h3>
      <p className="mt-2 text-slate-500">Entraste correctamente. Espera a que el host te asigne un rol.</p>
    </CardBox>
  );
}

function CurrentClientBlock({ currentClient, revealFinancial = false }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [currentClient?.id]);

  if (!currentClient) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No hay cliente activo en este momento.
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <ClientVisual visual={currentClient.visual} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold text-slate-900">{currentClient.name}</h3>
            <BadgePill className="border border-slate-300 bg-white text-slate-700">
              {currentClient.customerType}
            </BadgePill>
          </div>

          <p className="mt-2 text-base font-medium text-slate-700">{currentClient.need}</p>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="text-sm font-semibold text-slate-800">Contexto del caso</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{currentClient.context}</p>
          </div>

          {revealFinancial && (
            <div className="mt-5 flex gap-3">
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Revelar detalles
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setRevealed(false)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Ocultar detalles
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {revealed && revealFinancial && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label="Línea" value={currentClient.line} />
              <StatCard label="Prima" value={formatMoney(currentClient.premium)} />
              <StatCard label="Siniestro" value={formatMoney(currentClient.claims)} />
              <StatCard label="Comisión" value={formatMoney(currentClient.commission)} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <BadgePill className={`border ${riskClasses(currentClient.risk)}`}>{currentClient.risk}</BadgePill>
              <BadgePill className="bg-slate-200 text-slate-700">{currentClient.tag}</BadgePill>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HostPage({
  session,
  players,
  onAssignRole,
  onPublishNextClient,
  onCloseSession,
}) {
  const branches = session?.branches || {};
  const currentClient = session?.currentClient || null;
  const history = session?.history || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel del host"
        subtitle="Controlas la partida, asignas roles y publicas clientes."
        icon={Gauge}
      />

      <CardBox className="p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Código de acceso</div>
            <div className="mt-1 flex items-center gap-3">
              <div className="text-3xl font-semibold tracking-[0.25em] text-slate-900">
                {session?.code}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(session?.code || "")}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar
                </span>
              </button>
            </div>
            <div className="mt-3 text-sm text-slate-500">
              Estado de partida: <span className="font-medium text-slate-800">{session?.status || "lobby"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-2 lg:justify-end">
            <button
              onClick={onPublishNextClient}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Siguiente cliente
            </button>
            <button
              onClick={onCloseSession}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cerrar sesión local
            </button>
          </div>
        </div>
      </CardBox>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Jugadores conectados</h3>
          <p className="mt-1 text-sm text-slate-500">Asigna el rol y la sucursal desde aquí.</p>

          <div className="mt-4 space-y-3">
            {players.length ? (
              players.map((player) => (
                <div key={player.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{player.name}</div>
                      <div className="text-sm text-slate-500">{roleLabel(player.role, player.branchId)}</div>
                    </div>

                    <select
                      className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
                      value={roleOptionValue(player.role || "unassigned", player.branchId || "")}
                      onChange={(e) => {
                        const [role, branchId] = e.target.value.split("|");
                        onAssignRole(player.id, role, branchId || "");
                      }}
                    >
                      <option value="unassigned|">Sin asignar</option>
                      <option value="observador|">Observador</option>
                      <option value="cliente|">Cliente</option>
                      <option value="sucursal|bogota">Sucursal Bogotá</option>
                      <option value="sucursal|medellin">Sucursal Medellín</option>
                      <option value="intermediary|bogota">Intermediario Bogotá</option>
                      <option value="intermediary|medellin">Intermediario Medellín</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                Aún no han entrado jugadores.
              </div>
            )}
          </div>
        </CardBox>

        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Cliente actual</h3>
          <p className="mt-1 text-sm text-slate-500">Todos los intermediarios ven este mismo cliente.</p>

          <div className="mt-4">
            {currentClient ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-500">Cliente activo</div>
                    <div className="text-xl font-semibold text-slate-900">{currentClient.name}</div>
                  </div>
                  <BadgePill className="bg-slate-900 text-white">{currentClient.status}</BadgePill>
                </div>
                <p className="mt-3 text-sm text-slate-600">{currentClient.context}</p>

                {currentClient.takenBy && (
                  <div className="mt-4 rounded-2xl bg-white p-3 text-sm text-slate-700">
                    Tomado por <span className="font-semibold">{currentClient.takenBy.playerName}</span> ·{" "}
                    {currentClient.takenBy.branchName}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No hay cliente activo. Pulsa “Siguiente cliente”.
              </div>
            )}
          </div>
        </CardBox>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Resumen de sucursales</h3>
          <p className="mt-1 text-sm text-slate-500">Vista general del desempeño.</p>

          <div className="mt-4 space-y-4">
            {Object.values(branches).map((branch) => {
              const cobertura = getCobertura(branch);
              const semaforo = getSemaforo(cobertura);

              return (
                <div key={branch.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{branch.name}</div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${semaforo.dot}`} />
                      <span className={`text-sm font-semibold ${semaforo.text}`}>{cobertura}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <StatCard label="Primas" value={formatMoney(branch.primas)} />
                    <StatCard label="Siniestros" value={formatMoney(branch.siniestros)} />
                    <StatCard label="Comisiones" value={formatMoney(branch.comisiones)} />
                    <StatCard label="Pendiente" value={formatMoney(getGastoPendiente(branch))} />
                    <StatCard label="Utilidad" value={formatMoney(getUtilidad(branch))} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBox>

        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Movimientos en vivo</h3>
          <p className="mt-1 text-sm text-slate-500">Lo último que ha pasado en la partida.</p>

          <div className="mt-4 space-y-3">
            {history.length ? (
              history.slice(0, 10).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="font-semibold text-slate-900">{item.clientName}</div>
                  <div className="text-sm text-slate-500">
                    {item.playerName} · {item.branchName}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                Sin movimientos todavía.
              </div>
            )}
          </div>
        </CardBox>
      </div>
    </div>
  );
}

function SucursalPage({ player, session }) {
  const branch = session?.branches?.[player.branchId];
  const movements = (session?.history || []).filter((m) => m.branchId === player.branchId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={roleLabel(player.role, player.branchId)}
        subtitle={`Bienvenida, ${player.name}. Aquí ves solo el tablero de tu sucursal.`}
        icon={Building2}
      />
      <BranchBoard branch={branch} movements={movements} />
    </div>
  );
}

function IntermediaryPage({ player, session, onSelectClient }) {
  const currentClient = session?.currentClient || null;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [currentClient?.id]);

  const takenByOther =
    currentClient?.takenBy && currentClient.takenBy.playerId !== player.id;

  const takenByMe =
    currentClient?.takenBy && currentClient.takenBy.playerId === player.id;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel de intermediario"
        subtitle={`${player.name} · ${roleLabel(player.role, player.branchId)}`}
        icon={Users}
      />

      <CardBox className="p-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
          <div className="font-semibold text-slate-900">Tu sucursal</div>
          <div className="mt-1 text-slate-600">
            {player.branchId === "bogota" ? "Sucursal Bogotá" : "Sucursal Medellín"}
          </div>
        </div>
      </CardBox>

      {!currentClient ? (
        <CardBox className="p-8 text-center text-sm text-slate-500">
          No hay cliente activo en este momento. Espera a que el host publique uno.
        </CardBox>
      ) : (
        <CardBox className="p-6">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <ClientVisual visual={currentClient.visual} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-semibold text-slate-900">{currentClient.name}</h3>
                <BadgePill className="border border-slate-300 bg-white text-slate-700">
                  {currentClient.customerType}
                </BadgePill>
                <BadgePill className="bg-slate-900 text-white">{currentClient.status}</BadgePill>
              </div>

              <p className="mt-2 text-base font-medium text-slate-700">{currentClient.need}</p>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="text-sm font-semibold text-slate-800">Contexto del caso</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{currentClient.context}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Revelar detalles
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setRevealed(false)}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Ocultar detalles
                    </span>
                  </button>
                )}

                <button
                  onClick={onSelectClient}
                  disabled={!revealed || currentClient.status !== "active"}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium text-white ${
                    !revealed || currentClient.status !== "active"
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Seleccionar cliente
                </button>
              </div>

              {takenByOther && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
                  Este cliente ya fue tomado por {currentClient.takenBy.playerName}.
                </div>
              )}

              {takenByMe && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">
                  Tú tomaste este cliente para {currentClient.takenBy.branchName}.
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5"
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatCard label="Línea" value={currentClient.line} />
                  <StatCard label="Prima" value={formatMoney(currentClient.premium)} />
                  <StatCard label="Siniestro" value={formatMoney(currentClient.claims)} />
                  <StatCard label="Comisión" value={formatMoney(currentClient.commission)} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <BadgePill className={`border ${riskClasses(currentClient.risk)}`}>{currentClient.risk}</BadgePill>
                  <BadgePill className="bg-slate-200 text-slate-700">{currentClient.tag}</BadgePill>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBox>
      )}
    </div>
  );
}

function ClientePage({ player, session }) {
  const currentClient = session?.currentClient || null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel de cliente"
        subtitle={`${player.name} · Aquí interpretas el cliente actual.`}
        icon={Briefcase}
      />
      <CurrentClientBlock currentClient={currentClient} revealFinancial={false} />
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

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <CurrentClientBlock currentClient={currentClient} revealFinancial={false} />

        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Resumen de sucursales</h3>
          <div className="mt-4 space-y-4">
            {Object.values(branches).map((branch) => (
              <div key={branch.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="font-semibold text-slate-900">{branch.name}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatCard label="Primas" value={formatMoney(branch.primas)} />
                  <StatCard label="Siniestros" value={formatMoney(branch.siniestros)} />
                  <StatCard label="Pendiente" value={formatMoney(getGastoPendiente(branch))} />
                  <StatCard label="Utilidad" value={formatMoney(getUtilidad(branch))} />
                </div>
              </div>
            ))}
          </div>
        </CardBox>
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
          <h3 className="text-xl font-semibold">Podio de sucursales</h3>

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
                    <div className="font-semibold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">Operatividad {getCobertura(r)}%</div>
                  </div>
                </div>
                <BadgePill className="bg-slate-900 text-white">{formatMoney(getUtilidad(r))}</BadgePill>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox className="p-6">
          <h3 className="text-xl font-semibold">Reconocimientos</h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Crown className="h-4 w-4" />
                Sucursal ganadora
              </div>
              <div className="text-2xl font-semibold text-slate-900">{ranking[0]?.name || "-"}</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Star className="h-4 w-4" />
                Intermediario destacado
              </div>
              <div className="text-2xl font-semibold text-slate-900">{bestPlayer?.[0] || "-"}</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Clientes captados
              </div>
              <div className="text-2xl font-semibold text-slate-900">{history.length}</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <PartyPopper className="h-4 w-4" />
                Último movimiento
              </div>
              <div className="text-lg font-semibold text-slate-900">{history[0]?.clientName || "-"}</div>
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
  const [gameTab, setGameTab] = useState("panel");
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

  const assignRole = async (playerId, role, branchId = "") => {
    if (!sessionId) return;
    const ref = doc(db, "sessions", sessionId, "players", playerId);
    await updateDoc(ref, { role, branchId });
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
          },
          remainingClients: remaining,
          status: "live",
        });
      });
    } catch (e) {
      alert(e.message || "No fue posible publicar el cliente.");
    }
  };

  const selectCurrentClient = async () => {
    if (!sessionId || !playerDoc || playerDoc.role !== "intermediary") return;

    const ref = doc(db, "sessions", sessionId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe.");

        const data = snap.data();
        const current = data.currentClient;
        if (!current || current.status !== "active" || current.takenBy) {
          throw new Error("Este cliente ya no está disponible.");
        }

        const branches = JSON.parse(JSON.stringify(data.branches || makeBranches()));
        const target = branches[playerDoc.branchId];
        if (!target) throw new Error("El intermediario no tiene sucursal asignada.");

        target.primas = round2(target.primas + current.premium);
        target.siniestros = round2(target.siniestros + current.claims);
        target.comisiones = round2(target.comisiones + current.commission);

        const movement = {
          id: `m_${Date.now()}`,
          createdAtMs: Date.now(),
          clientId: current.id,
          clientName: current.name,
          playerId: playerDoc.id,
          playerName: playerDoc.name,
          branchId: playerDoc.branchId,
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
              playerId: playerDoc.id,
              playerName: playerDoc.name,
              branchId: playerDoc.branchId,
              branchName: target.name,
            },
          },
          history: [movement, ...(data.history || [])].slice(0, 50),
        });
      });
    } catch (e) {
      alert(e.message || "No fue posible tomar el cliente.");
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
    setGameTab("panel");
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <LogoHeader />
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
            Cargando autenticación...
          </div>
        </div>
      </div>
    );
  }

  const branchIntermediaries = players.filter(
    (p) => p.role === "intermediary" && p.branchId === "bogota"
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3">
              <LogoHeader />
            </div>
            <p className="text-sm text-slate-500">
              Host, sucursal, intermediario, cliente y observador en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PanelButton active={screen === "inicio"} icon={LayoutDashboard} onClick={() => setScreen("inicio")}>
              Inicio
            </PanelButton>
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
              <button
                onClick={closeLocalSession}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Salir
                </span>
              </button>
            )}
          </div>
        </div>

        {globalError && (
          <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{globalError}</div>
        )}

        {!sessionId ? (
          <JoinPage onCreateHost={createHostSession} onJoinPlayer={joinPlayerSession} busy={busy} />
        ) : (
          <AnimatePresence mode="wait">
            {screen === "inicio" && (
              <motion.div key="inicio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <CardBox className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-md">
                    <BadgePill className="mb-4 bg-white/10 text-white">MVP tiempo real</BadgePill>
                    <h2 className="max-w-2xl text-4xl font-semibold leading-tight">
                      Esta base ya soporta host, jugadores conectados y bloqueo del primer intermediario que selecciona.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm text-slate-200">
                      El host asigna roles, publica clientes y el tablero se mueve en vivo cuando un intermediario gana el cliente.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => setScreen("juego")}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                      >
                        <span className="inline-flex items-center gap-2">
                          Ir al juego
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                    </div>
                  </CardBox>

                  <CardBox className="p-6">
                    <h3 className="text-xl font-semibold">Estado actual</h3>
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
              <motion.div key="reglas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <CardBox className="p-6">
                  <h3 className="text-xl font-semibold">Reglas base</h3>
                  <div className="mt-4 space-y-4">
                    {[
                      "Hay 2 sucursales, 4 intermediarios y 14 clientes base.",
                      "El host asigna rol a cada jugador que entra.",
                      "Todos los intermediarios ven el mismo cliente al tiempo.",
                      "El primero que lo selecciona lo bloquea para los demás.",
                      "La sucursal del intermediario se actualiza en vivo.",
                    ].map((rule, idx) => (
                      <div key={idx} className="flex gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700">{rule}</p>
                      </div>
                    ))}
                  </div>
                </CardBox>
              </motion.div>
            )}

            {screen === "juego" && (
              <motion.div key="juego" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {isHost ? (
                  <HostPage
                    session={session}
                    players={players}
                    onAssignRole={assignRole}
                    onPublishNextClient={publishNextClient}
                    onCloseSession={closeLocalSession}
                  />
                ) : !playerDoc ? (
                  <CardBox className="p-8 text-sm text-slate-500">Cargando jugador...</CardBox>
                ) : playerDoc.role === "unassigned" ? (
                  <WaitingPage player={playerDoc} />
                ) : playerDoc.role === "sucursal" ? (
                  <SucursalPage player={playerDoc} session={session} />
                ) : playerDoc.role === "intermediary" ? (
                  <IntermediaryPage player={playerDoc} session={session} onSelectClient={selectCurrentClient} />
                ) : playerDoc.role === "cliente" ? (
                  <ClientePage player={playerDoc} session={session} />
                ) : (
                  <ObservadorPage session={session} />
                )}
              </motion.div>
            )}

            {screen === "facilitador" && (
              <motion.div key="facilitador" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <HostPage
                  session={session}
                  players={players}
                  onAssignRole={assignRole}
                  onPublishNextClient={publishNextClient}
                  onCloseSession={closeLocalSession}
                />
              </motion.div>
            )}

            {screen === "final" && (
              <motion.div key="final" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <FinalPage session={session} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}