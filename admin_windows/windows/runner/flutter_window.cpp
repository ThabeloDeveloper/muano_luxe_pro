#include "flutter_window.h"

#include <optional>
#include <string>
#include "resource.h"

#include "flutter/generated_plugin_registrant.h"

FlutterWindow::FlutterWindow(const flutter::DartProject& project)
    : project_(project) {}

FlutterWindow::~FlutterWindow() {}

bool FlutterWindow::OnCreate() {
  if (!Win32Window::OnCreate()) {
    return false;
  }

  RECT frame = GetClientArea();

  // The size here must match the window dimensions to avoid unnecessary surface
  // creation / destruction in the startup path.
  flutter_controller_ = std::make_unique<flutter::FlutterViewController>(
      frame.right - frame.left, frame.bottom - frame.top, project_);
  // Ensure that basic setup of the controller was successful.
  if (!flutter_controller_->engine() || !flutter_controller_->view()) {
    return false;
  }
  RegisterPlugins(flutter_controller_->engine());
  SetChildContent(flutter_controller_->view()->GetNativeWindow());

  flutter_controller_->engine()->SetNextFrameCallback([&]() {
    if (std::wstring(GetCommandLineW()).find(L"--background") == std::wstring::npos) this->Show();
  });

  // Flutter can complete the first frame before the "show window" callback is
  // registered. The following call ensures a frame is pending to ensure the
  // window is shown. It is a no-op if the first frame hasn't completed yet.
  flutter_controller_->ForceRedraw();

  AddTray();
  HKEY prefs;
  DWORD enabled = 1, bytes = sizeof(enabled);
  if (RegCreateKeyExW(HKEY_CURRENT_USER, L"Software\\MuanoLuxeStudio", 0, nullptr, 0, KEY_READ | KEY_WRITE, nullptr, &prefs, nullptr) == ERROR_SUCCESS) {
    RegQueryValueExW(prefs, L"StartWithWindows", nullptr, nullptr, reinterpret_cast<BYTE*>(&enabled), &bytes);
    RegCloseKey(prefs);
  }
  SetStartup(enabled != 0);
  return true;
}

void FlutterWindow::OnDestroy() {
  Shell_NotifyIconW(NIM_DELETE, &tray_);
  if (flutter_controller_) {
    flutter_controller_ = nullptr;
  }

  Win32Window::OnDestroy();
}

LRESULT
FlutterWindow::MessageHandler(HWND hwnd, UINT const message,
                              WPARAM const wparam,
                              LPARAM const lparam) noexcept {
  if (message == WM_CLOSE && tray_ready_) { ShowWindow(hwnd, SW_HIDE); return 0; }
  if (message == RegisterWindowMessageW(L"TaskbarCreated")) { AddTray(); return 0; }
  if (message == WM_APP + 11) {
    if (lparam == WM_LBUTTONUP || lparam == WM_LBUTTONDBLCLK) {
      ShowWindow(hwnd, SW_RESTORE); SetForegroundWindow(hwnd);
    } else if (lparam == WM_RBUTTONUP) {
      HMENU menu = CreatePopupMenu();
      AppendMenuW(menu, MF_STRING, 1, L"Open MuanoLuxe Studio");
      AppendMenuW(menu, MF_STRING | (startup_enabled_ ? MF_CHECKED : MF_UNCHECKED), 2, L"Start with Windows");
      AppendMenuW(menu, MF_STRING, 3, L"Quit (stop alerts)");
      POINT point; GetCursorPos(&point); SetForegroundWindow(hwnd);
      int action = TrackPopupMenu(menu, TPM_RETURNCMD | TPM_RIGHTBUTTON, point.x, point.y, 0, hwnd, nullptr);
      DestroyMenu(menu);
      if (action == 1) { ShowWindow(hwnd, SW_RESTORE); SetForegroundWindow(hwnd); }
      if (action == 2) SetStartup(!startup_enabled_);
      if (action == 3) DestroyWindow(hwnd);
    }
    return 0;
  }
  // Give Flutter, including plugins, an opportunity to handle window messages.
  if (flutter_controller_) {
    std::optional<LRESULT> result =
        flutter_controller_->HandleTopLevelWindowProc(hwnd, message, wparam,
                                                      lparam);
    if (result) {
      return *result;
    }
  }

  switch (message) {
    case WM_FONTCHANGE:
      flutter_controller_->engine()->ReloadSystemFonts();
      break;
  }

  return Win32Window::MessageHandler(hwnd, message, wparam, lparam);
}

void FlutterWindow::AddTray() {
  tray_.cbSize = sizeof(tray_);
  tray_.hWnd = GetHandle();
  tray_.uID = 1;
  tray_.uFlags = NIF_MESSAGE | NIF_ICON | NIF_TIP;
  tray_.uCallbackMessage = WM_APP + 11;
  tray_.hIcon = LoadIcon(GetModuleHandle(nullptr), MAKEINTRESOURCE(IDI_APP_ICON));
  wcscpy_s(tray_.szTip, L"MuanoLuxe Studio - background alerts");
  tray_ready_ = Shell_NotifyIconW(NIM_ADD, &tray_) != FALSE;
}

void FlutterWindow::SetStartup(bool enabled) {
  HKEY key;
  if (RegOpenKeyExW(HKEY_CURRENT_USER, L"Software\\Microsoft\\Windows\\CurrentVersion\\Run", 0, KEY_SET_VALUE, &key) != ERROR_SUCCESS) return;
  wchar_t path[MAX_PATH];
  GetModuleFileNameW(nullptr, path, MAX_PATH);
  std::wstring command = L"\"" + std::wstring(path) + L"\" --background";
  LONG result = enabled ? RegSetValueExW(key, L"MuanoLuxeStudio", 0, REG_SZ, reinterpret_cast<const BYTE*>(command.c_str()), static_cast<DWORD>((command.size() + 1) * sizeof(wchar_t))) : RegDeleteValueW(key, L"MuanoLuxeStudio");
  RegCloseKey(key);
  if (result != ERROR_SUCCESS && !(result == ERROR_FILE_NOT_FOUND && !enabled)) return;
  startup_enabled_ = enabled;
  if (RegCreateKeyExW(HKEY_CURRENT_USER, L"Software\\MuanoLuxeStudio", 0, nullptr, 0, KEY_WRITE, nullptr, &key, nullptr) == ERROR_SUCCESS) {
    DWORD value = enabled ? 1 : 0;
    RegSetValueExW(key, L"StartWithWindows", 0, REG_DWORD, reinterpret_cast<const BYTE*>(&value), sizeof(value));
    RegCloseKey(key);
  }
}
