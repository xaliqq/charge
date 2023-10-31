export default {
  components: {
    Input: {
      sizes: {},
      variants: {
        outline: {
          field: {
            _focus: {
              borderColor: 'black',
              boxShadow: '0 0 0 1px black'
            },
            _invalid: {
              borderColor: '#D12E2E !important',
              boxShadow: '0 0 0 1px #D12E2E !important'
            }
          }
        }
      }
    },
    Button: {
      sizes: {},
      variants: {
        solid: {
          bg: 'green.1',
          fontWeight: 'medium',
          color: 'white',
          _focus: {
            bg: 'green.0'
          },
          _focusWithin: {
            bg: 'green.1'
          },
          _active: {
            bg: 'green.0'
          },
          _hover: {
            bg: 'green.0'
          }
        },
        outline: {
          color: 'green.1',
          borderColor: 'green.1',
          _focus: {
            bg: 'green.1',
            color: 'white'
          },
          _focusWithin: {
            bg: 'green.1',
            color: 'white'
          },
          _active: {
            bg: 'green.1',
            color: 'white'
          },
          _hover: {
            bg: 'green.1',
            color: 'white'
          }
        },
        gray: {
          border: '2px',
          fontWeight: 'medium',
          borderColor: 'gray.700',
          color: 'gray.700',
          _focus: {
            color: 'white',
            bg: 'gray.700'
          },
          _focusWithin: {
            color: 'white',
            bg: 'gray.700'
          },
          _active: {
            color: 'white',
            bg: 'gray.700'
          },
          _hover: {
            color: 'white',
            bg: 'gray.700'
          }
        }
      }
    },
    IconButton: {
      sizes: {},
      variants: {
        outline: {
          color: 'white',
          bg: 'green.1',
          _focus: {
            bg: 'green.0'
          },
          _focusWithin: {
            bg: 'green.1'
          },
          _active: {
            bg: 'green.0'
          },
          _hover: {
            bg: 'green.0'
          }
        }
      }
    },
    Modal: {
      variants: {
        big: {
          dialog: {
            maxW: 'var(--chakra-sizes-3xl)'
          }
        },
        huge: {
          dialog: {
            maxW: 'var(--chakra-sizes-5xl)'
          }
        }
      }
    }
  }
};
