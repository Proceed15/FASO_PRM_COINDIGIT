/** @type {import('tailwindcss').Config} */
//mudar base tailwind
module.exports = {

  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {

    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl2: "1200px",
      xl: "1200px",//menor que 1200px execute
      "2xl": "1536px",
    },

    extend: {
      animation: {
        gradientMove: "gradientMove 7s ease infinite",
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
    },
  },
}


