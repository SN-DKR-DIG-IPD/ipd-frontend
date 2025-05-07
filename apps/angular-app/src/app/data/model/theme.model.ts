
export interface ThemeModel {
  layout_content: {
    bg: {
      color: string,
    },
    text: {
      color: string
    }
  },
  sidebar: {
    bg: {
      color: string,
    },
    nav: {
      link: {
        bg: {
          color: string,
          active: string,
          hover: string
        },
        text: {
          color: string,
          active: string,
          hover: string
        }
      }
    }
  },
  navbar: {
    bg: {
      color: string,
    }
    usermenu: {
      bg: {
        color: string,
      },
      item: {
        bg: {
          color: string,
          hover: string
        },
        text: {
          color: string,
          hover: string
        }
      }
    }
  },
  card: {
    bg: {
      color: string,
    },
    text: {
      color: string,
    }
  },
  button: {
    bg: {
      color: string,
    },
    text: {
      color: string,
    }
  }
}
