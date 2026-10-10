# MuanoLuxe Studio for Windows

The default release connects to https://muanoluxe.web.app/admin. It uses the live Firebase-backed studio and needs no local server or developer laptop.

Distribute `releases/MuanoLuxe-Studio-Windows.zip`. Extract the entire archive on each Windows 10/11 x64 laptop and run `muanoluxe_studio.exe`. Keep the DLLs and data directory beside the executable. See RUN-ME.txt for sign-in and runtime installation instructions. Internet access is required.

Packaging follows [Flutter's Windows distribution guidance](https://docs.flutter.dev/platform-integration/windows/building). This is an x64 build; a separate ARM64 build is not included.

Build from the project root with `npm run build:windows`. Local preview is explicitly opt-in: `powershell -ExecutionPolicy Bypass -File scripts/build-windows.ps1 -Preview`. Flutter development builds also use the live URL by default; use `--dart-define=STUDIO_PREVIEW=true` only for local preview.
