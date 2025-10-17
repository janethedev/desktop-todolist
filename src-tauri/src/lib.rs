use std::fs;
use tauri::Manager;
use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState};
use tauri::menu::{Menu, MenuItem};
use serde::{Deserialize, Serialize};

// 窗口状态结构
#[derive(Serialize, Deserialize, Debug)]
struct WindowState {
    width: u32,
    height: u32,
    x: i32,
    y: i32,
}

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

// 保存窗口状态
#[tauri::command]
fn save_window_state(app: tauri::AppHandle, width: u32, height: u32, x: i32, y: i32) -> Result<(), String> {
    let app_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?;
    
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    let state = WindowState { width, height, x, y };
    let state_json = serde_json::to_string(&state).map_err(|e| e.to_string())?;
    
    let state_path = app_dir.join("window_state.json");
    fs::write(state_path, state_json).map_err(|e| e.to_string())?;
    
    Ok(())
}

// 加载窗口状态
fn load_window_state(app: &tauri::AppHandle) -> Option<WindowState> {
    let app_dir = app.path().app_data_dir().ok()?;
    let state_path = app_dir.join("window_state.json");
    
    if state_path.exists() {
        let state_json = fs::read_to_string(state_path).ok()?;
        serde_json::from_str(&state_json).ok()
    } else {
        None
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
      
      // 恢复窗口状态
      if let Some(window) = app.get_webview_window("main") {
        if let Some(state) = load_window_state(&app.handle()) {
          // 应用保存的窗口大小和位置
          let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
            width: state.width,
            height: state.height,
          }));
          let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: state.x,
            y: state.y,
          }));
        }
        
        // 监听窗口移动和调整大小事件，自动保存
        let app_handle = app.handle().clone();
        window.on_window_event(move |event| {
          if let tauri::WindowEvent::Resized(_) | tauri::WindowEvent::Moved(_) = event {
            if let Some(window) = app_handle.get_webview_window("main") {
              if let (Ok(size), Ok(position)) = (window.outer_size(), window.outer_position()) {
                let _ = save_window_state(
                  app_handle.clone(),
                  size.width,
                  size.height,
                  position.x,
                  position.y,
                );
              }
            }
          }
        });
      }
      
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
      toggle_always_on_top,
      save_window_state
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
