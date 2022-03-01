export default {
  colors: {
    background: '#fff',
    lightgray: '#f0f0f0'
  },
  fonts: {
    body: '"Inter var", "Inter", -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    heading: '"Inter var", "Inter", -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    monospace: 'Menlo, monospace',
  },
  text: {
    default: {
      fontFamily: 'body'
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 500
    },
    headline: {
      variant: 'text.heading',
      fontSize: 5
    }
  },
  forms: {
    label: {
      fontSize: 1,
      fontWeight: 500,
      pb: 2,
      fontFamily: 'heading'
    },
    input: {
      borderColor: 'lightgray',
      borderRadius: 6,
      p: 3,
      transition: 'all 0.1s ease-in-out',
      fontFamily: 'body',
      '&:focus': {
        borderColor: 'black',
        outline: 'none'
      }
    },
    textarea: {
      fontFamily: 'body',
      variant: 'forms.input'
    }
  },
  buttons: {
    primary: {
      fontFamily: 'heading',
      fontWeight: 500,
      borderRadius: 100,
      fontSize: 1,
      py: 1,
      bg: 'black',
      color: 'white',
      cursor: 'pointer'
    },
    secondary: {
      variant: 'buttons.primary',
      bg: 'lightgray',
      color: 'black'
    },
    outline: {
      variant: 'buttons.primary',
      bg: 'transparent',
      color: 'black',
      border: '1px solid lightgray',
      borderRadius: 6,
      transition: 'all 0.1s ease-in-out',
      '&:hover': {
        bg: 'lightgray'
      },
      '&:before': {
        content: '""',
        pb: '100%',
        display: 'block'
      }
    },
    blankOutline: {
      variant: 'buttons.outline',
      bg: 'transparent',
      border: '1px dashed lightgray',
      disabled: true,
      cursor: 'auto',
      '&:hover': {
        bg: 'transparent'
      }
    }
  },
  sizes: {
    container: 600
  },
  layout: {
    container: {
      px: 3
    }
  },
  styles: {
    root: {
      main: {
        pt: [3, null, 5]
      },
    },
    h1: {
      mb: 2
    },
    h2: {
      mb: 2,
      fontSize: 5,
      fontFamily: 'heading'
    }
  }
}
