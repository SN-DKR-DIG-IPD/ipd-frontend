/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"]
  ,
  theme: {
    extend: {
      colors: {
        primary: '#1860A1',
        secondary: '#92929D',
        black: '#171725',
        lightBlue: '#F1F8FF',
        timelineBlue: '#C7E4FF',
        liBlue: '#DDEFFF'
      },
      borderWidth: {
        1: '1px',
      },
      boxShadow: {
        'custom-inset': '-1px 0px 0px 0px #E2E2EA inset',
        'custom-tooltip': '0px 2px 8px 0px #0081FF4D',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require('flowbite/plugin')
  ],
};
