# Creates display copies only. Received photographs remain unchanged in public/media.
param([int[]]$Widths = @(96, 320, 640, 960), [long]$Quality = 86)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$albumRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$albumPublic = [IO.Path]::GetFullPath((Join-Path $albumRoot 'public'))
$albumOutput = [IO.Path]::GetFullPath((Join-Path $albumPublic 'media/optimized'))
if (-not $albumOutput.StartsWith($albumPublic + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'The output directory must stay inside the album public directory.'
}
[IO.Directory]::CreateDirectory($albumOutput) | Out-Null
$albumManifest = Get-Content -LiteralPath (Join-Path $albumRoot 'src/content/media.json') -Raw -Encoding utf8 | ConvertFrom-Json
$albumEncoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$albumParameters = New-Object Drawing.Imaging.EncoderParameters(1)
$albumParameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, $Quality)
$albumCount = 0
try {
  foreach ($albumAsset in $albumManifest) {
    if ($albumAsset.type -ne 'image') { continue }
    $albumSourcePath = [IO.Path]::GetFullPath((Join-Path $albumPublic $albumAsset.webFile))
    if (-not $albumSourcePath.StartsWith($albumPublic + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
      throw 'The source photograph must stay inside the album public directory.'
    }
    $albumSource = [Drawing.Image]::FromFile($albumSourcePath)
    try {
      foreach ($albumWidth in $Widths) {
        if ($albumWidth -ge $albumSource.Width) { continue }
        $albumHeight = [Math]::Max(1, [int][Math]::Round($albumSource.Height * $albumWidth / $albumSource.Width))
        $albumBitmap = New-Object Drawing.Bitmap($albumWidth, $albumHeight, [Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $albumGraphics = [Drawing.Graphics]::FromImage($albumBitmap)
        try {
          $albumGraphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
          $albumGraphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
          $albumGraphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
          $albumGraphics.DrawImage($albumSource, (New-Object Drawing.Rectangle(0, 0, $albumWidth, $albumHeight)))
          $albumTarget = Join-Path $albumOutput ($albumAsset.label.ToLowerInvariant() + '-' + $albumWidth + '.jpg')
          $albumBitmap.Save($albumTarget, $albumEncoder, $albumParameters)
          $albumCount++
        } finally {
          $albumGraphics.Dispose()
          $albumBitmap.Dispose()
        }
      }
    } finally { $albumSource.Dispose() }
  }
} finally { $albumParameters.Dispose() }
Write-Output "Created $albumCount responsive JPEG copies. Original media was preserved."
