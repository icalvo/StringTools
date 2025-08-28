param(
  [string]
  $type
  )
pushd $PSScriptRoot
$x = (cat .\packages\string-fingerings\package.json | ConvertFrom-Json).version
Write-Host -NoNewline "$x --> "
npx semver -i $type $x
popd
$response = Read-Host "Shall we proceed?"
if ($response -eq 'y') {
	$branch = git rev-parse --abbrev-ref HEAD
	echo "gh workflow run 121003104 -F version=$type -r $branch"
}
