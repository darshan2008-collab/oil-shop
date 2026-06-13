# Delete the drawing folder recursively, clearing attributes first
if (Test-Path "c:\Users\ELCOT\Desktop\drawing") {
    Get-ChildItem -Path "c:\Users\ELCOT\Desktop\drawing" -Recurse -Force | ForEach-Object {
        if (-not $_.PSIsContainer) {
            $_.Attributes = 'Normal'
            [System.IO.File]::Delete($_.FullName)
        }
    }
    Get-ChildItem -Path "c:\Users\ELCOT\Desktop\drawing" -Recurse -Force | Sort-Object FullName -Descending | ForEach-Object {
        [System.IO.Directory]::Delete($_.FullName, $true)
    }
    [System.IO.Directory]::Delete("c:\Users\ELCOT\Desktop\drawing", $true)
    Write-Output "Successfully deleted drawing folder"
} else {
    Write-Output "drawing folder does not exist"
}

# Delete project 2 folder recursively
if (Test-Path "c:\Users\ELCOT\Desktop\project 2") {
    Get-ChildItem -Path "c:\Users\ELCOT\Desktop\project 2" -Recurse -Force | ForEach-Object {
        if (-not $_.PSIsContainer) {
            $_.Attributes = 'Normal'
            [System.IO.File]::Delete($_.FullName)
        }
    }
    Get-ChildItem -Path "c:\Users\ELCOT\Desktop\project 2" -Recurse -Force | Sort-Object FullName -Descending | ForEach-Object {
        [System.IO.Directory]::Delete($_.FullName, $true)
    }
    [System.IO.Directory]::Delete("c:\Users\ELCOT\Desktop\project 2", $true)
    Write-Output "Successfully deleted project 2 folder"
} else {
    Write-Output "project 2 folder does not exist"
}

# Delete darwing folder recursively if we renamed it, wait, we want to RENAME darwing to drawing!
# To do that, we move darwing to drawing:
if (Test-Path "c:\Users\ELCOT\Desktop\darwing") {
    # Remove database before renaming, if it exists
    if (Test-Path "c:\Users\ELCOT\Desktop\darwing\backend\karurartist.db") {
        $dbFile = Get-Item "c:\Users\ELCOT\Desktop\darwing\backend\karurartist.db"
        $dbFile.Attributes = 'Normal'
        [System.IO.File]::Delete($dbFile.FullName)
        Write-Output "Successfully deleted old database in darwing to reset credentials"
    }
    [System.IO.Directory]::Move("c:\Users\ELCOT\Desktop\darwing", "c:\Users\ELCOT\Desktop\drawing")
    Write-Output "Successfully renamed darwing to drawing"
}

# If drawing already exists, delete its database as well to reset credentials
if (Test-Path "c:\Users\ELCOT\Desktop\drawing\backend\karurartist.db") {
    $dbFile = Get-Item "c:\Users\ELCOT\Desktop\drawing\backend\karurartist.db"
    $dbFile.Attributes = 'Normal'
    [System.IO.File]::Delete($dbFile.FullName)
    Write-Output "Successfully deleted old database in drawing to reset credentials"
}
