# Run Prisma setup for Jaguar_Loca
# Usage: Open PowerShell at the project root and run:
#   powershell -ExecutionPolicy Bypass -File .\scripts\run-prisma-setup.ps1

$LogFile = "$PSScriptRoot\prisma-setup.log"
Remove-Item -Force -ErrorAction SilentlyContinue $LogFile

function Log($msg) {
    $t = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$t  $msg" | Out-File -FilePath $LogFile -Append -Encoding UTF8
}

Log "=== START prisma setup ==="

Log "1) npm install"
npm install 2>&1 | Out-File -FilePath $LogFile -Append -Encoding UTF8
if ($LASTEXITCODE -ne 0) { Log "npm install failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

$schema = "backend/prisma/schema.prisma"

Log "2) prisma generate --schema=$schema"
npx prisma generate --schema=$schema 2>&1 | Out-File -FilePath $LogFile -Append -Encoding UTF8
if ($LASTEXITCODE -ne 0) { Log "prisma generate failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Log "3) prisma migrate dev --name add_reserva_and_veiculo_reservado --schema=$schema"
# Run migrate dev; if you only want to push without migrations, change to "prisma db push"
npx prisma migrate dev --name add_reserva_and_veiculo_reservado --schema=$schema 2>&1 | Out-File -FilePath $LogFile -Append -Encoding UTF8
if ($LASTEXITCODE -ne 0) { Log "prisma migrate failed with exit code $LASTEXITCODE"; Log "You can try 'npx prisma db push --schema=$schema' as an alternative."; exit $LASTEXITCODE }

Log "4) prisma generate (again)"
npx prisma generate --schema=$schema 2>&1 | Out-File -FilePath $LogFile -Append -Encoding UTF8

Log "=== END prisma setup ==="

Write-Host "Finished. Log written to: $LogFile"
Write-Host "If there were errors, open the log file and paste its contents here so I can help."