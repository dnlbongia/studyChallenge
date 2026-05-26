import { marked } from 'marked'
import katex from 'katex'

export function setupMath() {
  marked.use({
    extensions: [
      {
        name: 'math',
        level: 'inline',
        start(src: string) {
          return src.indexOf('$')
        },
        tokenizer(src: string) {
          const display = src.match(/^\$\$([\s\S]+?)\$\$/)
          if (display) {
            return {
              type: 'math',
              raw: display[0],
              text: display[1].trim(),
              display: true,
            }
          }
          const inline = src.match(/^\$([^$\n]+?)\$/)
          if (inline) {
            return {
              type: 'math',
              raw: inline[0],
              text: inline[1].trim(),
              display: false,
            }
          }
        },
        renderer(token: any) {
          try {
            return katex.renderToString(token.text, {
              throwOnError: false,
              displayMode: token.display,
            })
          } catch {
            return token.display ? `$$${token.text}$$` : `$${token.text}$`
          }
        },
      },
    ],
  })
}
