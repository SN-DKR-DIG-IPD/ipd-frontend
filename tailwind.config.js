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
        liBlue: '#DDEFFF',
        thBlue: '#00407A',
        thBackground: '#EEF7FF',
        trBorder: '#DAD9DC',
        breadcrumbColor: '#545454',
        divideColor: '#EBEBEB',
        dashedColor: '#D7D6D9',
        updateColor: '#909090',
        nationalColor: '#FF7300',
        internationalColor: '#30BE82',
        validateBorder: '#97DC96',
        validateText: '#029500',
        rejectText: '#FF0017',
        rejectBorder: '#E78891',
        inputBorder: '#BECEE8',
        progressionColor: '#029500'


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
