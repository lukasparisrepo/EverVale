import { useCallback, useEffect, useMemo, useState } from "react";
import type { WorldSpeed } from "@evervale/domain/world.types";
import type { BuildCatalogEntryDto, WorldCommand, WorldViewDto } from "@evervale/protocol/world";
import { devLogin, getWorld, sendCommand } from "./api";
import { WorldView, type RuntimeMetrics } from "./world/WorldView";

type Mode = "SELECT" | "BUILD" | "ROAD";

function Login({ onLogin }: { onLogin(ownerId: string): void }) {
  const [handle, setHandle] = useState("builder");
  const [error, setError] = useState("");

  return (
    <div className="login-shell">
      <form
        className="login-card"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const session = await devLogin(handle);
            localStorage.setItem("evervale.owner", session.ownerId);
            onLogin(session.ownerId);
          } catch (e) {
            setError(e instanceof Error ? e.message : "LOGIN_FAILED");
          }
        }}
      >
        <div className="eyebrow">M1 VERTICAL SLICE</div>
        <h1>EverVale</h1>
        <p>Your town keeps moving while you are away.</p>
        <input value={handle} onChange={(e) => setHandle(e.target.value)} aria-label="Builder name" />
        <button type="submit">Enter the Vale</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default function App() {
  const [ownerId, setOwnerId] = useState(() => localStorage.getItem("evervale.owner") ?? "");
  const [view, setView] = useState<WorldViewDto | null>(null);
  const [mode, setMode] = useState<Mode>("SELECT");
  const [selectedBuild, setSelectedBuild] = useState<BuildCatalogEntryDto | null>(null);
  const [roadStart, setRoadStart] = useState<{x:number;z:number} | null>(null);
  const [message, setMessage] = useState("Loading world...");
  const [metrics, setMetrics] = useState<RuntimeMetrics | null>(null);

  const refresh = useCallback(async () => {
    if (!ownerId) return;
    try {
      const next = await getWorld(ownerId);
      setView(next);
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "WORLD_LOAD_FAILED");
    }
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;
    void refresh();
    const timer = window.setInterval(() => void refresh(), 1000);
    return () => window.clearInterval(timer);
  }, [ownerId, refresh]);

  const command = useCallback(async (input: Omit<WorldCommand, "commandId" | "expectedRevision">) => {
    if (!view) return;
    const cmd = {
      ...input,
      commandId: crypto.randomUUID(),
      expectedRevision: view.world.revision,
    } as WorldCommand;
    try {
      await sendCommand(ownerId, cmd);
      await refresh();
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "COMMAND_FAILED");
      await refresh();
    }
  }, [ownerId, refresh, view]);

  const groundClick = useCallback((p: {x:number;z:number}) => {
    if (!view) return;
    if (mode === "BUILD" && selectedBuild) {
      void command({
        type: "PLACE_BUILDING",
        payload: { definitionId: selectedBuild.id, x: p.x, z: p.z },
      });
      return;
    }
    if (mode === "ROAD") {
      if (!roadStart) {
        setRoadStart(p);
        setMessage("Road start selected. Click an end point.");
      } else {
        void command({
          type: "DRAW_ROAD",
          payload: { fromX: roadStart.x, fromZ: roadStart.z, toX: p.x, toZ: p.z },
        });
        setRoadStart(null);
      }
    }
  }, [command, mode, roadStart, selectedBuild, view]);

  const unlockedCatalog = useMemo(
    () => view?.buildCatalog.filter((b) => b.techTier <= view.world.resources.techTier) ?? [],
    [view],
  );

  if (!ownerId) return <Login onLogin={setOwnerId} />;
  if (!view) return <div className="loading">{message || "Loading EverVale..."}</div>;

  const w = view.world;
  const combatLabel = w.combat && w.combat.status !== "RESOLVED"
    ? w.combat.status === "WARNING"
      ? `⚠ Strange movement — contact soon`
      : "⚔ Threat contact"
    : w.combat?.outcome
      ? `${w.combat.outcome} — ${w.combat.summary ?? ""}`
      : "";

  const damaged = w.buildings.filter((b) => b.damageState !== "HEALTHY");
  const worldMinute = Math.floor(w.simulationSeconds % 1440);
  const worldHour = Math.floor(worldMinute / 60);
  const worldClock = `${String(worldHour).padStart(2, "0")}:${String(worldMinute % 60).padStart(2, "0")}`;

  return (
    <div className="game-shell">
      <WorldView
        world={w}
        mode={mode}
        selectedBuildId={selectedBuild?.id}
        roadStart={roadStart}
        onGroundClick={groundClick}
        onMetrics={setMetrics}
      />

      <header className="topbar">
        <div className="brand">EVERVALE <span>M1</span></div>
        <div className="resources">
          <b>¤ {Math.floor(w.resources.money)}</b>
          <b>⚡ {Math.floor(w.resources.power)}/{Math.floor(w.resources.powerCap)}</b>
          <b>💧 {Math.floor(w.resources.water)}/{Math.floor(w.resources.waterCap)}</b>
          <b>◇ {Math.floor(w.resources.varum)}</b>
          <b>👥 {w.society.population}/{w.society.housingCapacity}</b>
          <b>☺ {Math.round(w.society.happiness)}</b>
          <b>T{w.resources.techTier} · {Math.floor(w.resources.techPoints)}</b>
          <b data-testid="world-clock">🕒 {worldClock}</b>
        </div>
        <div className="speed">
          {([0,1,2,4] as WorldSpeed[]).map((speed) => (
            <button
              key={speed}
              className={w.speed === speed ? "active" : ""}
              onClick={() => void command({ type:"SET_SPEED", payload:{speed} })}
            >
              {speed === 0 ? "Ⅱ" : `${speed}×`}
            </button>
          ))}
        </div>
      </header>

      {combatLabel && <div className="combat-banner" data-testid="combat-status">{combatLabel}</div>}

      <aside className="build-panel">
        <h3>Build</h3>
        <button className={mode === "SELECT" ? "active" : ""} onClick={() => { setMode("SELECT"); setSelectedBuild(null); }}>Select</button>
        <button className={mode === "ROAD" ? "active" : ""} onClick={() => { setMode("ROAD"); setSelectedBuild(null); setRoadStart(null); }}>Dirt Road</button>
        <div className="divider" />
        {unlockedCatalog.map((item) => (
          <button
            key={item.id}
            className={mode === "BUILD" && selectedBuild?.id === item.id ? "active" : ""}
            onClick={() => { setMode("BUILD"); setSelectedBuild(item); setRoadStart(null); }}
          >
            <span>{item.name}</span>
            <small>¤{item.moneyCost} · {item.buildCycles} cycles</small>
          </button>
        ))}
      </aside>

      <aside className="status-panel">
        <div data-testid="building-count"><strong>Buildings</strong> {w.buildings.length}</div>
        <div data-testid="simulation-seconds"><strong>Sim</strong> {Math.floor(w.simulationSeconds)}s</div>
        <div><strong>Workforce</strong> {w.society.assignedWorkers}/{w.society.workforce}</div>
        <div><strong>Education</strong> {Math.round(w.society.educationCoverage * 100)}%</div>
        <div><strong>Recreation</strong> {Math.round(w.society.recreationCoverage * 100)}%</div>
        <div><strong>Safety</strong> {Math.round(w.society.safety * 100)}%</div>
        <div
          className="perf-probe"
          data-testid="runtime-metrics"
          data-fps={metrics?.fps ?? 0}
          data-frame-p95={metrics?.frameMsP95 ?? 0}
          data-draw-calls={metrics?.drawCalls ?? 0}
          data-triangles={metrics?.triangles ?? 0}
          data-citizens={metrics?.animatedCitizens ?? 0}
        >
          <strong>Runtime</strong>
          <small>
            {metrics
              ? `${metrics.fps} FPS · p95 ${metrics.frameMsP95}ms · ${metrics.drawCalls} calls · ${metrics.triangles} tris`
              : "measuring…"}
          </small>
        </div>
        {w.blockers.length > 0 && (
          <div className="blocker-list" data-testid="blocker-list">
            <strong>Expansion blockers</strong>
            {w.blockers.map((blocker) => {
              const meta = view.blockerCatalog.find((item) => item.id === blocker.definitionId);
              const label = blocker.definitionId.replaceAll("_", " ");
              return (
                <div key={blocker.id} className="blocker-row">
                  <span>
                    {label}
                    {meta ? <small> · ¤{meta.moneyCost} · {meta.clearCycles} cycles</small> : null}
                  </span>
                  {blocker.state === "CLEARING" ? (
                    <small>{Math.ceil(blocker.clearRemainingSeconds)}s</small>
                  ) : (
                    <button
                      onClick={() => void command({ type:"CLEAR_BLOCKER", payload:{blockerId:blocker.id} })}
                    >
                      Clear
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {damaged.length > 0 && (
          <div className="repair-list">
            <strong>Repairs</strong>
            {damaged.map((b) => (
              <div key={b.id} className="repair-row">
                <span>{b.definitionId} · {Math.round(b.condition)}%</span>
                {b.damageState === "REPAIRING" ? (
                  <small>{Math.ceil(b.repairRemainingSeconds)}s</small>
                ) : (
                  <button onClick={() => void command({ type:"REPAIR_BUILDING", payload:{buildingId:b.id} })}>
                    Repair
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {w.events.length > 0 && (
          <div className="event-log">
            <strong>Last event</strong>
            <small data-testid="event-summary">{w.events[w.events.length - 1]?.summary}</small>
          </div>
        )}
        <button
          className="danger"
          disabled={!!w.combat && w.combat.status !== "RESOLVED"}
          onClick={() => void command({ type:"TRIGGER_TEST_WAVE", payload:{} })}
        >
          Test surprise wave
        </button>
      </aside>

      <footer className="bottom-hint">
        {mode === "BUILD" && selectedBuild ? `Click near a road to place ${selectedBuild.name}.` :
         mode === "ROAD" ? (roadStart ? "Click road end point." : "Click an existing road end, then its destination.") :
         "Build, connect and watch the town live."}
        {message && <span className="error"> · {message}</span>}
      </footer>

      <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("evervale.owner");
          setOwnerId("");
          setView(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}
