if (Test-Path 'node_modules') {
  Remove-Item -Force -Recurse 'node_modules' -ErrorAction SilentlyContinue
}
$newPath = 'C:\Program Files\nodejs;' + [Environment]::GetEnvironmentVariable('PATH','Process')
[Environment]::SetEnvironmentVariable('PATH',$newPath,'Process')
& 'C:\Program Files\nodejs\npm.cmd' install
