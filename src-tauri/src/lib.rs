use std::fs;
use tauri::Manager;

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
    window.close().unwrap();
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
    .setup(|app| {
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
      toggle_always_on_top
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
