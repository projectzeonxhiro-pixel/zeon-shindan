"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { pickDiagnosis } from "./lib/diagnosis";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");

  const canGo = useMemo(() => true, []); // 空でも動くようにしてる（任意で必須にしてOK）

  const onStart = () => {
    const { d, name: n, mood: m } = pickDiagnosis(name, mood);
    const qp = new URLSearchParams({
      id: d.id,
      name: n,
      mood: m,
    });
    router.push(`/result?${qp.toString()}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "radial-gradient(1200px 800px at 50% 20%, rgba(120,80,255,0.25), rgba(0,0,0,0.92))",
        color: "white",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ width: "min(920px, 96vw)" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ letterSpacing: 3, opacity: 0.85, fontSize: 12 }}>ZEON • SHINDAN</div>
          <h1 style={{ margin: "10px 0 6px", fontSize: 44, fontWeight: 900 }}>魂の属性診断</h1>
          <p style={{ opacity: 0.85 }}>名と今の気分を入力せよ。結果はすでに内にある。</p>
        </div>

        <div
          style={{
            borderRadius: 28,
            background: "rgba(10,10,18,0.55)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
            padding: 22,
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなたの名前（任意）"
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              outline: "none",
              fontSize: 16,
            }}
          />

          <div style={{ height: 14 }} />

          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="今の気分（ひとこと）"
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              outline: "none",
              fontSize: 16,
            }}
          />

          <div style={{ height: 16 }} />

          <button
            disabled={!canGo}
            onClick={onStart}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              background: "rgba(120,95,255,0.95)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              fontWeight: 900,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            診断を起動する
          </button>

          <div style={{ marginTop: 18, textAlign: "center", fontSize: 12, opacity: 0.7 }}>© ZEON WORLD</div>
        </div>
      </div>
    </div>
  );
}
