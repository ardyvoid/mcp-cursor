-- Script to open Cursor, focus prompt window and paste text
on run {inputText}
    -- Open Cursor IDE
    tell application "Cursor" to activate
    
    -- Give it time to fully load
    delay 5
    
    -- Simulate keyboard shortcut to open prompt (adjust this based on actual Cursor shortcut)
    tell application "System Events"
        keystroke "i" using {command down}
        delay 0.5
        
        -- Paste the input text
        set the clipboard to inputText
        keystroke "v" using {command down}
        delay 0.2
        
        -- Execute (assuming Enter/Return executes in Cursor)
        key code 36  -- Return key
    end tell
end run
