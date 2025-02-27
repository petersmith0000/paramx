/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        themeBlue: "#001A38",
        borderColor: "#FFFDFD",
        offWhiteColor: "#D4D4D4",
        themeGreen: "#31F70E",
        themeRed: "#CF1E1E",
        activeBtnBg: "#CBCDE8",
      },
      boxShadow: {
        cardShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
      },
      fontSize: {
        tenPixel: "10px",
      },
    },
  },
  plugins: [],
};
