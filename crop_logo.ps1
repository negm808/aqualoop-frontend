Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\alnour\Desktop\Aqualoop\client\public\source-logo.png"
if (-Not (Test-Path $sourcePath)) {
    Write-Host "Source logo not found at $sourcePath"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($sourcePath)
$size = [math]::Min($img.Width, $img.Height)
$rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, $rect, 0, 0, $size, $size, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save("c:\Users\alnour\Desktop\Aqualoop\client\public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp192 = New-Object System.Drawing.Bitmap($bmp, 192, 192)
$bmp192.Save("c:\Users\alnour\Desktop\Aqualoop\client\public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp180 = New-Object System.Drawing.Bitmap($bmp, 180, 180)
$bmp180.Save("c:\Users\alnour\Desktop\Aqualoop\client\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$g.Dispose()
$bmp.Dispose()
$bmp192.Dispose()
$bmp180.Dispose()

Write-Host "Icons generated successfully."
