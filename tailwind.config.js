/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // one radius system: near-sharp instrument edges
    borderRadius: {
      none: "0",
      DEFAULT: "4px",
      sm: "3px",
      md: "6px",
      full: "9999px", // reserved for status dots only
    },
    extend: {
      colors: {
        base: "#07090B",
        "base-1": "#0B0E11",
        "base-2": "#12161A",
        line: "#1E252B",
        "line-2": "#2C353D",
        fg: "#E8ECEF",
        "fg-mid": "#8A949C",
        "fg-low": "#565F66",
        // single locked accent - signal green
        signal: {
          DEFAULT: "#4ADE9E",
          bright: "#7BF0BD",
          dim: "#2E8F68",
        },
        // data-only secondary + status (never used as page accent)
        wire: "#63B3FF",
        warn: "#F2B33D",
        crit: "#FF6B7A",
      },
      fontFamily: {
        sans: ['"Geist"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
      },
      maxWidth: {
        frame: "1400px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "grid-in": {
          "0%": { opacity: "0", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "trace-x": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
      },
      animation: {
        "grid-in": "grid-in 1.2s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
