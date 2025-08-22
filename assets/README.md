# Setting Application Icon for Zettel

## How to set the application icon:

1. **Create your icon files:**
   - `icon.ico` - Windows icon file (32x32 or 16x16 pixels)
   - `icon.png` - PNG icon file (32x32 pixels for Linux)
   - `icon.icns` - macOS icon file

2. **Place the icon files in the `assets` folder:**
   ```
   assets/
   ├── icon.ico
   ├── icon.png
   └── icon.icns
   ```

3. **Icon specifications:**
   - **Windows (.ico):** Should contain multiple sizes (16x16, 32x32, 48x48)
   - **macOS (.icns):** Should contain multiple sizes (16x16 to 512x512)
   - **Linux (.png):** 32x32 or 48x48 pixels

4. **Creating icons:**
   - Use online converters like https://convertio.co/png-ico/
   - Use tools like GIMP, Photoshop, or online icon generators
   - For simple icons, use services like https://favicon.io/

5. **The application is already configured to use:**
   - `assets/icon.ico` for Windows windows and system tray
   - The build configuration will use these icons for the installer

## Current Status:
- ✅ Icon paths are configured in main.js
- ✅ Build configuration updated in package.json
- ⏳ **You need to add actual icon files to the assets folder**

## Example workflow:
1. Create a 32x32 PNG image with your desired icon design
2. Convert it to .ico format using an online converter
3. Save it as `assets/icon.ico`
4. Restart the application to see the new icon
