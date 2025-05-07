/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        /*'custom-blue': '#00005C',

        'white': '#ffffff',
        'black': '#000',
        'primary': '#1860A1',
        'grey': '#A2A1A8',
        'secondary': '#16151C',
        'error': '#F30000'*/
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
        progressionColor: '#029500',
        white: '#ffffff',
        grey: '#A2A1A8',
        error: '#F30000'
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
  safelist: [
    'bg-[#00005C]'  // Si nécessaire pour la purge CSS
  ]
};
