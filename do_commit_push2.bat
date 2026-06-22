@echo off
cd /d C:\Users\goddy\Documents\projects\visionary-digital-hub-main
"C:\Program Files\Git\cmd\git.exe" add src/integrations/supabase/client.ts
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: guard supabase invalid url" || echo NO_COMMIT
"C:\Program Files\Git\cmd\git.exe" push origin main || echo PUSH_FAILED
"C:\Program Files\Git\cmd\git.exe" log -1 --oneline > last_commit.log
type last_commit.log
