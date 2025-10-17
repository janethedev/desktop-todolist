use std::fs;
use tauri::Manager;
use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState};
use tauri::menu::{Menu, MenuItem};

// 保存待办事项
#[tauri::command]
fn save_todos(app: tauri::AppHandle, todos: String) -> Result<(), String> {
    let app_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?;
    
    // 确保目录存在
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    let todos_path = app_dir.join("todos.json");
    fs::write(todos_path, todos).map_err(|e| e.to_string())?;
    
    Ok(())
}

// 加载待办事项
#[tauri::command]
fn load_todos(app: tauri::AppHandle) -> Result<String, String> {
    let app_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?;
    
    let todos_path = app_dir.join("todos.json");
    
    if todos_path.exists() {
        fs::read_to_string(todos_path).map_err(|e| e.to_string())
    } else {
        Ok("[]".to_string())
    }
}

// 关闭窗口
#[tauri::command]
fn close_window(window: tauri::Window) {
    window.hide().unwrap();
}

// 最小化窗口
#[tauri::command]
fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())?;
    Ok(())
}

// 切换窗口置顶
#[tauri::command]
fn toggle_always_on_top(window: tauri::Window, flag: bool) -> Result<(), String> {
    window.set_always_on_top(flag).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
      // 当用户尝试打开第二个实例时，显示并聚焦第一个实例的窗口
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.unminimize();
      }
    }))
    .setup(|app| {
      // 创建托盘菜单
      let show_menu_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
      let quit_menu_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_menu_item, &quit_menu_item])?;
      
      // 创建系统托盘图标
      let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("QuickTask")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| {
          // 处理菜单点击事件
          match event.id().as_ref() {
            "show" => {
              if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
              }
            }
            "quit" => {
              app.exit(0);
            }
            _ => {}
          }
        })
        .on_tray_icon_event(|tray, event| {
          // 处理左键点击显示窗口
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
        })
        .build(app)?;
      
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      save_todos,
      load_todos,
      close_window,
      minimize_window,
      toggle_always_on_top
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
