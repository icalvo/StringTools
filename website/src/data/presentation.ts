export function fingeringColor(numberOfFingerings: number, fingeringIndex: number) {
  return `hsl(${fingeringIndex * 360 / numberOfFingerings} 100% 50%)`
}
