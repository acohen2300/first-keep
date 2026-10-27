# First Keep: from web page to App Store app

Adapted from SoRen's prep (`soren-archive/p16/APP-PREP.md`). The same path, the same tools.

## Already right
- **One file.** No external scripts, no eval, no analytics. Nothing is downloaded but the two typefaces. App Store rule 2.5.2 (no downloaded code) is met.
- **Storage:** two localStorage keys on the phone: `firstkeep.save` (the game) and `firstkeep.settings`, plus `firstkeep.best`. Privacy label: **Data Not Collected**. A one-paragraph privacy policy page is still required by App Store Connect.
- **Sound:** starts on the first touch, and respects the silent switch (`audioSession = 'ambient'`, Build 22).
- **Saving:** every 10 s, and on `visibilitychange` and `pagehide`.
- **Safety net:** an error never stops the loop. A second kind of error saves the game, pauses it and offers Restart. Failed promises (`unhandledrejection`) count too.
- **Load shedding:** a phone that keeps falling behind drops the moving extras, then draws at half its pixels.
- **Battery:** when paused, it draws at 15 frames a second.
- **Haptics:** the `NATIVE` seam (14-sound.js). In the native app the Capacitor Haptics plugin gives the iPhone's taptic engine. Safari cannot vibrate, but Android's browser can.
- **The native copy:** `python3 wrap.py` writes `native/index.html`. It is the same game in a full page with `viewport-fit=cover`, the safe areas and a lock-down Content-Security-Policy. Point Capacitor's `webDir` at `native/`.

## To do, in order
1. **Accounts and tools:** Apple Developer Program ($99 a year), a Mac with Xcode (no way round it for iOS), Node LTS, and an iPhone for TestFlight.
2. **Typefaces offline.** IM Fell English SC and Barlow Semi Condensed come from Google Fonts. In the app they must be bundled (both are SIL Open Font License) or the system fonts take over. This is one change in `shell-head.html`: an `@font-face` with the files in `native/`.
3. **Assets:** a 1024×1024 icon with no transparency, a splash on `#121715`, screenshots at 6.7" and 6.1", the name, a subtitle, a description, keywords, a support URL and a privacy policy URL.
4. **Capacitor:** `@capacitor/core`, `cli`, `ios`, `haptics`, `status-bar`, `splash-screen`. In `capacitor.config`:
   - pin `ios.scheme` once (changing it later orphans every save);
   - `backgroundColor: '#121715'`;
   - `ios.scrollEnabled: false` (no rubber-band bounce);
   - a short splash fade.
5. **Info.plist:** portrait only; status bar light on dark.
6. **TestFlight** with 20 to 50 testers before the store. Watch the first ten minutes of new players: where they stop, what they tap.
7. **Android later:** Google Play Console ($25 once). Vibration already works there.

## Review notes to write
- **4.2 (minimum functionality):** a full strategy game; everything is generated on the device; works offline once the typefaces are bundled.
- **5.1.1:** nothing is collected; saves stay on the phone.
- **Purchases (when added):** variety, looks and convenience only. Never power (CUTS.md, design rule).
