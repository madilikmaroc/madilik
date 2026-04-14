# Deploy madilik to VPS
# Run from store folder: .\scripts\deploy-vps.ps1
# When prompted for password, use: EgcPMwNXU7eN

$VPS = "root@46.225.175.37"
$REMOTE_CMD = "cd /var/www/madilik && git pull origin main && npm install && npm run build && pm2 restart madilik --update-env && pm2 status madilik"

Write-Host "Deploying to VPS - Enter password when prompted" -ForegroundColor Cyan
& ssh -o StrictHostKeyChecking=no $VPS $REMOTE_CMD
