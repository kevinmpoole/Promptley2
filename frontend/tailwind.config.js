/** @type {import('tailwindcss').Config} */
const config = {

  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // scan all components, pages, etc.
  ],
  theme: {
    extend: {
      colors: {
        character: "#d4a017",   // Mustard Yellow
        world: "#1e3a8a",       // Deep Blue
        scene: "#166534",       // Forest Green
        prop: "#7f1d1d",        // Rust Red
        shot: "#6d28d9",        // Violet
        event: "#d97706",       // Amber
        surface: "#f9f7f3",     // Light card bg
        background: "#f1ede9",  // Canvas bg
        extend: {
          boxShadow: {
            card: "0 4px 10px rgba(0, 0, 0, 0.3)",
          },
        },
        
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}

export default config