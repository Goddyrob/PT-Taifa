if (Test-Path 'node_modules') { Remove-Item -Force -Recurse 'node_modules' -ErrorAction SilentlyContinue }
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' install
