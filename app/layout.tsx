"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Result = {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  traits: string[];
  message: string;
  advice: string;
};

function clean(s: string) {
  return (s ?? "").trim();
}

function vibeFromMood(mood: string) {
  const m = clean(mood).toLowerCase();
  const neg = ["つら", "辛", "しんど", "不安", "こわ", "怖", "泣", "焦", "イラ", "怒", "疲", "だる", "眠"];
  const pos = ["嬉", "うれ", "楽", "たの", "最高", "元気", "幸", "ワク", "わく", "やる", "燃"];
  if (neg.some((k) => m.includes(k.toLowerCase()))) return "shadow";
  if (pos.some((k) => m.includes(k.toLowerCase()))) return "light";
  return "neutral";
}

const RESULTS: Omit<Result, "message">[] = [
  {
    id: "aether",
    name: "エーテル",
    title: "エーテルの旅人",
    subtitle: "境界をすり抜け、兆しを拾う者",
    traits: ["直感が鋭い", "空気を読む", "変化に強い", "未知を楽しめる"],
    advice: "今日は“気配”を拾ったら即メモ。小さな一致が大きな導線になる。",
  },
  {
    id: "lumen",
    name: "ルーメン",
    title: "光紋の守護者",
    subtitle: "希望の火種を絶やさない者",
    traits: ["粘り強い", "人を照らす", "誠実", "回復力が高い"],
    advice: "小さくていい。1つ“完成”させると運が整う。",
  },
  {
    id: "noct",
    name: "ノクト",
    title: "夜帳の観測者",
    subtitle: "闇の中で真実を見抜く者",
    traits: ["洞察力", "冷静", "本質主義", "集中力"],
    advice: "静かな場所で10分だけ“整理”すると、次の一手が見える。",
  },
  {
    id: "ember",
    name: "エンバー",
    title: "残火の戦略家",
    subtitle: "燃える意志を“形”にする者",
    traits: ["実行力", "突破力", "決断が早い", "勝負強い"],
    advice: "今日の勝ちは“最初の一歩”。迷ったら着手が正解。",
  },
  {
    id: "mist",
    name: "ミスト",
    title: "霧祓いの導師",
    subtitle: "曖昧さを“詩”に変える者",
    traits: ["感受性", "共感力", "表現力", "柔軟性"],
    advice: "気分が揺れるほど作品が育つ。言語化は短文でOK。",
  },
  {
    id: "arc",
    name: "アーク",
    title: "聖円の裁定者",
    subtitle: "秩序を与え、流れを整える者",
    traits: ["整理整頓", "規律", "設計思考", "責任感"],
    advice: "今日の鍵は“ルールを1つ減らす”。シンプルが勝つ。",
  },
  {
    id: "seraph",
    name: "セラフ",
    title: "白翼の癒し手",
    subtitle: "言葉で人を救う者",
    traits: ["優しさ", "包容力", "対話力", "忍耐"],
    advice: "誰かのために動くと、自分の運も回復する。",
  },
  {
    id: "oracle",
    name: "オラクル",
    title: "予兆の解読者",
    subtitle: "未来の断片を読み解く者",
    traits: ["分析力", "仮説思考", "学習欲", "観察"],
    advice: "“なぜ？”を3回だけ。答えが出たら手を動かす。",
  },
  {
    id: "rift",
    name: "リフト",
    title: "裂け目の開拓者",
    subtitle: "道なき道を創る者",
    traits: ["冒険心", "独立心", "突破", "発明"],
    advice: "型を崩してOK。今日は“新ルート”が正解。",
  },
  {
    id: "bloom",
    name: "ブルーム",
    title: "花暦の編纂者",
    subtitle: "育てる力で世界を変える者",
    traits: ["継続力", "面倒見", "優先順位", "育成"],
    advice: "積み上げの勝利。小さな改善を1つ入れよう。",
  },
  {
    id: "iron",
    name: "アイアン",
    title: "鋼の誓約者",
    subtitle: "約束を守り抜く者",
    traits: ["信頼", "胆力", "責務", "持久"],
    advice: "今日は“守り”が攻めになる。丁寧にやれば勝てる。",
  },
  {
    id: "nova",
    name: "ノヴァ",
    title: "星火の点灯者",
    subtitle: "ゼロから火を起こす者",
    traits: ["創造性", "勢い", "企画力", "魅せ方"],
    advice: "まず魅せる。見せ方を整えると中身が追いつく。",
  },
  {
    id: "veil",
    name: "ヴェール",
    title: "秘匿の紡ぎ手",
    subtitle: "秘密と美学を抱く者",
    traits: ["美意識", "こだわり", "選球眼", "集中"],
    advice: "今日は“削る”ほど強くなる。余白が魔力になる。",
  },
  {
    id: "pulse",
    name: "パルス",
    title: "鼓動の召喚士",
    subtitle: "リズムで運命を動かす者",
    traits: ["行動の速さ", "テンポ", "切替", "適応"],
    advice: "短時間×回数で勝つ。25分だけ全力→休憩。",
  },
  {
    id: "mirror",
    name: "ミラー",
    title: "鏡界の審判",
    subtitle: "自分を映して真実を知る者",
    traits: ["自己理解", "客観性", "誠実", "修正力"],
    advice: "今の気分を否定しない。言葉にした瞬間、制御できる。",
  },
  {
    id: "crown",
    name: "クラウン",
    title: "王冠の構築者",
    subtitle: "世界を設計し、支配する者",
    traits: ["リーダー気質", "戦略", "意思", "統率"],
    advice: "今日は“決める日”。一つ決めたら、あとは流れる。",
  },
];

function pickResult(seed: string) {
  // 文字列ハッシュで固定っぽい結果（毎回同じ入力なら同じ結果に寄せる）
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % RESULTS.length;
  return RESULTS[idx];
}

function buildMessage(baseName: string, mood: string, r: Omit<Result, "message">) {
  const name = clean(baseName) || "あなた";
  const vibe = vibeFromMood(mood);

  const moodLine =
    clean(mood).length > 0
      ? `「${clean(mood)}」…その一言は、今の魂の温度をよく映している。`
      : "言葉がなくても大丈夫。魂はちゃんとサインを出している。";

  const vibeLine =
    vibe === "light"
      ? "光が強い日や。今は“進む”選択が運を開く。"
      : vibe === "shadow"
      ? "影が濃い日やな。無理に明るくせんでええ。“整える”だけで回復する。"
      : "揺らぎの中にいる。だからこそ“選ぶ”だけで未来が変わる。";

  const ritualLine = `水晶は告げる―― ${name} の属性は **${r.name}**。`;

  return [
    ritualLine,
    moodLine,
    vibeLine,
    `君の本質：${r.subtitle}`,
    `今日の指針：${r.advice}`,
  ].join("\n");
}

export default function Home() {
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const [isCasting, setIsCasting] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const sparkleKey = useRef(0);

  const isReady = useMemo(() => clean(name).length > 0 || clean(mood).length > 0, [name, mood]);

  function cast() {
    if (!isReady || isCasting) return;

    setIsCasting(true);

    // 水晶フラッシュ
    setFlash(true);
    window.setTimeout(() => setFlash(false), 220);

    // 少し溜めて結果表示
    window.setTimeout(() => {
      const base = pickResult(`${clean(name)}|${clean(mood)}`);
      const msg = buildMessage(name, mood, base);

      const full: Result = {
        ...base,
        message: msg,
      };

      setResult(full);

      // キラ粒を派手に舞わせる（毎回キー更新して再生成）
      sparkleKey.current += 1;
      setShowSparkles(false);
      requestAnimationFrame(() => {
        setShowSparkles(true);
        window.setTimeout(() => setShowSparkles(false), 1400);
      });

      setIsCasting(false);
    }, 520);
  }

  function reset() {
    setResult(null);
  }

  return (
    <div className="zs-root">
      {/* 背景画像（public/bg.jpg を置く想定） */}
      <div className="zs-bg" aria-hidden />
      {/* 霧（うっすら＋揺らぎ） */}
      <div className="zs-fog" aria-hidden />
      {/* 光のにじみ */}
      <div className="zs-glow" aria-hidden />

      {/* 中央水晶（public/crystal.png を置く想定） */}
      <div className={`zs-crystal ${flash ? "is-flash" : ""}`} aria-hidden>
        <div className="zs-crystalImg">
          <Image
            src="/crystal.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 560px, 860px"
            style={{ objectFit: "contain" }}
          />
        </div>
        {/* 中心発光（疑似） */}
        <div className="zs-crystalCore" />
      </div>

      <main className="zs-main">
        <header className="zs-header">
          <div className="zs-kicker">ZEON • SHINDAN</div>
          <h1 className="zs-title">魂の属性診断</h1>
          <p className="zs-subtitle">名と今の気分を入力せよ。結果はすでに内にある。</p>
        </header>

        <section className="zs-card" aria-live="polite">
          {!result ? (
            <>
              <div className="zs-fields">
                <label className="zs-label">
                  <span className="zs-labelText">あなたの名前（任意）</span>
                  <input
                    className="zs-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：ゼオン"
                    autoComplete="name"
                  />
                </label>

                <label className="zs-label">
                  <span className="zs-labelText">今の気分（ひとこと）</span>
                  <input
                    className="zs-input"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="例：憂鬱 / ワクワク / 眠い"
                  />
                </label>
              </div>

              <button
                className={`zs-btn ${isReady ? "" : "is-disabled"}`}
                onClick={cast}
                disabled={!isReady || isCasting}
              >
                {isCasting ? "儀式を進行中…" : "診断を起動する"}
              </button>

              <div className="zs-foot">© ZEON WORLD</div>
            </>
          ) : (
            <div className="zs-resultWrap">
              <div className="zs-resultHeader">
                <div className="zs-badge">RESULT</div>
                <div className="zs-resultTitle">
                  <span className="zs-resultName">{result.name}</span>
                  <span className="zs-resultRole">{result.title}</span>
                </div>
              </div>

              <div className="zs-resultBody">
                <p className="zs-resultSub">{result.subtitle}</p>

                <div className="zs-traits">
                  {result.traits.map((t) => (
                    <span key={t} className="zs-chip">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="zs-message">
                  {result.message.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="zs-actions">
                  <button className="zs-btn zs-btnSecondary" onClick={reset}>
                    もう一度
                  </button>
                </div>
              </div>

              <div className="zs-foot">© ZEON WORLD</div>

              {/* キラ粒（派手） */}
              {showSparkles && (
                <Sparkles
                  key={`sparkles-${sparkleKey.current}`}
                  density={86}
                />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Sparkles({ density = 70 }: { density?: number }) {
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < density; i++) {
      const left = Math.random() * 100;
      const size = 2 + Math.random() * 6;
      const delay = Math.random() * 0.45;
      const dur = 0.7 + Math.random() * 0.8;
      const drift = (Math.random() - 0.5) * 240; // 横に流れる
      const rot = Math.random() * 360;
      const type = Math.random() < 0.28 ? "star" : "dot";
      arr.push({ left, size, delay, dur, drift, rot, type, id: `${i}-${left}-${size}` });
    }
    return arr;
  }, [density]);

  return (
    <div className="zs-sparkles" aria-hidden>
      {items.map((p) => (
        <span
          key={p.id}
          className={`zs-spark ${p.type === "star" ? "is-star" : ""}`}
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              ["--drift" as any]: `${p.drift}px`,
              ["--rot" as any]: `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
