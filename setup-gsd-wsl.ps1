# ==============================================================================
# setup-gsd-wsl.ps1
# Automates setting up gsd-build/get-shit-done with Cursor in WSL Ubuntu.
# Run from PowerShell as Administrator.
# ==============================================================================

#Requires -RunAsAdministrator

# ------------------------------------------------------------------------------
# Configuration — edit these if needed
# ------------------------------------------------------------------------------
$RepoURL          = "https://github.com/gsd-build/get-shit-done.git"
$CursorBinaryPath = "/usr/local/bin/cursor"   # Full path to Cursor CLI inside WSL

# Resolve the WSL username at runtime — avoids the $env:USER Windows/WSL mismatch
$WSLUser = (wsl bash -c "whoami").Trim()
if (-not $WSLUser) {
    Write-Host "ERROR: Could not determine WSL username. Is WSL installed and configured?" -ForegroundColor Red
    exit 1
}

$LocalPath   = "/home/$WSLUser/get-shit-done"
$PlanningDir = "$LocalPath/.planning"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  GSD + Cursor WSL Setup" -ForegroundColor Cyan
Write-Host "  WSL user  : $WSLUser" -ForegroundColor Cyan
Write-Host "  Repo path : $LocalPath" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------------------------

function Invoke-WSL {
    <#
    .SYNOPSIS
        Runs a bash command in WSL and streams output in real time.
        Throws a terminating error if the command exits non-zero.
    #>
    param (
        [Parameter(Mandatory)][string]$Command,
        [string]$Description = ""
    )

    if ($Description) {
        Write-Host "  >> $Description" -ForegroundColor DarkGray
    }

    wsl bash -c "$Command"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Command failed (exit $LASTEXITCODE):" -ForegroundColor Red
        Write-Host "  $Command" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

function Test-WSLCommand {
    <#
    .SYNOPSIS
        Returns $true if a named command exists in the WSL PATH.
    #>
    param ([string]$Command)
    wsl bash -c "command -v $Command > /dev/null 2>&1"
    return $LASTEXITCODE -eq 0
}

function Test-WSLPath {
    <#
    .SYNOPSIS
        Returns $true if a file or directory exists inside WSL.
    #>
    param ([string]$Path)
    wsl bash -c "test -e '$Path'"
    return $LASTEXITCODE -eq 0
}

function Write-Step {
    param ([string]$Message)
    Write-Host ""
    Write-Host "-- $Message" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# Step 1: Preflight checks
# ------------------------------------------------------------------------------
Write-Step "Step 1: Preflight checks"

$prerequisites = @(
    @{ Command = "git";  Label = "Git"     }
    @{ Command = "node"; Label = "Node.js" }
    @{ Command = "npm";  Label = "npm"     }
)

foreach ($p in $prerequisites) {
    Write-Host "  Checking $($p.Label)..." -NoNewline
    if (Test-WSLCommand $p.Command) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " NOT FOUND" -ForegroundColor Red
        Write-Host "ERROR: $($p.Label) is not installed in WSL. Please install it and re-run." -ForegroundColor Red
        exit 1
    }
}

# Cursor uses a full path, so we test with -x (executable exists) rather than command -v
Write-Host "  Checking Cursor CLI ($CursorBinaryPath)..." -NoNewline
wsl bash -c "test -x '$CursorBinaryPath'"
if ($LASTEXITCODE -ne 0) {
    Write-Host " NOT FOUND" -ForegroundColor Red
    Write-Host "ERROR: Cursor CLI not found at $CursorBinaryPath inside WSL." -ForegroundColor Red
    Write-Host "       Install the Cursor CLI in WSL and update `$CursorBinaryPath if needed." -ForegroundColor Yellow
    exit 1
}
Write-Host " OK" -ForegroundColor Green

# ------------------------------------------------------------------------------
# Step 2: Clone or update the repository
# ------------------------------------------------------------------------------
Write-Step "Step 2: Clone or update repository"

if (Test-WSLPath $LocalPath) {
    Write-Host "  Repository already exists — pulling latest changes..."
    Invoke-WSL "cd '$LocalPath' && git pull" "git pull"
} else {
    Write-Host "  Cloning repository to $LocalPath ..."
    Invoke-WSL "git clone '$RepoURL' '$LocalPath'" "git clone"
}

# ------------------------------------------------------------------------------
# Step 3: Install npm dependencies
# ------------------------------------------------------------------------------
Write-Step "Step 3: Install npm dependencies"

if (Test-WSLPath "$LocalPath/node_modules") {
    Write-Host "  node_modules already present — skipping install."
    Write-Host "  (Delete $LocalPath/node_modules inside WSL to force a reinstall.)"
} else {
    Write-Host "  Running npm install..."
    Invoke-WSL "cd '$LocalPath' && npm install" "npm install"
}

# ------------------------------------------------------------------------------
# Step 4: Ensure GSD config section exists
# ------------------------------------------------------------------------------
Write-Step "Step 4: Configure GSD project"

Invoke-WSL "cd '$LocalPath' && node ./bin/gsd-tools.cjs config-ensure-section" "gsd config-ensure-section"

# ------------------------------------------------------------------------------
# Step 5: Write .cursor configuration
# ------------------------------------------------------------------------------
Write-Step "Step 5: Generate .cursor configuration"

$CursorConfigPath = "$LocalPath/.cursor"

if (Test-WSLPath $CursorConfigPath) {
    Write-Host "  .cursor already exists — skipping."
} else {
    Write-Host "  Writing .cursor configuration..."

    # Build JSON in PowerShell so formatting is guaranteed valid,
    # then copy it into WSL.
    $cursorJson = @{
        fileTypesToInclude = @("*.js", "*.cjs", "*.md")
        fileTypesToIgnore  = @("node_modules", "dist")
        languages          = @("JavaScript")
    } | ConvertTo-Json -Depth 3

    # Write to a temp file on the Windows side, then copy into WSL
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $cursorJson -Encoding UTF8

    $winPath = $tempFile -replace '\\', '/'
    $wslPath = (wsl wslpath -a "$winPath").Trim()

    Invoke-WSL "cp '$wslPath' '$CursorConfigPath'" "copy .cursor config"
    Remove-Item $tempFile -Force
    Write-Host "  .cursor written." -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# Step 6: Index the repository with Cursor
# ------------------------------------------------------------------------------
Write-Step "Step 6: Index repository with Cursor"

Invoke-WSL "cd '$LocalPath' && '$CursorBinaryPath' index ." "cursor index"

# ------------------------------------------------------------------------------
# Step 7: Initialize the GSD framework
# ------------------------------------------------------------------------------
Write-Step "Step 7: Initialize GSD project structure"

Invoke-WSL "cd '$LocalPath' && node ./bin/gsd-tools.cjs init new-project" "gsd init"

# ------------------------------------------------------------------------------
# Step 8: Scaffold initial phases
# ------------------------------------------------------------------------------
Write-Step "Step 8: Scaffold context, verification, and UAT phases"

Invoke-WSL "cd '$LocalPath' && node ./bin/gsd-tools.cjs scaffold context      --phase initial-phase" "scaffold context"
Invoke-WSL "cd '$LocalPath' && node ./bin/gsd-tools.cjs scaffold verification --phase initial-phase" "scaffold verification"
Invoke-WSL "cd '$LocalPath' && node ./bin/gsd-tools.cjs scaffold uat          --phase initial-phase" "scaffold uat"

# ------------------------------------------------------------------------------
# Step 9: Final validation
# ------------------------------------------------------------------------------
Write-Step "Step 9: Final validation"

Invoke-WSL "cd '$LocalPath' && '$CursorBinaryPath' validate ." "cursor validate"

# ------------------------------------------------------------------------------
# Done
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands inside WSL:" -ForegroundColor Yellow
Write-Host "  Navigate to repo  :  wsl bash -c \"cd $LocalPath && bash\"" -ForegroundColor Yellow
Write-Host "  View progress     :  wsl bash -c \"cd $LocalPath && node ./bin/gsd-tools.cjs progress table\"" -ForegroundColor Yellow
Write-Host "  Re-index Cursor   :  wsl bash -c \"cd $LocalPath && '$CursorBinaryPath' index .\"" -ForegroundColor Yellow
Write-Host "  Manage phases     :  files are under $PlanningDir" -ForegroundColor Yellow
Write-Host ""

