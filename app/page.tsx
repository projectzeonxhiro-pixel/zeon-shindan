"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Archetype = {
  key: string;
  title: string;
  short: string;
  vibe: string[];
  message: (name: string, mood: string) => string;
  advice: (mood: string) => string;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeName(name: string) {
  const t = (name || "").trim();
  return t.length ? t : "あなた";
}

function moodFlavor(moodRaw: string) {
  const mood = (moodRaw || "").trim();
  const m = mood.toLowerCase();

  // ゆる判定：気分の文字からトーンを少し変える
  const isDown =
    /つら|疲|しんど|不安|泣|萎|だる|眠|重|落|きつ|うつ|寂|こわ|嫌|焦/.test(mood) ||
    /(tired|sad|down|anx|anxiety|fear|lonely|depressed)/.test(m);

  const isUp =
    /嬉|楽|最高|やる気|元気|燃|ワク|幸|いい感じ|上げ|勝|強|自信/.test(mood) ||
    /(happy|excited|great|motivated|confident|win)/.test(m);

  const isCalm =
    /穏|落ち着|静|整|瞑想|ゆったり|平和|眠い/.test(mood) ||
    /(calm|peace|relax|chill|zen)/.test(m);

  return {
    mood,
    tone: isDown ? "down" : isUp ? "up" : isCalm ? "calm" : "neutral",
  } as const;
}

const ARCHETYPES: Archetype[] = [
  {
    key: "astral",
    title: "アストラルの観測者",
    short: "見えない流れを読む者",
    vibe: ["静かな洞察", "直感", "余白の強さ"],
    message: (name, mood) =>
      `${name}の魂は“観測者”。今の気分「${mood}」は、世界のノイズをふるいにかける合図。答えは外じゃなく、あなたの“間(ま)”にある。`,
    advice: (mood) => `まずは3分だけ、呼吸を数えよ。${mood ? `「${mood}」` : "今の感覚"}を否定せず、そのまま置く。`,
  },
  {
    key: "oracle",
    title: "紫焔のオラクル",
    short: "未来を言語化する者",
    vibe: ["言葉の魔術", "決断", "予兆"],
    message: (name, mood) =>
      `${name}は“オラクル”。「${mood}」は未来の予告編。言葉にした瞬間、運命は一段クリアになる。`,
    advice: () => "やることを一つだけ短文で書け。『今日、私は◯◯する』—それが儀式になる。",
  },
  {
    key: "warden",
    title: "境界の守護者",
    short: "守るべき線を引く者",
    vibe: ["防御", "秩序", "誠実"],
    message: (name, mood) =>
      `${name}は“守護者”。「${mood}」は境界線を整えるサイン。守ると決めた瞬間、力は戻る。`,
    advice: () => "予定を一つ減らし、集中の結界を張れ。『今はここまで』と宣言せよ。",
  },
  {
    key: "alchemist",
    title: "夜霧の錬金術師",
    short: "感情を力へ変える者",
    vibe: ["変換", "創造", "再構築"],
    message: (name, mood) =>
      `${name}は“錬金”。「${mood}」は材料にすぎない。混ぜ、熱し、形にすれば、それは武器になる。`,
    advice: () => "5分だけ手を動かせ。下書きでもいい。完成は後から追いつく。",
  },
  {
    key: "pilgrim",
    title: "蒼輪の巡礼者",
    short: "歩みで道を開く者",
    vibe: ["継続", "粘り", "芯の強さ"],
    message: (name, mood) =>
      `${name}は“巡礼”。「${mood}」は進路の微調整。遠回りに見える一歩が、実は最短になる。`,
    advice: () => "今日の“最小の一歩”を決めよ。小さく確実に進め。",
  },
  {
    key: "mirage",
    title: "蜃気楼の演出家",
    short: "空気を変える者",
    vibe: ["魅せ方", "ムード", "導線"],
    message: (name, mood) =>
      `${name}は“演出”。「${mood}」は舞台装置。照明を変えれば、同じ物語でも景色は変わる。`,
    advice: () => "環境を一箇所だけ整えよ。机、音、光。外を変えると内も動く。",
  },
  {
    key: "cipher",
    title: "星屑の暗号士",
    short: "パターンを解く者",
    vibe: ["分析", "構造", "勝ち筋"],
    message: (name, mood) =>
      `${name}は“暗号”。「${mood}」はヒント。複雑なものほど、鍵は単純な場所に隠れている。`,
    advice: () => "問題を3行に要約せよ。『何が起きてる/何が欲しい/次に何する』だけでOK。",
  },
  {
    key: "tempest",
    title: "雷鳴の突撃者",
    short: "停滞を破る者",
    vibe: ["突破", "勢い", "起爆"],
    message: (name, mood) =>
      `${name}は“雷鳴”。「${mood}」は助走。迷いは“着火前の静電気”だ。`,
    advice: () => "1回だけ全力で手を動かせ。勢いが次の勢いを呼ぶ。",
  },
  {
    key: "healer",
    title: "月光の癒し手",
    short: "整え、回復させる者",
    vibe: ["回復", "優しさ", "再起"],
    message: (name, mood) =>
      `${name}は“月光”。「${mood}」は回復の要求。強さは休むことで増える。`,
    advice: () => "水を飲め。背筋を伸ばせ。まず身体を味方に戻す。",
  },
  {
    key: "anchor",
    title: "深海のアンカー",
    short: "ブレない軸を持つ者",
    vibe: ["安定", "信念", "持久"],
    message: (name, mood) =>
      `${name}は“深海”。「${mood}」は上の波。深い場所のあなたは、揺れていない。`,
    advice: () => "自分の価値観を一言で言え。『私は◯◯を大事にする』それが錨になる。",
  },
  {
    key: "sparrow",
    title: "黒翼の斥候",
    short: "先に危険を察知する者",
    vibe: ["危機察知", "準備", "最適化"],
    message: (name, mood) =>
      `${name}は“斥候”。「${mood}」は警報ではなく、準備の才能。先読みがあなたを守る。`,
    advice: () => "不安を“準備”に変換せよ。やることを2つだけチェックリスト化。",
  },
  {
    key: "librarian",
    title: "禁書庫の司書",
    short: "知を積み上げる者",
    vibe: ["学習", "探究", "体系化"],
    message: (name, mood) =>
      `${name}は“司書”。「${mood}」は知識のページがめくれる音。学びは運命を上書きする。`,
    advice: () => "10分だけ調べて、1行だけまとめよ。積み上げは速い。",
  },
  {
    key: "artisan",
    title: "銀糸の職人",
    short: "細部で世界を変える者",
    vibe: ["丁寧", "品質", "仕上げ"],
    message: (name, mood) =>
      `${name}は“職人”。「${mood}」は仕上げの合図。最後の1%が、印象の90%を決める。`,
    advice: () => "細部を1つだけ磨け。フォント、余白、言葉。世界が締まる。",
  },
  {
    key: "jester",
    title: "笑いの化身",
    short: "闇に光を差す者",
    vibe: ["ユーモア", "軽さ", "転換"],
    message: (name, mood) =>
      `${name}は“笑い”。「${mood}」は重さの兆候。笑いは逃げじゃない、転換の魔法。`,
    advice: () => "好きな曲を1曲流せ。気分を動かす最短ルートは音だ。",
  },
  {
    key: "phoenix",
    title: "灰からのフェニックス",
    short: "何度でも立ち上がる者",
    vibe: ["再生", "復活", "強運"],
    message: (name, mood) =>
      `${name}は“再生”。「${mood}」は終わりじゃない。燃えた分だけ、次は高く飛ぶ。`,
    advice: () => "終わらせることを1つ決めよ。終わりは始まりのスイッチだ。",
  },
  {
    key: "navigator",
    title: "星航のナビゲーター",
    short: "道筋を描く者",
    vibe: ["方向性", "戦略", "地図"],
    message: (name, mood) =>
      `${name}は“航海”。「${mood}」は羅針盤。目的地がブレなければ、風は味方になる。`,
    advice: () => "ゴールを1行で書き、次の一手を1行で書け。地図はそれで完成。",
  },
  {
    key: "veil",
    title: "紫紗の結界師",
    short: "気配を操る者",
    vibe: ["気配", "空間", "浄化"],
    message: (name, mood) =>
      `${name}は“結界”。「${mood}」は空間調律。あなたが整えば、周囲も静かに従う。`,
    advice: () => "画面の通知を切れ。部屋の光を少し落とせ。結界は環境から。",
  },
  {
    key: "chronos",
    title: "時渡りのクロノス",
    short: "タイミングを読む者",
    vibe: ["好機", "待つ力", "着手"],
    message: (name, mood) =>
      `${name}は“時間”。「${mood}」は合図。今は攻める時か、育てる時か—あなたはわかっている。`,
    advice: () => "今やるべきは『準備/実行/休息』どれか1つ。選んだら迷いは消える。",
  },
  {
    key: "nebula",
    title: "星雲のドリーマー",
    short: "夢を現実へ落とす者",
    vibe: ["発想", "物語", "拡張"],
    message: (name, mood) =>
      `${name}は“星雲”。「${mood}」は着火前のもや。もやは可能性の形だ。`,
    advice: () => "アイデアを3つだけ箇条書き。1つ選んで小さく作れ。",
  },
];

export default function Page() {
  const [name, setName] = useState("");
  const [moodInput, setMoodInput] = useState("");
  const [result, setResult] = useState<Archetype | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [flash, setFlash] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);

  const { tone, mood } = moodFlavor(moodInput);

  const disabled = useMemo(() => {
    // 名前なくてもOK、気分だけでもOK。両方空ならボタン無効にする
    const n = name.trim().length;
    const m = moodInput.trim().length;
    return n === 0 && m === 0;
  }, [name, moodInput]);

  const sparkRef = useRef<HTMLDivElement | null>(null);

  function runDiagnosis() {
    if (disabled) return;

    const n = normalizeName(name);
    const mf = moodFlavor(moodInput);

    // トーンに合わせて少し選び方を寄せる（完全ランダムより“それっぽい”）
    const pool =
      mf.tone === "down"
        ? ["healer", "anchor", "veil", "phoenix", "warden"]
        : mf.tone === "up"
        ? ["tempest", "oracle", "navigator", "mirage", "alchemist"]
        : mf.tone === "calm"
        ? ["astral", "veil", "anchor", "librarian", "artisan"]
        : ["astral", "oracle", "alchemist", "navigator", "nebula", "cipher", "phoenix"];

    const chosenKey = Math.random() < 0.75 ? pick(pool) : pick(ARCHETYPES).key;
    const chosen = ARCHETYPES.find((a) => a.key === chosenKey) ?? pick(ARCHETYPES);

    // 演出：水晶フラッシュ + キラ粒派手 + 結果カード表示
    setFlash(true);
    setSparkKey((k) => k + 1);
    setIsRevealing(true);

    // フラッシュは短く
    window.setTimeout(() => setFlash(false), 280);

    // 結果表示は少し溜める（儀式感）
    window.setTimeout(() => {
      setResult(chosen);
      setIsRevealing(false);
    }, 520);
  }

  const displayName = normalizeName(name);
  const moodText = mood || "いまここ";

  // 「気分」で最後の一言を微調整
  const tailLine = useMemo(() => {
    if (tone === "down") return "大丈夫。今日は“守り”で勝てる日。";
    if (tone === "up") return "その勢いは本物。今夜、扉が開く。";
    if (tone === "calm") return "静けさは強さ。今のあなたは整っている。";
    return "合図は揃った。あとは、踏み出すだけ。";
  }, [tone]);

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden">
      {/* 背景：画像 + 色味 + 霧 */}
      <div className="absolute inset-0 -z-20">
        {/* 背景画像（public/bg.jpg） */}
        <div className="absolute inset-0">
          <Image
            src="/bg.jpg"
            alt="mystic background"
            fill
            priority
            className="object-cover"
          />
          {/* くっきり寄り：少し暗く+彩度/コントラスト */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2b1e59]/35 via-[#0a1022]/35 to-black/60" />
          <div className="absolute inset-0 backdrop-blur-[1.5px]" />
        </div>

        {/* 霧レイヤー（ゆっくり揺れる） */}
        <div className="mist mistA" />
        <div className="mist mistB" />
        <div className="mist mistC" />
      </div>

      {/* 水晶（中心発光 + 儀式フラッシュ） */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className={`crystalWrap ${flash ? "flash" : ""}`}>
          <Image
            src="/crystal.png"
            alt="crystal"
            width={820}
            height={820}
            className="crystalImg"
            priority
          />
          <div className="crystalGlowCore" />
          <div className="crystalGlowRing" />
        </div>
      </div>

      {/* キラ粒（結果出るときに派手に） */}
      <div
        key={sparkKey}
        ref={sparkRef}
        className={`sparks ${result || isRevealing ? "on" : ""}`}
        aria-hidden
      >
        {Array.from({ length: 42 }).map((_, i) => (
          <span
            key={i}
            className="spark"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 500}ms`,
              animationDuration: `${900 + Math.random() * 900}ms`,
              transform: `translate3d(0,0,0) scale(${0.6 + Math.random() * 1.3})`,
              opacity: 0.25 + Math.random() * 0.45,
            }}
          />
        ))}
      </div>

      {/* UI */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <header className="text-center">
            <div className="tracking-[0.35em] text-white/70 text-sm md:text-base">
              ZEON・SHINDAN
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
              魂の属性診断
            </h1>
            <p className="mt-4 text-white/75">
              名と今の気分を入力せよ。結果はすでに内にある。
            </p>
          </header>

          <section className="mt-10">
            <div className="panel">
              <div className="space-y-5">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="あなたの名前（任意）"
                  className="field"
                />
                <input
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="今の気分（ひとこと）"
                  className="field"
                />

                <button
                  onClick={runDiagnosis}
                  disabled={disabled || isRevealing}
                  className={`btn ${disabled ? "disabled" : ""}`}
                >
                  {isRevealing ? "儀式を進行中…" : "診断を起動する"}
                </button>

                <div className="text-center text-white/45 text-xs">
                  © ZEON WORLD
                </div>
              </div>
            </div>
          </section>

          {/* 結果カード */}
          {result && (
            <section className="mt-10">
              <div className="resultCard">
                <div className="resultTop">
                  <div className="badge">RESULT</div>
                  <div className="resultTitle">{result.title}</div>
                  <div className="resultSub">{result.short}</div>
                </div>

                <div className="resultBody">
                  <p className="resultMsg">
                    {result.message(displayName, moodText)}
                  </p>

                  <div className="chips">
                    {result.vibe.map((v) => (
                      <span key={v} className="chip">
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="advice">
                    <div className="adviceLabel">今日の一言</div>
                    <div className="adviceText">{result.advice(moodText)}</div>
                  </div>

                  <div className="tail">{tailLine}</div>

                  <div className="actions">
                    <button
                      className="btnSecondary"
                      onClick={() => {
                        // もう一回：キラ粒&フラッシュだけ
                        setResult(null);
                        setTimeout(() => runDiagnosis(), 120);
                      }}
                    >
                      もう一度診断
                    </button>

                    <button
                      className="btnSecondary"
                      onClick={() => {
                        const text =
                          `【ZEON・SHINDAN】\n` +
                          `${displayName}：${result.title}\n\n` +
                          result.message(displayName, moodText) +
                          `\n\n#魂の属性診断 #ZEON_SHINDAN`;
                        navigator.clipboard?.writeText(text);
                      }}
                    >
                      結果をコピー
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* styles */}
      <style jsx global>{`
        :root{
          --panel: rgba(20, 20, 34, 0.38);
          --panel2: rgba(10, 10, 18, 0.35);
          --stroke: rgba(255,255,255,0.14);
          --stroke2: rgba(142, 109, 255, 0.32);
          --accent: #6a5cff;
          --accent2: #8f6dff;
        }

        /* 霧 */
        .mist{
          position:absolute;
          inset:-20%;
          background:
            radial-gradient(closest-side, rgba(255,255,255,0.12), rgba(255,255,255,0) 70%),
            radial-gradient(closest-side, rgba(140,110,255,0.20), rgba(140,110,255,0) 68%),
            radial-gradient(closest-side, rgba(120,210,255,0.10), rgba(120,210,255,0) 72%);
          filter: blur(22px);
          opacity: 0.32; /* 0.25 → 0.32 くらい */
          mix-blend-mode: screen;
          transform: translate3d(0,0,0);
        }
        .mistA{ animation: mistMoveA 16s ease-in-out infinite; }
        .mistB{ animation: mistMoveB 22s ease-in-out infinite; opacity:0.26; }
        .mistC{ animation: mistMoveC 28s ease-in-out infinite; opacity:0.18; }

        @keyframes mistMoveA{
          0%{ transform: translate(-2%, -1%) scale(1.05); }
          50%{ transform: translate(2%, 1%) scale(1.12); }
          100%{ transform: translate(-2%, -1%) scale(1.05); }
        }
        @keyframes mistMoveB{
          0%{ transform: translate(2%, 2%) scale(1.08); }
          50%{ transform: translate(-2%, -1%) scale(1.15); }
          100%{ transform: translate(2%, 2%) scale(1.08); }
        }
        @keyframes mistMoveC{
          0%{ transform: translate(0%, 1%) scale(1.02); }
          50%{ transform: translate(1%, -2%) scale(1.10); }
          100%{ transform: translate(0%, 1%) scale(1.02); }
        }

        /* 水晶 */
        .crystalWrap{
          position:absolute;
          left:50%;
          top:50%;
          transform: translate(-50%,-52%);
          width:min(920px, 92vw);
          height:min(920px, 92vw);
          display:grid;
          place-items:center;
          opacity: 0.95;
        }
        .crystalImg{
          width:100%;
          height:100%;
          object-fit:contain;
          filter:
            drop-shadow(0 30px 80px rgba(0,0,0,0.55))
            drop-shadow(0 0 32px rgba(140,110,255,0.55));
          opacity: 0.95;
        }
        .crystalGlowCore{
          position:absolute;
          width:38%;
          height:38%;
          border-radius:999px;
          background: radial-gradient(circle,
            rgba(255,255,255,0.85) 0%,
            rgba(170,140,255,0.55) 22%,
            rgba(140,110,255,0.25) 48%,
            rgba(0,0,0,0) 72%
          );
          filter: blur(6px);
          opacity: 0.32;
          animation: corePulse 3.2s ease-in-out infinite;
          mix-blend-mode: screen;
          pointer-events:none;
        }
        .crystalGlowRing{
          position:absolute;
          width:62%;
          height:62%;
          border-radius:999px;
          background: radial-gradient(circle,
            rgba(0,0,0,0) 48%,
            rgba(170,140,255,0.22) 58%,
            rgba(255,255,255,0.28) 60%,
            rgba(0,0,0,0) 72%
          );
          filter: blur(10px);
          opacity: 0.22;
          animation: ringPulse 4.6s ease-in-out infinite;
          mix-blend-mode: screen;
          pointer-events:none;
        }
        @keyframes corePulse{
          0%,100%{ transform: scale(0.98); opacity:0.28; }
          50%{ transform: scale(1.05); opacity:0.44; }
        }
        @keyframes ringPulse{
          0%,100%{ transform: scale(1); opacity:0.18; }
          50%{ transform: scale(1.06); opacity:0.30; }
        }
        /* ボタン押下で一瞬フラッシュ */
        .crystalWrap.flash .crystalGlowCore{
          animation: none;
          opacity: 0.95;
          transform: scale(1.12);
          filter: blur(2px);
        }
        .crystalWrap.flash .crystalImg{
          filter:
            drop-shadow(0 30px 80px rgba(0,0,0,0.55))
            drop-shadow(0 0 60px rgba(255,255,255,0.55))
            drop-shadow(0 0 70px rgba(140,110,255,0.95));
        }

        /* パネル */
        .panel{
          border-radius: 26px;
          padding: 28px;
          background: linear-gradient(180deg, var(--panel), var(--panel2));
          border: 1px solid var(--stroke);
          box-shadow:
            0 20px 70px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .field{
          width:100%;
          height:64px;
          border-radius: 18px;
          padding: 0 18px;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.12);
          outline: none;
          color: white;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.25);
        }
        .field:focus{
          border-color: rgba(140,110,255,0.55);
          box-shadow:
            0 0 0 3px rgba(140,110,255,0.20),
            inset 0 0 0 1px rgba(0,0,0,0.25);
        }

        .btn{
          width:100%;
          height:72px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.08em;
          background: linear-gradient(90deg, var(--accent2), var(--accent));
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 18px 55px rgba(106, 92, 255, 0.35),
            0 10px 30px rgba(0,0,0,0.35);
          transition: transform .12s ease, filter .12s ease, opacity .12s ease;
        }
        .btn:hover{ transform: translateY(-1px); filter: brightness(1.07); }
        .btn:active{ transform: translateY(1px) scale(0.99); }
        .btn.disabled{ opacity:0.55; cursor:not-allowed; }

        /* 結果カード */
        .resultCard{
          border-radius: 26px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(180deg, rgba(10,10,18,0.55), rgba(10,10,18,0.35));
          box-shadow:
            0 30px 90px rgba(0,0,0,0.55),
            0 0 0 1px rgba(140,110,255,0.10);
          backdrop-filter: blur(14px);
          animation: popIn .35s ease both;
        }
        @keyframes popIn{
          from{ transform: translateY(10px) scale(0.98); opacity:0; }
          to{ transform: translateY(0) scale(1); opacity:1; }
        }
        .resultTop{
          padding: 22px 22px 10px;
          background: radial-gradient(1200px 400px at 50% 0%, rgba(140,110,255,0.22), rgba(0,0,0,0));
        }
        .badge{
          display:inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: .22em;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.25);
        }
        .resultTitle{
          margin-top: 10px;
          font-size: 28px;
          font-weight: 900;
        }
        .resultSub{
          margin-top: 6px;
          color: rgba(255,255,255,0.72);
        }
        .resultBody{
          padding: 18px 22px 24px;
        }
        .resultMsg{
          line-height: 1.9;
          color: rgba(255,255,255,0.85);
        }
        .chips{
          display:flex;
          flex-wrap:wrap;
          gap: 8px;
          margin-top: 14px;
        }
        .chip{
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(140,110,255,0.22);
          background: rgba(140,110,255,0.10);
          color: rgba(255,255,255,0.78);
          font-size: 13px;
        }
        .advice{
          margin-top: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.22);
          padding: 14px 14px;
        }
        .adviceLabel{
          font-size: 12px;
          letter-spacing: .22em;
          color: rgba(255,255,255,0.55);
        }
        .adviceText{
          margin-top: 6px;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .tail{
          margin-top: 14px;
          color: rgba(255,255,255,0.78);
          font-weight: 700;
        }
        .actions{
          display:flex;
          gap: 10px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .btnSecondary{
          flex: 1 1 180px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.86);
          transition: transform .12s ease, filter .12s ease;
        }
        .btnSecondary:hover{ transform: translateY(-1px); filter: brightness(1.08); }
        .btnSecondary:active{ transform: translateY(1px) scale(0.99); }

        /* キラ粒（派手版） */
        .sparks{
          position:absolute;
          inset:0;
          pointer-events:none;
          z-index: 30;
          opacity: 0;
          transition: opacity .15s ease;
        }
        .sparks.on{ opacity: 1; }
        .spark{
          position:absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,1), rgba(170,140,255,0.75), rgba(0,0,0,0));
          filter:
            drop-shadow(0 0 10px rgba(255,255,255,0.65))
            drop-shadow(0 0 18px rgba(140,110,255,0.65));
          animation-name: sparkFly;
          animation-timing-function: cubic-bezier(.2,.9,.25,1);
          animation-fill-mode: both;
        }
        @keyframes sparkFly{
          from{
            transform: translate3d(0, 40px, 0) scale(0.9);
            opacity: 0;
          }
          20%{ opacity: 1; }
          to{
            transform: translate3d(0, -120px, 0) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
