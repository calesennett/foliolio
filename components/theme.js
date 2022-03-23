export default {
  colors: {
    background: '#f1f3ec',
    primary: '#353031',
    text: '#353031',
    lightgray: '#f0f0f0',
    gray: '#bebdbd'
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    monospace: 'Menlo, monospace',
  },
  text: {
    default: {
      color: 'text',
      fontFamily: 'body',
      lineHeight: 'body'
    },
    heading: {
      color: 'text',
      fontFamily: 'heading',
      fontWeight: 500
    },
    headline: {
      variant: 'text.heading',
      lineHeight: 'heading',
      pb: 2,
      fontSize: 5
    },
    cardTitle: {
      variant: 'text.headline',
      pb: 1,
      fontSize: 2
    }
  },
  lineHeights: {
    heading: '1.25',
    body: '1.5'
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
      border: '1px solid transparent',
      borderRadius: 6,
      p: 3,
      bg: 'white',
      transition: 'all 0.1s ease-in-out',
      fontFamily: 'body',
      '&:focus': {
        borderColor: 'primary',
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
      bg: 'primary',
      color: 'white',
      cursor: 'pointer'
    },
    transparent: {
      variant: 'buttons.pillOutline',
      border: 0,
      p: 0
    },
    pillOutline: {
      variant: 'buttons.primary',
      bg: 'transparent',
      color: 'primary',
      border: theme => `1px solid ${theme.colors.primary}`
    },
    secondary: {
      variant: 'buttons.primary',
      bg: 'white',
      color: 'primary'
    },
    outline: {
      variant: 'buttons.primary',
      bg: 'background',
      color: 'primary',
      border: theme => `1px dashed ${theme.colors.primary}`,
      borderRadius: 6,
      minHeight: 200,
      transition: 'all 0.1s ease-in-out',
      '&:hover': {
        bg: 'white'
      },
    },
    blankOutline: {
      variant: 'buttons.outline',
      bg: 'white',
      border: '1px dashed lightgray',
      disabled: true,
      cursor: 'auto',
      '&:hover': {
        bg: 'transparent'
      }
    }
  },
  shadows: {
    default: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px'
  },
  sizes: {
    container: 768
  },
  layout: {
    container: {
      px: 3
    }
  },
  cards: {
    primary: {
      border: '1px solid primary',
      borderRadius: 6,
      bg: 'white',
      color: 'primary'
    },
    fullWidth: {
      variant: 'cards.primary',
      p: 3
    }
  },
  styles: {
    root: {
      main: {
        pt: 3
      },
    },
    h1: {
      m: 0,
      pb: 2
    },
    h2: {
      m: 0,
      pb: 2,
      fontSize: 5,
      fontWeight: 500,
      fontFamily: 'heading'
    }
  }
}
