/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        courgette: ["Courgette", "cursive"],
      },
      keyframes: {
        platform: {
          "0%, 100%": { transform: "translateY(-0.5em)" },
          "50%": { transform: "translateY(0.5em)" },
        },
        panelRotate: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.1" },
        },
        textMove: {
          from: { transform: "translate(2rem, -50%)" },
          to: { transform: "translate(-42.64rem, -50%)" },
        },
      },
      animation: {
        platform: "platform 8s infinite ease-in-out",
        panelRotate: "panelRotate 24s infinite linear",
        textMove: "textMove 8s infinite linear",
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        lg: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        'Bebas': ['Nabla', 'system-ui'],
        'barcade': ['Barcade', 'sans-serif'], 
        'loby': ['Faculty Glyphic', 'sans-serif'], 
        'Earth': ['Earth Orbiter', 'sans-serif'], 
        'Pilot': ['Pilot Command', 'sans-serif'], 
        'Veritas': ['Veritas Sans', 'sans-serif'], 
        'Informative': ['Informative', 'sans-serif'], 
        'Warriot': ['Warriot Tech', 'sans-serif'], 
        'NeverMind': ['NeverMind Bauhaus', 'sans-serif'], 
        'Orion': ['Flexsteel', 'sans-serif'], 
        'Kecil': ['Major Mono Display', 'sans-serif'],
        'Bruno': ['Bruno Ace SC', 'sans-serif'],
        'Oceanic': ['Oceanic Drift', 'sans-serif'],
        'NK57': ['NK57 Monospace', 'sans-serif'],
        'Red': ['Red Hat Mono', 'sans-serif'],
        'r2014': ['FreeMono', 'sans-serif'],

                                                
        

        
      },
      animation: {
        'scale-down': 'scaleDown 0.5s ease-in-out forwards',
      },
      keyframes: {
        scaleDown: {
          '0%': { transform: 'scale(2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      colors: {
        'deepSeaBlue': '#0B4464',
        'paddlefill': '#00A88C',
        'strockpadlani': '#00A88C',
        'paddlestroke': '#58FFE3',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' },   
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' },   
        },
      },
      animation: {
        'slide-in-left': 'slideInLeft 1s ease forwards',
        'slide-in-right': 'slideInRight 1s ease forwards',
      },
      screens: {
        'mobile': '320px',
        'tablet': '640px',
        'laptop': '1025px',
        'desktop': '1280px',
        'xs': '400px',
        'ls': '500px',
        'lm': '900px',
        'lg': '1024px',
        'xl': '1280px',
        'l' : '1150px',
        '2xl': '1536px',
        '3xl': '1800px',
        '4xl': '2000px',
        '5xl': '2280px',
        // 'screen-sm': { raw: '(max-height: 600px)' },
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
        'hover-bg' : "url(/images/cup.png)",
        'custom-gradient': 'linear-gradient(180deg, rgba(26, 31, 38, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
      },
      borderRadius: {
        'custom-Radius': '10px 20px 10px 20px',
        'sidebar_lg':'0px 30px 30px 00px;'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}


