param(
  [string]$PdfPath,
  [string]$OutputPath = "pdf-ocr.txt",
  [int]$DestinationWidth = 1800
)

Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfPageRenderOptions, Windows.Data.Pdf, ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime] | Out-Null

function AwaitOperation($Operation, [type]$ResultType) {
  $method = ([System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object {
      $_.Name -eq "AsTask" -and
      $_.GetParameters().Count -eq 1 -and
      $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
    })[0]
  $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  $task.Result
}

function AwaitAction($Operation) {
  $method = ([System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object {
      $_.Name -eq "AsTask" -and
      $_.GetParameters().Count -eq 1 -and
      $_.GetParameters()[0].ParameterType.Name -eq "IAsyncAction"
    })[0]
  $task = $method.Invoke($null, @($Operation))
  $task.Wait()
}

$file = AwaitOperation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($PdfPath)) ([Windows.Storage.StorageFile])
$doc = AwaitOperation ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
  throw "No Windows OCR engine is available for the current user profile languages."
}

$chunks = New-Object System.Collections.Generic.List[string]
$chunks.Add("PDF_PAGE_COUNT: $($doc.PageCount)")

for ($i = 0; $i -lt $doc.PageCount; $i += 1) {
  Write-Progress -Activity "OCR PDF vocabulary book" -Status "Page $($i + 1) of $($doc.PageCount)" -PercentComplete (($i + 1) * 100 / $doc.PageCount)
  $page = $doc.GetPage($i)
  $stream = [Windows.Storage.Streams.InMemoryRandomAccessStream]::new()
  $options = [Windows.Data.Pdf.PdfPageRenderOptions]::new()
  $options.DestinationWidth = $DestinationWidth
  AwaitAction ($page.RenderToStreamAsync($stream, $options))
  $stream.Seek(0) | Out-Null
  $decoder = AwaitOperation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = AwaitOperation ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $ocr = AwaitOperation ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  $chunks.Add("`n===== PAGE $($i + 1) =====`n$($ocr.Text)")
  if ($bitmap -is [System.IDisposable]) { $bitmap.Dispose() }
  if ($stream -is [System.IDisposable]) { $stream.Dispose() }
  if ($page -is [System.IDisposable]) { $page.Dispose() }
}

Set-Content -LiteralPath $OutputPath -Value ($chunks -join "`n") -Encoding UTF8
Write-Output "Wrote OCR text to $OutputPath"
