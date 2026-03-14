---
description: Kill Gradle/Java processes to free memory. Run when system is low on RAM or before heavy operations.
---

# Kill Gradle Server

This workflow kills all Java/Gradle processes to free memory. Use it when:
- System is running low on RAM
- Getting "paging file too small" errors
- Before starting heavy operations (browser testing, npm builds)

## Steps

// turbo
1. Check for running Java/Gradle processes:
```powershell
Get-Process | Where-Object { $_.ProcessName -match "gradle|java" } | Select-Object Id, ProcessName, @{N='MB';E={[math]::Round($_.WorkingSet64/1MB,0)}} | Sort-Object MB -Descending
```

2. Kill all Java/Gradle processes:
```powershell
Get-Process | Where-Object { $_.ProcessName -match "gradle|java" } | Stop-Process -Force; Write-Host "All Java/Gradle processes killed"
```

// turbo
3. Verify no processes remain:
```powershell
$remaining = Get-Process | Where-Object { $_.ProcessName -match "gradle|java" } | Measure-Object; if ($remaining.Count -eq 0) { Write-Host "OK - No Java/Gradle processes running" } else { Write-Host "WARNING - $($remaining.Count) processes still running" }
```

## Prevention (Already Configured)

Gradle daemon has been disabled globally in `~/.gradle/gradle.properties`:
```properties
org.gradle.daemon=false
org.gradle.jvmargs=-Xmx256m
```
