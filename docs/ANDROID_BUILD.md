# Building the Android app (Google Play)

The app is the PWA wrapped with **Capacitor 8** (`@capacitor/core|cli|android` 8.5.3, Node >= 22, JDK 21, Android Gradle Plugin 8.13, Gradle 8.14.3).
`compileSdk` / `targetSdk` = **36** (Capacitor 8 default), `minSdk` = 24. Google Play requires new apps and updates to target a recent API level (API 35 or higher at the time of writing); 36 satisfies this. Re-check the requirement each August at <https://developer.android.com/google/play/requirements/target-sdk> and upgrade Capacitor if it moves.

Current identity (final name: One-Type; the application id is permanent after the first Play upload):

| Item | Value | Where it lives |
|---|---|---|
| Application id | `com.wilmymoise.onehandtype` | `capacitor.config.ts` (`appId`), `android/app/build.gradle` (`namespace`, `applicationId`), Java package dir `android/app/src/main/java/com/wilmymoise/onehandtype/`, `android/app/src/main/res/values/strings.xml` |
| App name | `One-Type` | `capacitor.config.ts` (`appName`), `android/app/src/main/res/values/strings.xml` |
| versionName / versionCode | `1.0.0` / `1` | `android/app/build.gradle` |

## A. Zero-install route (GitHub Actions)

You need nothing installed locally except a way to create the upload keystore once (the project owner will hand you a keystore separately; keep it private and back it up, never commit it).

1. In the GitHub repo go to **Settings > Secrets and variables > Actions > New repository secret** and add:
   - `ANDROID_KEYSTORE_BASE64` - base64 of the upload keystore: `base64 -w0 upload.jks` (macOS: `base64 -i upload.jks`). Paste the single line.
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
2. Go to **Actions > Android release > Run workflow** (or push a tag such as `v1.0.0`).
3. When it finishes, open the run and download the **onetype-release-aab** artifact (`app-release.aab`). Upload that file to Play Console. The **onetype-release-apk** artifact is a signed APK for sideload testing.
4. Without the keystore secrets the workflow still succeeds and produces an **unsigned-for-release debug APK** (`onetype-debug-apk`) for quick device testing; it cannot be uploaded to Play.

Creating a new upload keystore yourself (needs a JDK):

```bash
keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

## B. Local route (Android Studio)

Prereqs: Node 22, JDK 21, Android Studio (installs the Android SDK).

```bash
npm ci
npm run cap:sync        # builds the web app and copies it into android/
npx cap open android    # opens Android Studio
```

- Debug on a device: Run in Android Studio.
- Signed release bundle from the command line:
  ```bash
  export ANDROID_KEYSTORE_PATH=/absolute/path/upload.jks
  export ANDROID_KEYSTORE_PASSWORD=...  ANDROID_KEY_ALIAS=upload  ANDROID_KEY_PASSWORD=...
  cd android && ./gradlew bundleRelease
  # -> android/app/build/outputs/bundle/release/app-release.aab
  ```
  If `ANDROID_KEYSTORE_PATH` is unset, the release build is simply unsigned, so local builds never fail.
- After any web change run `npm run cap:sync` again (the web assets inside `android/` are generated and git-ignored).
- Launcher icons: `npm run android:icons` regenerates them from `client/public/icons/maskable-512.png` and `client/public/logo-maskable.svg` (adaptive background `#0f101a`).
- Release builds have WebView debugging off (Capacitor enables it only for debuggable builds).

## Changing the app id

Do this **before the first Play upload** - the id is permanent afterwards.

1. `capacitor.config.ts`: change `appId`.
2. `android/app/build.gradle`: change `namespace` and `applicationId`.
3. Move `android/app/src/main/java/com/wilmymoise/onehandtype/MainActivity.java` into the matching new package folders and update its `package` line.
4. `android/app/src/main/res/values/strings.xml`: update `package_name` and `custom_url_scheme`.
5. `npm run cap:sync`.

Regenerate icons afterwards with `npm run android:icons` if the res folder changed.

## Changing the app name

Edit `appName` in `capacitor.config.ts` and `app_name` / `title_activity_main` in `android/app/src/main/res/values/strings.xml`.

## Releasing an update

Every upload to Play needs a **higher versionCode**. In `android/app/build.gradle` bump:

```groovy
versionCode 2        // integer, +1 for every upload
versionName "1.0.1"  // shown to users
```

Commit, tag (`git tag v1.0.1 && git push --tags`) or re-run the workflow, upload the new `.aab`.

## Play App Signing (recommended)

When you create the app, enrol in **Play App Signing** (default for new apps). Then:
- The key in your keystore is only the **upload key**. Google holds the real **app signing key**.
- If the upload key is lost or leaked, you can ask Google to reset it; with a self-managed signing key you could never update the app again.
- Keep `upload.jks` and its passwords in a password manager plus an offline backup.

## Network and permissions

The Capacitor template declares `INTERNET` (needed for its local `https://localhost` WebView scheme). The app code makes no network requests. `VIBRATE` is declared for optional haptic feedback. No other permissions.
