param(
  [int]$MaxAttempts = 3
)

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo
$report = Join-Path $repo "test-agent-report.txt"
$success = $false

for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
  "Test Agent attempt $attempt/$MaxAttempts - $(Get-Date -Format o)" | Set-Content -LiteralPath $report
  try {
    & powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "test-agent-data.ps1") *>> $report
    if (-not (Test-Path -LiteralPath (Join-Path $repo "node_modules"))) { npm install --no-audit --no-fund *>> $report }
    npm run lint *>> $report
    npm run build *>> $report
    git diff --check *>> $report
    $success = $true
    "PASS" | Add-Content -LiteralPath $report
    break
  } catch {
    "FAIL: $($_.Exception.Message)" | Add-Content -LiteralPath $report
    if ($attempt -lt $MaxAttempts) { Start-Sleep -Seconds 2 }
  }
}

if (-not $success) { Write-Error "Test Agent failed after $MaxAttempts attempts. See $report"; exit 1 }
Write-Output "Test Agent passed. Report: $report"
