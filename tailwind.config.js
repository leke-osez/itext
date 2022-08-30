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
        
        's500': '500px',
        's640': '640px',
        's700': '700px',
        's768': '768px',
        's885': '885px',
        's970': '970px',
        
        
        
      }
    },
  },
  plugins: [],
}
