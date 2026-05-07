import type * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        poster?: string
        exposure?: string
        'camera-controls'?: boolean | string
        'touch-action'?: string
        autoplay?: boolean | string
        ar?: boolean | string
        'shadow-intensity'?: string
        'environment-image'?: string
        'interaction-prompt'?: string
      }
    }
  }
}

export {}
