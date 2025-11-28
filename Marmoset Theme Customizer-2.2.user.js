// ==UserScript==
// @name         Marmoset Theme Customizer
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Modern theme customizer for Marmoset with color customization
// @author       Gabriel Faigan
// @match        https://marmoset.student.cs.uwaterloo.ca/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Default colors - load saved values or use defaults
    const defaultColors = {
        primary: GM_getValue('primary', '#1a1a2e'),
        secondary: GM_getValue('secondary', '#16213e'),
        accent: GM_getValue('accent', '#0f3460'),
        text: GM_getValue('text', '#e6e6e6'),
        header: GM_getValue('header', '#4cc9f0')
    };

    // Premade themes - First 4 dark, last 4 light
    const premadeThemes = {
        // Dark Themes
        'Dark Blue': {
            primary: '#0d1b2a',
            secondary: '#1b263b',
            accent: '#415a77',
            text: '#e0e1dd',
            header: '#778da9'
        },
        'Midnight': {
            primary: '#121212',
            secondary: '#1e1e1e',
            accent: '#333333',
            text: '#e0e0e0',
            header: '#bb86fc'
        },
        'Forest': {
            primary: '#1b4332',
            secondary: '#2d6a4f',
            accent: '#40916c',
            text: '#d8f3dc',
            header: '#95d5b2'
        },
        'Purple': {
            primary: '#1a1a2e',
            secondary: '#16213e',
            accent: '#7209b7',
            text: '#e6e6e6',
            header: '#b5179e'
        },
        // Light Themes
        'Light Blue': {
            primary: '#f8f9fa',
            secondary: '#e9ecef',
            accent: '#0077b6',
            text: '#212529',
            header: '#0096c7'
        },
        'Sandstone': {
            primary: '#fdf6e3',
            secondary: '#eee8d5',
            accent: '#b58900',
            text: '#657b83',
            header: '#cb4b16'
        },
        'Mint': {
            primary: '#f0fff4',
            secondary: '#c6f6d5',
            accent: '#38a169',
            text: '#2d3748',
            header: '#2f855a'
        },
        'Rose': {
            primary: '#fff5f5',
            secondary: '#fed7d7',
            accent: '#e53e3e',
            text: '#2d3748',
            header: '#c53030'
        }
    };

    let currentColors = {...defaultColors};

    // Create color control panel
    function createColorControls() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'marmoset-color-controls';
        controlPanel.innerHTML = `
            <div class="color-controls-header">
                <div class="header-content">
                    <h3>Colours</h3>
                </div>
                <button id="toggle-controls" class="toggle-btn">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 4.5L2.5 8L1.5 7L6 2.5L10.5 7L9.5 8L6 4.5Z"/>
                    </svg>
                </button>
            </div>
            <div class="color-controls-body">
                <div class="color-control-group">
                    <div class="color-control">
                        <label>Background</label>
                        <div class="color-input-group">
                            <input type="color" id="color-primary" value="${currentColors.primary}">
                            <span class="color-value">${currentColors.primary}</span>
                        </div>
                    </div>
                    <div class="color-control">
                        <label>Secondary</label>
                        <div class="color-input-group">
                            <input type="color" id="color-secondary" value="${currentColors.secondary}">
                            <span class="color-value">${currentColors.secondary}</span>
                        </div>
                    </div>
                    <div class="color-control">
                        <label>Accent & Breadcrumb</label>
                        <div class="color-input-group">
                            <input type="color" id="color-accent" value="${currentColors.accent}">
                            <span class="color-value">${currentColors.accent}</span>
                        </div>
                    </div>
                    <div class="color-control">
                        <label>Text</label>
                        <div class="color-input-group">
                            <input type="color" id="color-text" value="${currentColors.text}">
                            <span class="color-value">${currentColors.text}</span>
                        </div>
                    </div>
                    <div class="color-control">
                        <label>Headers</label>
                        <div class="color-input-group">
                            <input type="color" id="color-header" value="${currentColors.header}">
                            <span class="color-value">${currentColors.header}</span>
                        </div>
                    </div>
                </div>
                <div class="premade-themes">
                    <div class="themes-label">Quick Themes</div>
                    <div class="theme-buttons">
                        <button class="theme-btn" data-theme="Dark Blue">Dark Blue</button>
                        <button class="theme-btn" data-theme="Midnight">Midnight</button>
                        <button class="theme-btn" data-theme="Forest">Forest</button>
                        <button class="theme-btn" data-theme="Purple">Purple</button>
                        <button class="theme-btn" data-theme="Light Blue">Light Blue</button>
                        <button class="theme-btn" data-theme="Sandstone">Sandstone</button>
                        <button class="theme-btn" data-theme="Mint">Mint</button>
                        <button class="theme-btn" data-theme="Rose">Rose</button>
                    </div>
                </div>
                <div class="control-buttons">
                    <button id="toggle-theme" class="btn-primary">Toggle Theme</button>
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
                    background: rgba(26, 26, 46, 0.98);
                    border: 1px solid rgba(76, 201, 240, 0.3);
                    border-radius: 16px;
                    padding: 0;
                    width: 280px;
                    z-index: 10000;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(20px);
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    overflow: hidden;
                    transition: height 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
                    height: 60px;
                }

                #marmoset-color-controls.expanded {
                    height: 720px;
                }

                .color-controls-header {
                    background: linear-gradient(135deg, rgba(15, 52, 96, 0.9), rgba(26, 26, 46, 0.9));
                    padding: 0 20px;
                    border-bottom: 1px solid rgba(76, 201, 240, 0.2);
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    cursor: pointer;
                }

                .header-content h3 {
                    margin: 0;
                    color: #4cc9f0;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                }

                .toggle-btn {
                    background: rgba(76, 201, 240, 0.1);
                    border: 1px solid rgba(76, 201, 240, 0.3);
                    color: #4cc9f0;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                }

                .toggle-btn:hover {
                    background: rgba(76, 201, 240, 0.2);
                    border-color: rgba(76, 201, 240, 0.5);
                    transform: scale(1.1);
                }

                .color-controls-body {
                    padding: 20px 24px;
                    transition: all 0.4s cubic-bezier(0, 0, 1, 1);
                    opacity: 1;
                    transform: translateY(0);
                    overflow: hidden;
                }

                #marmoset-color-controls:not(.expanded) .color-controls-body {
                    opacity: 0;
                    transform: translateY(-10px);
                    pointer-events: none;
                }

                .color-control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .color-control {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .color-control label {
                    color: #e6e6e6;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .color-input-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .color-control input[type="color"] {
                    width: 48px;
                    height: 32px;
                    border: 2px solid rgba(76, 201, 240, 0.3);
                    border-radius: 8px;
                    background: #16213e;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .color-control input[type="color"]:hover {
                    border-color: rgba(76, 201, 240, 0.6);
                    transform: scale(1.05);
                }

                .color-value {
                    color: rgba(230, 230, 230, 0.8);
                    font-size: 11px;
                    font-family: 'Monaco', 'Consolas', monospace;
                    font-weight: 500;
                }

                .premade-themes {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(76, 201, 240, 0.1);
                }

                .themes-label {
                    color: #e6e6e6;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 12px;
                }

                .theme-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .theme-btn {
                    padding: 8px 12px;
                    background: rgba(230, 230, 230, 0.1);
                    border: 1px solid rgba(230, 230, 230, 0.2);
                    border-radius: 6px;
                    color: #e6e6e6;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .theme-btn:hover {
                    background: rgba(230, 230, 230, 0.15);
                    border-color: rgba(230, 230, 230, 0.3);
                    transform: translateY(-1px);
                }

                .control-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(76, 201, 240, 0.1);
                }

                .control-buttons button {
                    flex: 1;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .btn-primary {
                    background-color: ${currentColors.accent} !important;
                    border-color: ${currentColors.accent} !important;
                    color: white !important;
                }

                .btn-primary:hover {
                    background-color: ${currentColors.accent} !important;
                    border-color: ${currentColors.accent} !important;
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                #marmoset-color-controls:not(.expanded) .toggle-btn {
                    transform: rotate(180deg);
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
            updateColorValue(this, e.target.value);
            updateTheme();
        });

        document.getElementById('color-secondary').addEventListener('input', function(e) {
            currentColors.secondary = e.target.value;
            updateColorValue(this, e.target.value);
            updateTheme();
        });

        document.getElementById('color-accent').addEventListener('input', function(e) {
            currentColors.accent = e.target.value;
            updateColorValue(this, e.target.value);
            updateTheme();
            updateControlPanelStyles();
        });

        document.getElementById('color-text').addEventListener('input', function(e) {
            currentColors.text = e.target.value;
            updateColorValue(this, e.target.value);
            updateTheme();
        });

        document.getElementById('color-header').addEventListener('input', function(e) {
            currentColors.header = e.target.value;
            updateColorValue(this, e.target.value);
            updateTheme();
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const themeName = this.getAttribute('data-theme');
                applyPremadeTheme(themeName);
            });
        });

        // Control buttons
        document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
        document.getElementById('toggle-controls').addEventListener('click', toggleControls);

        // Make header clickable too
        document.querySelector('.color-controls-header').addEventListener('click', function(e) {
            if (e.target.closest('.toggle-btn')) return; // Don't trigger if clicking the button itself
            toggleControls();
        });

        function updateColorValue(element, color) {
            const valueSpan = element.parentElement.querySelector('.color-value');
            if (valueSpan) {
                valueSpan.textContent = color;
            }
        }
    }

    function updateControlPanelStyles() {
        const styleElement = document.getElementById('marmoset-controls-styles');
        if (styleElement) {
            styleElement.innerHTML = styleElement.innerHTML.replace(
                /\.btn-primary\s*{[\s\S]*?}/g,
                `.btn-primary {
                    background-color: ${currentColors.accent} !important;
                    border-color: ${currentColors.accent} !important;
                    color: white !important;
                }

                .btn-primary:hover {
                    background-color: ${currentColors.accent} !important;
                    border-color: ${currentColors.accent} !important;
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }`
            );
        }
    }

    function applyPremadeTheme(themeName) {
        const theme = premadeThemes[themeName];
        if (theme) {
            currentColors = {...theme};

            // Update color pickers and value displays
            document.getElementById('color-primary').value = currentColors.primary;
            document.getElementById('color-primary').dispatchEvent(new Event('input'));

            document.getElementById('color-secondary').value = currentColors.secondary;
            document.getElementById('color-secondary').dispatchEvent(new Event('input'));

            document.getElementById('color-accent').value = currentColors.accent;
            document.getElementById('color-accent').dispatchEvent(new Event('input'));

            document.getElementById('color-text').value = currentColors.text;
            document.getElementById('color-text').dispatchEvent(new Event('input'));

            document.getElementById('color-header').value = currentColors.header;
            document.getElementById('color-header').dispatchEvent(new Event('input'));

            updateTheme();
            updateControlPanelStyles();
        }
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

                .breadcrumb {
                    background-color: ${currentColors.accent} !important;
                    color: white !important;
                }

                .breadcrumb a {
                    color: white !important;
                }

                .breadcrumb a:hover {
                    color: #add8e6 !important;
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

        if (controls.classList.contains('expanded')) {
            controls.classList.remove('expanded');
        } else {
            controls.classList.add('expanded');
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