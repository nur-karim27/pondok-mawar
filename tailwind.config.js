import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

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
            colors: {
                primary: {
                    DEFAULT: '#0B3934',
                    light: '#174940',
                },
                accent: {
                    DEFAULT: '#D9F99D',
                    light: '#E5F3C8',
                },
                background: '#F7F6F1',
                foreground: '#173B36',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-10deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                }
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },

    plugins: [forms],
};
