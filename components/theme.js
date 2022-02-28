export default {
  colors: {
    background: '#fff',
    lightgray: '#f0f0f0'
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif',
    monospace: 'Menlo, monospace',
  },
  text: {
    default: {
      fontFamily: 'body'
    }
  },
  forms: {
    label: {
      fontSize: 1,
      fontWeight: 700,
      pb: 2,
    },
    input: {
      borderColor: 'lightgray',
      borderRadius: 6,
      p: 3,
      transition: 'all 0.1s ease-in-out',
      '&:focus': {
        borderColor: 'black',
        outline: 'none'
      }
    },
    textarea: {
      variant: 'forms.input'
    }
  },
  buttons: {
    primary: {
      borderRadius: 6,
      bg: 'lightgray',
      color: 'white',
      cursor: 'pointer',
      p: 4
    },
    outline: {
      variant: 'buttons.primary',
      bg: 'transparent',
      color: 'black',
      border: '1px solid lightgray',
      fontSize: 4,
      transition: 'all 0.1s ease-in-out',
      '&:hover': {
        bg: 'lightgray'
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
    container: 1140
  },
  layout: {
    container: {
      px: 2
    }
  }
}
