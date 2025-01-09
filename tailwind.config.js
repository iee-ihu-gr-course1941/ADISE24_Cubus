import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import { transform } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'custom-gray': {
                    400: '#A897A8',
                    700: '#4E454E',
                    800: '#232326',
                },
                'custom-pink': {
                    50: '#FBEDFB',
                    100: '#FFCBFF',
                    600: '#BF3079',
                },
                'custom-magenta': {

                    400: '#EB5AF6',
                    450: '#C788FF',
                    500: '#B638F7',
                },
                'custom-purple': {
                    300: '#9772FF',
                    400: '#6330EF',
                    500: '#4D25BC',
                    600: '#301985',
                    800: '#01092A',
                },
                'custom-brown': {
                    500: '#742327',
                    600: '#67322D',
                },
            },
            backgroundImage: {
                'radio-default-inner': 'radial-gradient(150% 100% ellipse at top, #000000 0%, #1B191F 39%)',
                'light-default-bottom': 'radial-gradient(150% 100% ellipse at bottom, #2D2937 0%, #1B191F 39%)',
                'bright-default-bottom': 'radial-gradient(150% 100% ellipse at bottom, #8E6FED 0%, #6330EF 52%)',
                'light-red-bottom': 'radial-gradient(150% 100% ellipse at bottom, #33031B 0%, #1B191F 39%)',
                'bright-red-bottom': 'radial-gradient(150% 100% ellipse at bottom, #BF3079 0%, #742327 52%)',
                'backdrop': 'radial-gradient(50% 50%, #EB5AF660, transparent), radial-gradient(100% 100% ellipse at bottom left, #6330EF80, #000000A0 80%), linear-gradient(to top, #000, #01092A)',
                'portrait-default': 'linear-gradient(to top, #01092A, #EB5AF6)',
                'button-landing-edge': 'conic-gradient(transparent 320deg, white)',
            },
            boxShadow: {
                'button-default': '0 0 8px 0 #8960F945',
                'button-default-hover': '0 0 0 4px #6330EF40',
                'button-red': '0 0 8px 0 #74232745',
                'button-red-hover': '0 0 0 4px #BF307940',
                'button-landing': '0 0 8px 0 #8960F945, 0 0 0 0 #8960F976, 0 0 0 0 #8960F976',
                'button-landing-hover': '0 0 0 8px #8960F945, 0 0 500px 250px #8960F930, 0 0 136px 58px #BC88FFA7',
                'button-landing-edge-glow': '0 0 10px 20px #fff',
            },
            animation: {
                'landing-glow': 'LandingGlow 3s linear infinite',
                'landing-star-big': 'LandingStarBig 3s linear 1s infinite',
                'landing-star-medium': 'LandingStarMedium 3s linear 1s infinite',
                'landing-star-small': 'LandingStarSmall 3s ease 1s infinite',
                'ground-hover': 'GroundHover 50s ease infinite',
                'asteroid-hover': 'AsteroidHover 20s ease infinite',
            },
            keyframes: {
                GroundHover: {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
                    '35%': { transform: 'translate(2px, 10px) rotate(1deg)' },
                    '60%': { transform: 'translate(8px, 2px) rotate(1deg)' },
                    '90%': { transform: 'translate(6px, 0px) rotate(-2deg)' },
                },
                AsteroidHover: {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
                    '23%': { transform: 'translate(10px, -25px) rotate(-5deg)' },
                    '85%': { transform: 'translate(2px, 25px) rotate(10deg)' },
                },
                LandingGlow: {
                    '0%, 100%': { transform: 'translate(-30px, -82px)' },
                    '23%': { transform: 'translate(270px, -82px)' },
                    '50%': { transform: 'translate(290px, 0)' },
                    '85%': { transform: 'translate(-30px, 0)' },
                },
                LandingStarBig: {
                    '0%': { transform: 'translate(-50%, -50%) scale(1)', fill: '#FBEDFB' },
                    '5%': { transform: 'translate(-50%, -50%) scale(0.8)', fill: '#C788FF' },
                    '10%': { transform: 'translate(-50%, -50%) scale(0.8)', fill: '#C788FF' },
                    '20%': { transform: 'translate(-50%, -50%) scale(1.2)', fill: '#FBEDFB' },
                    '35%, 100%': { transform: 'translate(-50%, -50%) scale(1)', fill: '#FBEDFB' },
                },

                LandingStarMedium: {
                    '0%': { transform: 'translateX(-50%) scale(1)', fill: '#C788FF' },
                    '10%': { transform: 'translateX(-50%) scale(1.2)', fill: '#FBEDFB' },
                    '20%': { transform: 'translateX(-50%) scale(1.2)', fill: '#FBEDFB' },
                    '35%, 100%': { transform: 'translateX(-50%) scale(1)', fill: '#C788FF' },
                },

                LandingStarSmall: {
                    '0%': { transform: 'scale(1)', fill: '#C788FF' },
                    '5%': { transform: 'scale(1)', fill: '#C788FF' },
                    '20%': { transform: 'scale(1.4)', fill: '#FBEDFB' },
                    '50%': { transform: 'scale(1.4)', fill: '#FBEDFB' },
                    '40%, 100%': { transform: 'scale(1)', fill: '#C788FF' },
                },
            }
        },
    },

    plugins: [forms],
};
