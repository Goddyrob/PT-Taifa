@echo off
cd /d C:\Users\goddy\Documents\projects\visionary-digital-hub-main
"C:\Program Files\Git\cmd\git.exe" reset HEAD -- "push.log)" > reset.log 2>&1 || echo RESET_FAILED >> reset.log
"C:\Program Files\Git\cmd\git.exe" add -A > add.log 2>&1
"C:\Program Files\Git\cmd\git.exe" status --porcelain > status.log 2>&1
"C:\Program Files\Git\cmd\git.exe" commit -m "chore: add build artifacts for Netlify deploy" > commit.log 2>&1 || echo NO_COMMIT >> commit.log
"C:\Program Files\Git\cmd\git.exe" push origin main > push.log 2>&1 || echo PUSH_FAILED >> push.log
echo DONE > done.log
type push.log
