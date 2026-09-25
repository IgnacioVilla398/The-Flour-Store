export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:      "#0E1B2E",
        navySoft:  "#142744",
        flame:     "#FA541C",
        flameAlt:  "#FF5722",
        cream:     "#FFF3E0",
        creamDeep: "#FFE0B2",
        whatsapp:  "#25D366",
      },
      fontFamily: {
        display: ['"Anton"', "system-ui", "sans-serif"],
        sans:    ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft:   "0 18px 40px -18px rgba(0,0,0,.45)",
        burger: "0 35px 45px -20px rgba(0,0,0,.55)",
      },
    },
  },
  plugins: [],
};
