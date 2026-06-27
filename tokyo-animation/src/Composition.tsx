import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

// ─── Easing curves ──────────────────────────────────────────────────────────
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);   // crisp decelerate
const EASE_POP = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot bounce

// ─── Typewriter helpers ──────────────────────────────────────────────────────
const getTyped = (frame: number, text: string, startFrame: number, charFrames: number): string => {
  const elapsed = Math.max(0, frame - startFrame);
  return text.slice(0, Math.min(text.length, Math.floor(elapsed / charFrames)));
};

const Cursor: React.FC<{ frame: number; active: boolean }> = ({ frame, active }) => {
  const opacity = active
    ? interpolate(frame % 16, [0, 8, 16], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  return <span style={{ opacity, userSelect: "none" }}>▌</span>;
};

// ─── Shared slide helpers ────────────────────────────────────────────────────
const slideX = (frame: number, start: number, end: number, fromPx: number) =>
  `${interpolate(frame, [start, end], [fromPx, 0], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px 0px`;

const slideXY = (frame: number, start: number, end: number, fromX: number, fromY: number) =>
  `${interpolate(frame, [start, end], [fromX, 0], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px ${interpolate(frame, [start, end], [fromY, 0], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`;

const slideY = (frame: number, start: number, end: number, fromPx: number) =>
  `0px ${interpolate(frame, [start, end], [fromPx, 0], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`;

const fadeIn = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const popScale = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { easing: EASE_POP, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ─── Component ───────────────────────────────────────────────────────────────
export const TokyoCollage: React.FC = () => {
  const frame = useCurrentFrame();

  // Typing content
  const HELLO_TOKYO = "HELLO TOKYO";
  const BODY = 'Tokyo ; lit. "Eastern Capital", officially Tokyo Metropolis, is one of the 74 prefectures of Japan and currently the most populous metropolitan area in the world.';
  const TOFRUBY = "TOFRUBY";
  const KONNICHIWA = "こんにちは！";

  const helloTyped = getTyped(frame, HELLO_TOKYO, 68, 2);
  const bodyTyped = getTyped(frame, BODY, 76, 1);
  const tofrubyTyped = getTyped(frame, TOFRUBY, 90, 3);
  const konnichiwaTyped = getTyped(frame, KONNICHIWA, 70, 4);

  const LETTER_ROTATIONS = [-6, -3, 2, -4, 5];
  const LETTERS = ["T", "O", "K", "Y", "O"];

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", fontFamily: "sans-serif", overflow: "hidden" }}>

      {/* ── BACKGROUND PHOTO ── */}
      <AbsoluteFill style={{ opacity: fadeIn(frame, 0, 20) }}>
        <Img
          src={staticFile("tokyo.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </AbsoluteFill>

      {/* Subtle dark vignette so overlays read clearly */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
          opacity: fadeIn(frame, 10, 30),
        }}
      />

      {/* ── TOKYO LETTERS — each drops from above, staggered ── */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 6,
          zIndex: 10,
        }}
      >
        {LETTERS.map((letter, i) => {
          const s = 8 + i * 6;
          const e = s + 28;
          return (
            <div
              key={i}
              style={{
                translate: slideY(frame, s, e, -230),
                rotate: `${LETTER_ROTATIONS[i]}deg`,
                opacity: fadeIn(frame, s, 10),
                background: "#3DB800",
                color: "#FFE600",
                fontSize: 104,
                fontWeight: 900,
                fontFamily: '"Impact", "Arial Black", sans-serif',
                width: 182,
                height: 208,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "5px solid #000",
                textShadow: "5px 5px 0 #000",
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* ── SPEECH BUBBLE "すごい" — slides from right ── */}
      <div
        style={{
          position: "absolute",
          right: 52,
          top: 268,
          zIndex: 15,
          translate: slideX(frame, 38, 60, 300),
          opacity: fadeIn(frame, 38, 10),
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 38,
            padding: "16px 30px",
            border: "4px solid #000",
            fontSize: 50,
            fontWeight: 700,
            color: "#FF4400",
            position: "relative",
            whiteSpace: "nowrap",
            boxShadow: "3px 3px 0 #000",
          }}
        >
          すごい
          {/* tail border */}
          <div style={{ position: "absolute", bottom: -28, left: 26, width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderTop: "28px solid #000" }} />
          {/* tail fill */}
          <div style={{ position: "absolute", bottom: -18, left: 28, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "20px solid #fff" }} />
        </div>
      </div>

      {/* ── SPARKLE 1 ── */}
      <div style={{ position: "absolute", top: 346, left: 178, fontSize: 46, zIndex: 14, userSelect: "none", scale: String(popScale(frame, 43, 58)), opacity: fadeIn(frame, 43, 8), color: "#FFE600", textShadow: "0 0 18px #FFE600, 0 0 36px #FF8800" }}>✦</div>

      {/* ── SPARKLE 2 ── */}
      <div style={{ position: "absolute", top: 496, left: 308, fontSize: 30, zIndex: 14, userSelect: "none", scale: String(popScale(frame, 48, 62)), opacity: fadeIn(frame, 48, 8), color: "#FFE600", textShadow: "0 0 14px #FFE600" }}>✦</div>

      {/* ── NOTE CARD — slides from left ── */}
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 426,
          zIndex: 12,
          translate: slideX(frame, 30, 54, -340),
          rotate: "-4deg",
          opacity: fadeIn(frame, 30, 12),
        }}
      >
        <div
          style={{
            background: "#fffbec",
            padding: "32px 22px 22px",
            width: 256,
            borderRadius: 3,
            border: "1px solid #ccc",
            boxShadow: "5px 7px 20px rgba(0,0,0,0.5)",
            position: "relative",
            fontSize: 22,
            lineHeight: 1.75,
            color: "#222",
          }}
        >
          {/* thumbtack */}
          <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff8888, #BB0000)", border: "2px solid #880000", boxShadow: "1px 2px 5px rgba(0,0,0,0.5)" }} />
          まさか今ここに来る<br />
          とは思ってもいませ<br />
          んでした。楽しい旅<br />
          になりそうです！♡
          <div style={{ fontSize: 30, marginTop: 10 }}>🍣</div>
        </div>
      </div>

      {/* ── RAMEN STICKER — drops from upper-right ── */}
      <div style={{ position: "absolute", right: 44, top: 464, fontSize: 100, zIndex: 14, translate: slideXY(frame, 46, 66, 200, -200), opacity: fadeIn(frame, 46, 10), filter: "drop-shadow(4px 4px 12px rgba(0,0,0,0.7))", userSelect: "none" }}>
        🍜
      </div>

      {/* ── ONIGIRI — slides from right ── */}
      <div style={{ position: "absolute", right: 56, top: 660, fontSize: 90, zIndex: 14, translate: slideX(frame, 50, 70, 280), opacity: fadeIn(frame, 50, 10), filter: "drop-shadow(4px 4px 12px rgba(0,0,0,0.7))", userSelect: "none" }}>
        🍙
      </div>

      {/* ── SNACK PACKAGE — slides from bottom-left ── */}
      <div style={{ position: "absolute", left: 36, bottom: 474, fontSize: 82, zIndex: 12, translate: slideXY(frame, 52, 72, -220, 200), rotate: "-10deg", opacity: fadeIn(frame, 52, 10), filter: "drop-shadow(3px 3px 8px rgba(0,0,0,0.65))", userSelect: "none" }}>
        🍡
      </div>

      {/* ── CAMERA STICKER — slides from right ── */}
      <div style={{ position: "absolute", right: 110, bottom: 480, fontSize: 56, zIndex: 13, translate: slideX(frame, 58, 74, 260), rotate: "8deg", opacity: fadeIn(frame, 58, 10), filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))", userSelect: "none" }}>
        📷
      </div>

      {/* ── LET'S GO STICKERS — pop in from center ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 858,
          marginLeft: -82,
          zIndex: 16,
          scale: String(popScale(frame, 60, 78)),
          opacity: fadeIn(frame, 60, 8),
        }}
      >
        <div style={{ background: "#CC0000", color: "#fff", fontFamily: '"Impact","Arial Black",sans-serif', fontSize: 44, fontWeight: 900, padding: "7px 26px", letterSpacing: 4, border: "4px solid #000", boxShadow: "3px 3px 0 #000", marginBottom: 6, whiteSpace: "nowrap" }}>
          LET'S
        </div>
        <div style={{ background: "#3DB800", color: "#fff", fontFamily: '"Impact","Arial Black",sans-serif', fontSize: 44, fontWeight: 900, padding: "7px 26px", letterSpacing: 4, border: "4px solid #000", boxShadow: "3px 3px 0 #000", whiteSpace: "nowrap" }}>
          GO!
        </div>
      </div>

      {/* ── BOTTOM INFO BAR — slides up from below ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 444,
          translate: slideY(frame, 65, 90, 470),
          opacity: fadeIn(frame, 65, 15),
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1.15fr 0.75fr 1.1fr",
          borderTop: "5px solid #000",
          overflow: "hidden",
        }}
      >
        {/* LEFT — HELLO TOKYO + body + TOFRUBY */}
        <div style={{ background: "#FFE600", padding: "20px 18px 16px", borderRight: "4px solid #000", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
          <div>
            <div style={{ fontFamily: '"Impact","Arial Black",sans-serif', fontSize: 54, fontWeight: 900, color: "#000", lineHeight: 1, marginBottom: 12 }}>
              <span style={{ color: "#CC0000" }}>HEL</span>LO
              <br />TOKYO
              <Cursor frame={frame} active={helloTyped.length < HELLO_TOKYO.length} />
            </div>
            <div style={{ fontSize: 16, color: "#333", lineHeight: 1.55, overflow: "hidden", maxHeight: 168 }}>
              {bodyTyped}
              <Cursor frame={frame} active={bodyTyped.length < BODY.length && helloTyped.length >= HELLO_TOKYO.length} />
            </div>
          </div>
          <div style={{ fontFamily: '"Impact","Arial Black",sans-serif', fontSize: 48, fontWeight: 900, color: "#000", letterSpacing: 2, lineHeight: 1 }}>
            {tofrubyTyped}
            <Cursor frame={frame} active={tofrubyTyped.length < TOFRUBY.length} />
          </div>
        </div>

        {/* MIDDLE — photo thumbnails */}
        <div style={{ background: "#111", borderRight: "4px solid #000", display: "grid", gridTemplateRows: "1fr 1fr", overflow: "hidden" }}>
          <div style={{ overflow: "hidden", borderBottom: "3px solid #000" }}>
            <Img src={staticFile("tokyo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", filter: "saturate(1.6) brightness(0.75)" }} />
          </div>
          <div style={{ overflow: "hidden" }}>
            <Img src={staticFile("tokyo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 85%", filter: "hue-rotate(25deg) brightness(0.7)" }} />
          </div>
        </div>

        {/* RIGHT — こんにちは + STAY */}
        <div style={{ background: "#FFE600", padding: "18px 14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#000", lineHeight: 1.3 }}>
            {konnichiwaTyped}
            <Cursor frame={frame} active={konnichiwaTyped.length < KONNICHIWA.length} />
          </div>
          <div style={{ fontFamily: '"Impact","Arial Black",sans-serif', fontSize: 90, fontWeight: 900, color: "#000", lineHeight: 1, letterSpacing: -2 }}>
            STA<span style={{ color: "#CC0000" }}>Y</span>
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
