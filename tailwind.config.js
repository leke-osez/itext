/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    
    extend: {
      colors:{
        'textColor' : '#eca642',
        'bodyColor' : '#eca642',
      },
      fontSize:{
        'base' : '14px'
      },
      screens:{
        "md": '780px',
        's500': '500px',
        's700': '700px',
        's885': '885px',
        's970': '970px',
        
        
        
      }
    },
  },
  plugins: [],
}
