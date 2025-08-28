pushd $PSScriptRoot
(cat .\packages\string-fingerings\package.json | ConvertFrom-Json).version
popd
