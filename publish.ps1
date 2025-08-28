param(
  [Parameter(Mandatory=$True)]
    [ValidateSet('premajor','preminor','prepatch', 'prerelease', 'release')]
    [string]
  $type
  )
pushd $PSScriptRoot
$x = (cat .\packages\string-fingerings\package.json | ConvertFrom-Json).version
$ispre = $x.Contains('-')
Write-Host -NoNewline "$x --> "
npx semver -i $type $x
popd
if ($type -eq "prerelease") {
    if (-not $ispre) {
        "The package is not in prerelease. Start with 'premajor', 'preminor' or 'prepatch'"
        exit
    }
}
elseif ($type -eq "release") {
    if (-not $ispre) {
        "The package is not in prerelease. Start with 'premajor', 'preminor' or 'prepatch'"
        exit
    }
    "PLEASE CHECK EVERYTHING before final release"
}
else {
    if ($ispre) {
        "The package is already in prerelease. Start with 'premajor', 'preminor' or 'prepatch'"
        exit
    }
}
$response = Read-Host "Shall we proceed?"
if ($response -eq 'y') {
	$branch = git rev-parse --abbrev-ref HEAD
	echo "gh workflow run 121003104 -F version=$type -r $branch"
}
#- First release: `publish.ps1 pre<RTYPE>`
#  - Rest of prereleases: `publish.ps1 prerelease`
#  - Final release: `publish.ps1 release`
