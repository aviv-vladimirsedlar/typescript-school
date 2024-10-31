/* eslint-disable no-undef */

/** @type {import('tailwindcss').Config} */

module.exports = {
  plugins: [require('flowbite/plugin')],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {},
  },
};
