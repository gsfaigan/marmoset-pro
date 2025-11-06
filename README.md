# Marmoset Color Customizer

A Tampermonkey userscript that transforms the Marmoset interface with a customizable color theme and real-time controls.

## Features

- **Custom Color Theme** - Replace the default theme with your preferred color scheme
- **Real-time Controls** - Color sliders and pickers that update the interface instantly
- **Persistent Settings** - Color preferences are saved between sessions
- **Floating Control Panel** - Conveniently positioned on the right side of the page
- **Toggle Options** - Quickly enable/disable the theme or collapse controls

## Installation

### Prerequisites
- [Tampermonkey](https://www.tampermonkey.net/) browser extension

### Installation Steps
1. Install Tampermonkey for your browser
2. Click the Tampermonkey extension icon
3. Select "Create a new script"
4. Replace the default code with the script below
5. Save the script (Ctrl+S)
6. Navigate to any Marmoset page

## Usage

### Control Panel
The control panel appears as a floating window on the right side of the screen:

- **Color Pickers** - Click any color swatch to open a color picker
- **Brightness Sliders** - Adjust brightness levels for quick color tuning
- **Reset Button** - Restore default blue theme colors
- **Toggle Theme** - Enable/disable the custom theme
- **Collapse Button** - Minimize the control panel when not in use

### Color Controls
1. **Background** - Main page background color
2. **Secondary** - Tables, form fields, and secondary elements
3. **Accent** - Buttons, borders, and highlighted elements
4. **Text** - Primary text color throughout the interface
5. **Headers** - Headers, titles, and link colors

### Quick Actions
- Changes apply immediately in real-time
- Settings automatically save between sessions
- Theme can be toggled without losing configurations
- Panel can be collapsed to save space

## Technical Details

### Supported Elements
- Page backgrounds and containers
- Headers and text elements
- Tables and data grids
- Form inputs and buttons
- Links and navigation elements
- Status indicators

### Browser Compatibility
- Chrome (with Tampermonkey)
- Firefox (with Tampermonkey or Greasemonkey)
- Edge (with Tampermonkey)
- Safari (with Tampermonkey)

### Script Information
- **Version**: 1.2
- **Grant Permissions**: GM_setValue, GM_getValue for storage
- **Match Pattern**: https://marmoset.student.cs.uwaterloo.ca/*

## Customization Tips

### Theme Creation
- **Dark Theme**: Use dark blues and grays for backgrounds
- **Light Theme**: Set lighter backgrounds with dark text
- **High Contrast**: Use strong contrasting colors
- **Custom Palettes**: Create your own color combinations

### Recommended Combinations
- Professional: Navy blues with light gray text
- Modern: Dark backgrounds with vibrant accents
- Reading Friendly: Medium contrast with comfortable text colors

## Troubleshooting

### Common Issues
- **Script not loading**: Verify Tampermonkey is enabled and URL matches
- **Colors not saving**: Check Tampermonkey storage permissions
- **Control panel missing**: Refresh page or check browser console
- **Theme not applying**: Ensure script matches current Marmoset pages

### Debugging Steps
1. Open browser developer tools (F12)
2. Check Console tab for error messages
3. Verify script is active in Tampermonkey dashboard
4. Confirm URL pattern matches script configuration

## Version History

### v1.2
- Added collapsible control panel
- Improved color slider functionality
- Enhanced persistence system
- Better dynamic content handling

### v1.1
- Added customizable color variables
- Improved theme application timing
- Added mutation observer for dynamic content

### v1.0
- Initial release with basic blue theme
- Real-time color controls
- Persistent settings

## Contributing

Enhancement ideas:
- Add preset color schemes
- Implement draggable panel positioning
- Add export/import for color settings
- Create time-based auto-theming

## Support

For issues or suggestions:
1. Check the troubleshooting section
2. Verify Tampermonkey installation
3. Ensure proper script configuration
