export const renderSVG = (html: string, css: string, params: any = {}) => {
  const attrs = Object.keys(params).map((key) => `${key}="${params[key]}"`)
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      fill="none"
      ${attrs.join(' ')}
    >
      <foreignObject width="100%" height="100%">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <style>body { margin: 0; padding: 0; }</style>
          <style>${css}</style>
          ${html}
        </body>
      </foreignObject>
    </svg>
  `
}
