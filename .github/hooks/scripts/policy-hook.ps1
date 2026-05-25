param(
  [Parameter(Mandatory = $false)]
  [string]$Mode = "PreToolUse"
)

$ErrorActionPreference = "Stop"

function Write-Json($obj) {
  $obj | ConvertTo-Json -Depth 10 -Compress
}

function Get-InputJson() {
  $raw = [Console]::In.ReadToEnd()
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  try { return $raw | ConvertFrom-Json -Depth 50 } catch { return $null }
}

function Get-CommandText($inputObj) {
  if ($null -eq $inputObj) { return "" }

  $possible = @(
    $inputObj.toolInput.command,
    $inputObj.toolInput.args,
    $inputObj.command,
    $inputObj.input.command,
    $inputObj.input.args
  )

  foreach ($p in $possible) {
    if ($null -ne $p -and "$p".Trim().Length -gt 0) {
      return "$p"
    }
  }

  return ($inputObj | ConvertTo-Json -Depth 8 -Compress)
}

function Is-Destructive($text) {
  $t = $text.ToLowerInvariant()

  $denyPatterns = @(
    'rm -rf /',
    'rm -rf *',
    'del /f /s /q',
    'format ',
    'shutdown ',
    'reboot',
    'git reset --hard',
    'git clean -fdx',
    'remove-item -recurse -force .',
    'remove-item -recurse -force *'
  )

  foreach ($p in $denyPatterns) {
    if ($t.Contains($p)) { return $true }
  }

  return $false
}

function Is-RiskyEditViaShell($text) {
  $t = $text.ToLowerInvariant()

  $askPatterns = @(
    ' > ',
    '>>',
    'sed -i',
    'perl -pi',
    'tee ',
    'out-file',
    'set-content',
    'add-content'
  )

  foreach ($p in $askPatterns) {
    if ($t.Contains($p)) { return $true }
  }

  return $false
}

$inputObj = Get-InputJson

if ($Mode -eq "SessionStart") {
  $msg = @"
Policy active: prefer read/search/edit tools for source changes, avoid destructive terminal commands, and request confirmation for shell-based bulk rewrites.
"@

  Write-Output (Write-Json @{ continue = $true; systemMessage = $msg })
  exit 0
}

if ($Mode -eq "PreToolUse") {
  $cmdText = Get-CommandText $inputObj

  if (Is-Destructive $cmdText) {
    Write-Output (Write-Json @{
      hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "deny"
        permissionDecisionReason = "Blocked potentially destructive command. Use safer scoped command or request explicit override."
      }
    })
    exit 2
  }

  if (Is-RiskyEditViaShell $cmdText) {
    Write-Output (Write-Json @{
      hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "ask"
        permissionDecisionReason = "Shell-based file rewrite detected. Prefer edit tools for auditable diffs."
      }
    })
    exit 0
  }

  Write-Output (Write-Json @{ continue = $true })
  exit 0
}

Write-Output (Write-Json @{ continue = $true })
exit 0
