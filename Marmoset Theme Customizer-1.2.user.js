// ==UserScript==
// @name         Marmoset Theme Customizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Blue theme for Marmoset with color customization sliders
// @author       Gabriel Faigan
// @match        https://marmoset.student.cs.uwaterloo.ca/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Default colors - load saved values or use defaults
    const defaultColors = {
        primary: GM_getValue('primary', '#1e3a5f'),
        secondary: GM_getValue('secondary', '#2c4a6d'),
        accent: GM_getValue('accent', '#4a76a8'),
        text: GM_getValue('text', '#e0e0e0'),
        header: GM_getValue('header', '#87ceeb')
    };

    let currentColors = {...defaultColors};

    // Create color control panel
    function createColorControls() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'marmoset-color-controls';
        controlPanel.innerHTML = `
            <div class="color-controls-header">
                <h3>🎨 Marmoset Theme</h3>
                <button id="toggle-controls">−</button>
            </div>
            <div class="color-controls-body">
                <div class="color-control">
                    <label>Background</label>
                    <input type="color" id="color-primary" value="${currentColors.primary}">
                    <input type="range" id="slider-primary" min="0" max="100" value="30" class="color-slider">
                </div>
                <div class="color-control">
                    <label>Secondary</label>
                    <input type="color" id="color-secondary" value="${currentColors.secondary}">
                    <input type="range" id="slider-secondary" min="0" max="100" value="45" class="color-slider">
                </div>
                <div class="color-control">
                    <label>Accent</label>
                    <input type="color" id="color-accent" value="${currentColors.accent}">
                    <input type="range" id="slider-accent" min="0" max="100" value="60" class="color-slider">
                </div>
                <div class="color-control">
                    <label>Text</label>
                    <input type="color" id="color-text" value="${currentColors.text}">
                    <input type="range" id="slider-text" min="0" max="100" value="88" class="color-slider">
                </div>
                <div class="color-control">
                    <label>Headers</label>
                    <input type="color" id="color-header" value="${currentColors.header}">
                    <input type="range" id="slider-header" min="0" max="100" value="70" class="color-slider">
                </div>
                <div class="control-buttons">
                    <button id="reset-colors">Reset</button>
                    <button id="toggle-theme">Toggle Theme</button>
                </div>
            </div>
        `;

        // Add styles for the control panel
        const panelStyles = `
            <style id="marmoset-controls-styles">
                #marmoset-color-controls {
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(30, 58, 95, 0.95);
                    border: 2px solid #4a76a8;
                    border-radius: 10px;
                    padding: 15px;
                    width: 220px;
                    z-index: 10000;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    font-family: Arial, sans-serif;
                }

                .color-controls-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #4a76a8;
                }

                .color-controls-header h3 {
                    margin: 0;
                    color: #87ceeb;
                    font-size: 14px;
                    font-weight: bold;
                }

                #toggle-controls {
                    background: #4a76a8;
                    border: none;
                    color: white;
                    border-radius: 3px;
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                }

                .color-control {
                    margin-bottom: 12px;
                }

                .color-control label {
                    display: block;
                    color: #e0e0e0;
                    font-size: 11px;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                .color-control input[type="color"] {
                    width: 100%;
                    height: 30px;
                    border: 1px solid #4a76a8;
                    border-radius: 5px;
                    background: #2c4a6d;
                    cursor: pointer;
                }

                .color-slider {
                    width: 100%;
                    height: 6px;
                    margin-top: 5px;
                    border-radius: 3px;
                    background: #2c4a6d;
                    outline: none;
                    -webkit-appearance: none;
                }

                .color-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #87ceeb;
                    cursor: pointer;
                    border: 2px solid #2c4a6d;
                }

                .color-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #87ceeb;
                    cursor: pointer;
                    border: 2px solid #2c4a6d;
                }

                .control-buttons {
                    display: flex;
                    gap: 8px;
                    margin-top: 15px;
                }

                .control-buttons button {
                    flex: 1;
                    padding: 8px 12px;
                    background: #4a76a8;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                    font-size: 11px;
                    transition: background 0.2s;
                }

                .control-buttons button:hover {
                    background: #5a86b8;
                }

                #marmoset-color-controls.collapsed {
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    padding: 5px;
                }

                #marmoset-color-controls.collapsed .color-controls-body {
                    display: none;
                }

                #marmoset-color-controls.collapsed .color-controls-header {
                    margin-bottom: 0;
                    border-bottom: none;
                    padding-bottom: 0;
                }

                #marmoset-color-controls.collapsed .color-controls-header h3 {
                    display: none;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', panelStyles);
        document.body.appendChild(controlPanel);

        // Add event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        // Color picker changes
        document.getElementById('color-primary').addEventListener('input', function(e) {
            currentColors.primary = e.target.value;
            updateTheme();
            updateSlider('primary', e.target.value);
        });

        document.getElementById('color-secondary').addEventListener('input', function(e) {
            currentColors.secondary = e.target.value;
            updateTheme();
            updateSlider('secondary', e.target.value);
        });

        document.getElementById('color-accent').addEventListener('input', function(e) {
            currentColors.accent = e.target.value;
            updateTheme();
            updateSlider('accent', e.target.value);
        });

        document.getElementById('color-text').addEventListener('input', function(e) {
            currentColors.text = e.target.value;
            updateTheme();
            updateSlider('text', e.target.value);
        });

        document.getElementById('color-header').addEventListener('input', function(e) {
            currentColors.header = e.target.value;
            updateTheme();
            updateSlider('header', e.target.value);
        });

        // Slider changes
        document.getElementById('slider-primary').addEventListener('input', function(e) {
            const color = `hsl(215, 50%, ${e.target.value}%)`;
            currentColors.primary = color;
            document.getElementById('color-primary').value = hslToHex(215, 50, e.target.value);
            updateTheme();
        });

        document.getElementById('slider-secondary').addEventListener('input', function(e) {
            const color = `hsl(215, 50%, ${e.target.value}%)`;
            currentColors.secondary = color;
            document.getElementById('color-secondary').value = hslToHex(215, 50, e.target.value);
            updateTheme();
        });

        document.getElementById('slider-accent').addEventListener('input', function(e) {
            const color = `hsl(215, 50%, ${e.target.value}%)`;
            currentColors.accent = color;
            document.getElementById('color-accent').value = hslToHex(215, 50, e.target.value);
            updateTheme();
        });

        document.getElementById('slider-text').addEventListener('input', function(e) {
            const color = `hsl(0, 0%, ${e.target.value}%)`;
            currentColors.text = color;
            document.getElementById('color-text').value = hslToHex(0, 0, e.target.value);
            updateTheme();
        });

        document.getElementById('slider-header').addEventListener('input', function(e) {
            const color = `hsl(197, 70%, ${e.target.value}%)`;
            currentColors.header = color;
            document.getElementById('color-header').value = hslToHex(197, 70, e.target.value);
            updateTheme();
        });

        // Control buttons
        document.getElementById('reset-colors').addEventListener('click', resetColors);
        document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
        document.getElementById('toggle-controls').addEventListener('click', toggleControls);
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function updateSlider(type, color) {
        // Convert hex to HSL and update slider position
        // This is a simplified version - in production you'd want a full hex to HSL converter
    }

    function updateTheme() {
        // Save colors
        Object.keys(currentColors).forEach(key => {
            GM_setValue(key, currentColors[key]);
        });

        // Remove existing theme
        const existingTheme = document.getElementById('marmoset-blue-theme');
        if (existingTheme) existingTheme.remove();

        // Apply new theme
        const themeCSS = `
            <style id="marmoset-blue-theme">
                body, .header, .content, .footer {
                    background-color: ${currentColors.primary} !important;
                    color: ${currentColors.text} !important;
                }

                h1, h2, h3, h4, h5, h6, .header p {
                    color: ${currentColors.header} !important;
                }

                table, th, td {
                    background-color: ${currentColors.secondary} !important;
                    border-color: ${currentColors.accent} !important;
                    color: ${currentColors.text} !important;
                }

                th {
                    background-color: ${currentColors.accent} !important;
                    color: white !important;
                }

                tr:nth-child(even) {
                    background-color: ${currentColors.primary} !important;
                }

                a:link { color: ${currentColors.header} !important; }
                a:visited { color: #b19cd9 !important; }
                a:hover { color: #add8e6 !important; }

                input[type="submit"], input[type="button"], button {
                    background-color: ${currentColors.accent} !important;
                    border-color: ${currentColors.accent} !important;
                    color: white !important;
                }

                input[type="text"], input[type="password"], textarea, select {
                    background-color: ${currentColors.secondary} !important;
                    border-color: ${currentColors.accent} !important;
                    color: ${currentColors.text} !important;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', themeCSS);
    }

    function resetColors() {
        currentColors = {...defaultColors};

        // Update color pickers
        document.getElementById('color-primary').value = currentColors.primary;
        document.getElementById('color-secondary').value = currentColors.secondary;
        document.getElementById('color-accent').value = currentColors.accent;
        document.getElementById('color-text').value = currentColors.text;
        document.getElementById('color-header').value = currentColors.header;

        updateTheme();
    }

    function toggleTheme() {
        const theme = document.getElementById('marmoset-blue-theme');
        if (theme) {
            theme.remove();
        } else {
            updateTheme();
        }
    }

    function toggleControls() {
        const controls = document.getElementById('marmoset-color-controls');
        const toggleBtn = document.getElementById('toggle-controls');

        if (controls.classList.contains('collapsed')) {
            controls.classList.remove('collapsed');
            toggleBtn.textContent = '−';
        } else {
            controls.classList.add('collapsed');
            toggleBtn.textContent = '+';
        }
    }

    // Initialize
    function init() {
        createColorControls();
        updateTheme();

        // Watch for page changes
        new MutationObserver(function() {
            if (!document.getElementById('marmoset-color-controls')) {
                createColorControls();
            }
            updateTheme();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();