/** @type {import('tailwindcss').Config} */

export default ({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-background': "url('src/assets/image/login_background_image.png')",
        'register-background': "url('src/assets/image/register_background_image.png')",
        'not-found-data-background': "url('src/assets/image/not_found_image.gif')",
      },
      fontWeight: {
        5: 500,
        7: 700,
      },
      fontSize: {
        8: "0.8rem",
        9: "0.9rem",
        12: "1.2rem",
        14: "1.4rem",
        16: "1.6rem",
        18: "1.8rem",
        20: "2rem",
      },
      colors: {
        "primary-3": "#22d3ee",
        "primary-4": "#22d3ee",
        "primary-5": "#06B6D4"
      },
      boxShadow: {
      }
    },
  },
  plugins: [
    require('tailwind-children'),
  ],
})

