# iOS Manual Steps (Xcode-only — cannot be done from Windows)

These steps must be performed in Xcode on macOS before the first App Store
submission. They require editing `project.pbxproj` in ways that are unsafe
to do from a non-Xcode tool.

## 1. Add `PrivacyInfo.xcprivacy` to the App target's bundle resources
The file `ios/App/App/PrivacyInfo.xcprivacy` has been created on disk but
is NOT yet referenced by the Xcode project.

In Xcode:
1. Open `ios/App/App.xcworkspace` (or `App.xcodeproj` if SPM-only).
2. In the Project Navigator, right-click the `App` group → **Add Files to "App"…**
3. Select `PrivacyInfo.xcprivacy`.
4. Make sure **"Copy items if needed"** is **unchecked** (the file is
   already in the right place) and **"Add to targets: App"** is checked.
5. Confirm it appears in **Target App → Build Phases → Copy Bundle Resources**.

## 2. (Optional) Verify Signing & Capabilities
- Bundle Identifier should read `com.ltnsali.places` for both Debug and Release.
- Set your Apple Developer Team under **Signing & Capabilities**.
- Capacitor 8 uses Swift Package Manager (no `Podfile`). Xcode will
  resolve packages automatically the first time the workspace is opened.

## 3. Optional polish (not blocking)
- Replace placeholder icon in `Assets.xcassets/AppIcon.appiconset`.
- Replace splash screen in `Assets.xcassets/Splash.imageset`.
