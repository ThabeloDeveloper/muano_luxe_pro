Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'public\images\muanoluxe-logo.jpg'
$destination = Join-Path $root 'admin_windows\windows\runner\resources\app_icon.ico'
$canvas = New-Object System.Drawing.Bitmap 256,256
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.Clear([System.Drawing.Color]::White)
$image = [System.Drawing.Image]::FromFile($source)
$graphics.DrawImage($image, 0, 0, 256, 256)
$icon = [System.Drawing.Icon]::FromHandle($canvas.GetHicon())
$iconStream = [System.IO.File]::Create($destination)
$icon.Save($iconStream)
$iconStream.Dispose(); $icon.Dispose(); $image.Dispose(); $graphics.Dispose(); $canvas.Dispose()
Write-Output "Updated MuanoLuxe Windows icon from $source"
