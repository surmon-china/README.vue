const fs = require('fs-extra')
const path = require('path')

// https://github.com/devicons/devicon/blob/master/devicon.json
const deviconJson = require('devicon/devicon.json').map((icon) => {
  const iconName = icon.name
  const svgVersions = icon.versions.svg || []
  icon.svgs = svgVersions.reduce((obj, verison) => {
    return {
      ...obj,
      [verison]: fs
        .readFileSync(require.resolve(`devicon/icons/${iconName}/${iconName}-${verison}.svg`))
        .toString()
    }
  }, {})
  return icon
})

fs.writeJsonSync(path.resolve(__dirname, 'devicon.json'), deviconJson, { spaces: 2 })
