"use client";

import { useState } from "react";

type Result = {
  title: string;
  subtitle: string;
  message: string;
};

const RESULTS: Result[] = [
  {
    title: "黒曜の観測者",
    subtitle: "静寂の中で真実を見抜く者",
    message:
      "あなたは感情よりも兆しを読むタイプ。今は動くより整える時期。情報を減らし、静かな時間を持つことで運命の歯車が噛み合い始めます。",
  },
  {
    title: "蒼光の解放者",
    subtitle: "停滞を断ち切る行動の化身",
    message:
      "迷いは行動によってのみ晴れる。完璧を待たず、まず一歩。あなたの選択が流れを生み、周囲をも動かします。",
  },
  {
    title: "金環の癒し手",
    subtitle: "光で世界を包む存在",
    message:
      "与えすぎています。今日は自分を優先してください。休息と安心が、あなた本来の力を取り戻します。",
  },
  {
    title: "紫霧の詠み手",
    subtitle: "未来を言葉にする者",
    message:
      "直感が冴えています。思いついた言葉や映像を記録してください。それは未来からのメッセージです。",
  },
];

function pickResult(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return RESULTS[hash % RESULTS.length];
}

export default function Home() {
  const [name, setName] = useState("");
  const [feeling, setFeeling] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const diagnose = () => {
    const seed = `${name}-${feeling}`;
    setResult(pickResult(seed));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-8">
        <header className="text-center space-y-2">
          <p className="text-sm tracking-widest text-indigo-300">
            ZEON • SHINDAN
          </p>
          <h1 className="text-3xl font-bold">魂の属性診断</h1>
          <p className="text-white/70 text-sm">
            名と今の気分を入力せよ。結果はすでに内にある。
          </p>
        </header>

        {!result && (
          <div className="space-y-4">
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="あなたの名前（任意）"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="今の気分（ひとこと）"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
            <button
              onClick={diagnose}
              className="w-full rounded-xl bg-indigo-500 py-3 font-semibold hover:bg-indigo-600 transition"
            >
              診断を起動する
            </button>
          </div>
        )}

        {result && (
          <div className="rounded-2xl bg-white/5 p-6 space-y-4 border border-white/10">
            <h2 className="text-2xl font-bold text-center">
              {result.title}
            </h2>
            <p className="text-center text-indigo-300 text-sm">
              {result.subtitle}
            </p>
            <p className="text-white/80 leading-relaxed">
              {result.message}
            </p>
            <button
              onClick={() => setResult(null)}
              className="mt-4 w-full rounded-xl bg-white/10 py-2 text-sm hover:bg-white/20 transition"
            >
              もう一度診断する
            </button>
          </div>
        )}

        <footer className="text-center text-xs text-white/40">
          © ZEON WORLD
        </footer>
      </div>
    </main>
  );
}
