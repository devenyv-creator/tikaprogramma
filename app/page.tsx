"use client";

import { CSSProperties, useEffect, useState } from "react";

const SECRET_CODE = "ERROR";
const START_TIME = 60 * 60;

type Phase =
  | "idle"
  | "denied"
  | "granted"
  | "override"
  | "decrypt"
  | "disable"
  | "blackout"
  | "success";

export default function Home() {
  const [code, setCode] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);

  const processing = ["granted", "override", "decrypt", "disable", "blackout"].includes(phase);
  const success = phase === "success";

  useEffect(() => {
    if (!started || paused || success || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => Math.max(time - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
 }, [started, paused, success, timeLeft]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

function startTimer() {
  if (!started) {
    setStarted(true);
    setPaused(false);
    return;
  }

  setPaused((p) => !p);
}

  function checkCode() {
    if (processing) return;

    if (code.trim().toUpperCase() !== SECRET_CODE) {
      setPhase("denied");
      return;
    }

    setPhase("granted");
    setTimeout(() => setPhase("override"), 900);
    setTimeout(() => setPhase("decrypt"), 1800);
    setTimeout(() => setPhase("disable"), 2700);
    setTimeout(() => setPhase("blackout"), 3600);
    setTimeout(() => setPhase("success"), 4700);
  }

  function reset() {
    setCode("");
    setPhase("idle");
  }

  const overlayText: Partial<Record<Phase, string>> = {
    granted: "ACCESS GRANTED",
    override: "OVERRIDE ACCEPTED",
    decrypt: "DECRYPTING CORE...",
    disable: "DISABLING AI...",
  };

  return (
    <main style={success ? styles.pageSuccess : styles.page}>
      <style>{`
        @keyframes pulseRed {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: .68; }
        }

        @keyframes pulseGreen {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: .72; }
        }

        @keyframes flicker {
          0%,100% { opacity: 1; }
          45% { opacity: .85; }
          48% { opacity: .28; }
          52% { opacity: 1; }
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
        }

        @keyframes scan {
          0% { transform: translateY(-120%); opacity: 0; }
          25% { opacity: .75; }
          100% { transform: translateY(120%); opacity: 0; }
        }

        @keyframes hexRain {
          0% { transform: translateY(-18px); opacity: .18; }
          50% { opacity: .75; }
          100% { transform: translateY(18px); opacity: .18; }
        }
      `}</style>

      <div style={styles.scanlines} />

      <section
        style={{
          ...styles.shell,
          ...(phase === "denied" ? styles.shake : {}),
          ...(success ? styles.shellSuccess : {}),
        }}
      >
        {!success && (
          <button
            style={
  !started
    ? styles.signal
    : paused
    ? styles.signalPaused
    : styles.signalActive
}
            onClick={startTimer}
            aria-label="Start aftelling"
            title="Start aftelling"
          >
            <span
  style={
    !started
      ? styles.signalDot
      : paused
      ? styles.signalDotPaused
      : styles.signalDotActive
  }
/>
          </button>
        )}

        {!success ? (
          <>
            <header style={styles.header}>
              <div style={started ? styles.connectionActive : styles.connection}>
                ● VERBINDING: {started ? "ACTIEF" : "INACTIEF"}
              </div>
              <div style={styles.hint}>tik op het signaal om de aftelling te starten</div>
            </header>

            <h1 style={styles.title}>INBRAAK OP SUPERSYSTEEM</h1>
            <p style={styles.subtitle}>verbinding met centrale supercomputer</p>

            <div style={started ? styles.timerActive : styles.timer}>
              {formatTime(timeLeft)}
            </div>

            <div style={styles.timerLabels}>
              <span>MINUTEN</span>
              <span>SECONDEN</span>
            </div>

            <div style={styles.grid}>
              <section>
                <div style={styles.authHeader}>
                  <span>AUTHENTICATIE</span>
                  <span style={styles.green}>// OVERRIDE PROTOCOL</span>
                </div>

                <div style={styles.authBox}>
                  <div style={styles.tokenTitle}>OVERRIDE TOKEN</div>

                  <div style={styles.inputRow}>
                    <span style={styles.prompt}>&gt;</span>
                    <input
                      style={phase === "denied" ? styles.inputDenied : styles.input}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && checkCode()}
                      placeholder="voer code in..."
                      autoCapitalize="characters"
                      autoComplete="off"
                      disabled={processing}
                    />
                  </div>

                  <button style={styles.actionButton} onClick={checkCode} disabled={processing}>
                    INJECT OVERRIDE ›
                  </button>

                  {phase === "denied" && (
                    <p style={styles.deniedText}>ACCESS DENIED — verkeerde token</p>
                  )}
                </div>

                {phase === "denied" && (
                  <button style={styles.resetButton} onClick={reset}>
                    
                  </button>
                )}
              </section>

              <aside style={styles.rightColumn}>
                <div style={styles.boxLabel}>PROTOCOL INFO</div>
                <p style={styles.infoLine}>toegang: beperkt</p>
                <p style={styles.infoLine}>encryptie: actief</p>
                <p style={styles.infoLine}>firewall: maximaal</p>
                <div style={styles.warning}>⚠ TIJDSTOP-PROTOCOL ACTIEF</div>
              </aside>
            </div>

            {processing && phase !== "blackout" && (
              <div style={styles.overlay}>
                <div style={styles.scanBeam} />
                <pre style={styles.hexRain}>
                  4F 56 45 52 52 49 44 45 20 43 4F 52 45{"\n"}
                  41 43 43 45 53 53 20 47 52 41 4E 54 45 44{"\n"}
                  53 48 55 54 44 4F 57 4E 20 53 45 51
                </pre>
                <div style={styles.overlayMain}>{overlayText[phase]}</div>
                <div style={styles.overlaySub}>kern wordt overschreven...</div>
              </div>
            )}

            {phase === "blackout" && <div style={styles.blackout} />}
          </>
        ) : (
          <section style={styles.successScreen}>
            <div style={styles.successSmall}>OVERRIDE COMPLETE</div>
            <h1 style={styles.successTitle}>SUPERCOMPUTER UITGESCHAKELD</h1>
            <div style={styles.check}>✓</div>
            <p style={styles.successText}>
              De overname is tegengehouden.
              <br />
              De tijd loopt weer door.
            </p>
            <button style={styles.resetButtonSuccess} onClick={reset}>
              OK
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    background: "radial-gradient(circle at center, #210000, #020202 55%, #000)",
    color: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    fontFamily: "Consolas, Monaco, monospace",
  },
  pageSuccess: {
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    background: "radial-gradient(circle at center, #00451d, #020905 55%, #000)",
    color: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    fontFamily: "Consolas, Monaco, monospace",
  },
  scanlines: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "repeating-linear-gradient(0deg, rgba(255,255,255,.035), rgba(255,255,255,.035) 1px, transparent 1px, transparent 5px)",
    opacity: 0.22,
  },
  shell: {
    position: "relative",
    width: "100%",
    maxWidth: 1200,
    height: 760,
    margin: "0 auto",
    border: "1px solid rgba(255,40,40,.75)",
    borderRadius: 12,
    background: "rgba(0,0,0,.78)",
    boxShadow: "0 0 36px rgba(255,0,0,.22)",
    padding: "24px 32px",
    textAlign: "center",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  shellSuccess: {
    border: "1px solid rgba(70,255,120,.85)",
    boxShadow: "0 0 42px rgba(0,255,100,.28)",
  },
  shake: {
    animation: "shake .3s ease-in-out",
  },
  header: {
    height: 42,
    textAlign: "left",
  },
  connection: {
    color: "#ff3b3b",
    letterSpacing: 3,
    fontSize: 14,
  },
  connectionActive: {
    color: "#48ff76",
    letterSpacing: 3,
    fontSize: 14,
  },
  signalDotPaused: {
  display: "block",
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#ffd000",
  boxShadow: "0 0 20px #ffd000",
  margin: "24px auto",
},
  hint: {
    marginTop: 7,
    color: "rgba(255,255,255,.48)",
    letterSpacing: 2,
    fontSize: 11,
  },
  signal: {
    position: "absolute",
    top: 24,
    right: 32,
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "1px solid rgba(255,50,50,.75)",
    background: "transparent",
    cursor: "pointer",
    animation: "pulseRed 1.5s infinite",
  },
  signalActive: {
    position: "absolute",
    top: 24,
    right: 32,
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "1px solid rgba(72,255,118,.85)",
    background: "transparent",
    cursor: "pointer",
    animation: "pulseGreen 1.5s infinite",
  },
  signalDot: {
    display: "block",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#ff3030",
    boxShadow: "0 0 22px #ff3030",
    margin: "24px auto",
  },
  signalDotActive: {
    display: "block",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#48ff76",
    boxShadow: "0 0 22px #48ff76",
    margin: "24px auto",
  },
  title: {
    margin: "18px 0 6px",
    color: "#ff3030",
    fontSize: "clamp(34px, 3.7vw, 48px)",
    letterSpacing: 7,
    lineHeight: 1,
    textShadow: "0 0 18px rgba(255,0,0,.85)",
    animation: "flicker 4s infinite",
  },
  subtitle: {
    margin: 0,
    color: "rgba(255,255,255,.62)",
    letterSpacing: 4,
    fontSize: 15,
  },
  signalPaused: {
  position: "absolute",
  top: 24,
  right: 32,
  width: 72,
  height: 72,
  borderRadius: "50%",
  border: "1px solid rgba(255,210,0,.9)",
  background: "transparent",
  cursor: "pointer",
},
  timer: {
    margin: "16px 0 0",
    color: "rgba(255,45,45,.55)",
    fontSize: "clamp(68px, 7vw, 100px)",
    lineHeight: 1,
  },
  timerActive: {
    margin: "16px 0 0",
    color: "#ff2424",
    fontSize: "clamp(68px, 7vw, 100px)",
    lineHeight: 1,
    textShadow: "0 0 26px rgba(255,0,0,1)",
    animation: "pulseRed 2s infinite",
  },
  timerLabels: {
    width: 360,
    maxWidth: "70%",
    margin: "4px auto 20px",
    display: "flex",
    justifyContent: "space-between",
    color: "#ff3030",
    fontSize: 12,
    letterSpacing: 3,
  },
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 250px",
    gap: 24,
    alignItems: "start",
  },
  authHeader: {
    display: "flex",
    gap: 16,
    marginBottom: 8,
    color: "rgba(255,255,255,.58)",
    fontSize: 13,
    letterSpacing: 2,
  },
  green: {
    color: "#2cff59",
  },
  authBox: {
    border: "1px solid rgba(44,255,89,.7)",
    borderRadius: 8,
    background: "rgba(0,35,10,.3)",
    boxShadow: "0 0 18px rgba(0,255,80,.12)",
    padding: "18px 24px",
  },
  tokenTitle: {
    color: "#48ff76",
    fontSize: 25,
    letterSpacing: 4,
    textAlign: "left",
    marginBottom: 12,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  prompt: {
    color: "#48ff76",
    fontSize: 36,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: "12px 16px",
    color: "#48ff76",
    background: "rgba(0,0,0,.82)",
    border: "1px solid #48ff76",
    borderRadius: 6,
    outline: "none",
    fontSize: 22,
    fontFamily: "Consolas, Monaco, monospace",
  },
  inputDenied: {
    flex: 1,
    minWidth: 0,
    padding: "12px 16px",
    color: "#ff5555",
    background: "rgba(0,0,0,.82)",
    border: "1px solid #ff3333",
    borderRadius: 6,
    outline: "none",
    fontSize: 22,
    fontFamily: "Consolas, Monaco, monospace",
  },
  actionButton: {
    marginTop: 16,
    padding: "11px 36px",
    color: "#f2f2f2",
    background: "rgba(0,80,20,.65)",
    border: "1px solid #48ff76",
    borderRadius: 6,
    fontSize: 18,
    letterSpacing: 3,
    cursor: "pointer",
    fontFamily: "Consolas, Monaco, monospace",
  },
  deniedText: {
    margin: "12px 0 0",
    color: "#ff5555",
    fontSize: 14,
    letterSpacing: 2,
  },
  rightColumn: {
    border: "1px solid rgba(255,255,120,.35)",
    borderRadius: 8,
    background: "rgba(0,0,0,.36)",
    padding: "16px 18px",
    textAlign: "left",
    alignSelf: "start",
    height: "fit-content",
    marginTop: 28,
  },
  boxLabel: {
    marginBottom: 8,
    color: "rgba(255,255,255,.5)",
    letterSpacing: 2,
    fontSize: 11,
  },
  infoLine: {
    margin: "6px 0",
    color: "#48ff76",
    fontSize: 14,
  },
  warning: {
    marginTop: 18,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,.18)",
    color: "#ff4646",
    fontSize: 15,
    lineHeight: 1.4,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    borderRadius: 12,
    background: "rgba(0,0,0,.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scanBeam: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 150,
    background: "linear-gradient(180deg, transparent, rgba(72,255,118,.22), transparent)",
    animation: "scan 1.1s infinite",
  },
  hexRain: {
    position: "absolute",
    color: "rgba(72,255,118,.28)",
    fontSize: 18,
    lineHeight: 1.7,
    animation: "hexRain .7s infinite",
  },
  overlayMain: {
    position: "relative",
    color: "#48ff76",
    fontSize: "clamp(42px, 7vw, 86px)",
    letterSpacing: 6,
    textShadow: "0 0 30px rgba(0,255,80,.95)",
  },
  overlaySub: {
    position: "relative",
    marginTop: 20,
    color: "#fff",
    fontSize: "clamp(18px, 2.6vw, 30px)",
    letterSpacing: 4,
  },
  blackout: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    background: "#000",
  },
  successScreen: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  successSmall: {
    color: "#48ff76",
    letterSpacing: 5,
    fontSize: 18,
  },
  successTitle: {
    margin: "22px 0 16px",
    color: "#48ff76",
    fontSize: "clamp(40px, 6.5vw, 78px)",
    letterSpacing: 5,
    lineHeight: 1,
    textShadow: "0 0 30px rgba(0,255,80,.95)",
  },
  check: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "4px solid #48ff76",
    color: "#48ff76",
    fontSize: 76,
    lineHeight: "102px",
    boxShadow: "0 0 34px rgba(0,255,90,.7)",
  },
  successText: {
    marginTop: 18,
    color: "#f2f2f2",
    fontSize: 22,
    lineHeight: 1.45,
  },
  resetButton: {
    marginTop: 12,
    padding: "6px 28px",
    color: "#f4f4f4",
    background: "rgba(0,0,0,.45)",
    border: "1px solid rgba(255,255,255,.45)",
    borderRadius: 4,
    fontSize: 13,
    letterSpacing: 3,
    cursor: "pointer",
    fontFamily: "Consolas, Monaco, monospace",
  },
  resetButtonSuccess: {
    marginTop: 18,
    padding: "7px 34px",
    color: "#f4f4f4",
    background: "rgba(0,0,0,.45)",
    border: "1px solid rgba(255,255,255,.45)",
    borderRadius: 4,
    fontSize: 13,
    letterSpacing: 3,
    cursor: "pointer",
    fontFamily: "Consolas, Monaco, monospace",
  },
};