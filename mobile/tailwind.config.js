/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors : {
        primary : '#3B82F6',
        flare : '#de4e15',
        up: '#de7d15'
      },

      fontFamily: {
        // Lufga fonts
        'lufga': ['LufgaRegular'],
        'lufga-black': ['LufgaBlack'],
        'lufga-bold': ['LufgaBold'],
        'lufga-extrabold': ['LufgaExtraBold'],
        'lufga-extralight': ['LufgaExtraLight'],
        'lufga-light': ['LufgaLight'],
        'lufga-medium': ['LufgaMedium'],
        'lufga-regular': ['LufgaRegular'],
        'lufga-semibold': ['LufgaSemiBold'],
        'lufga-thin': ['LufgaThin'],
        
        // Luga fonts
        'luga': ['luga'],
        'luga-bold': ['luga_bold'],
      },
    },
  },
  plugins: [],
}