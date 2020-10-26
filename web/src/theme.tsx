// import type '@material-ui/lab/themeAugmentation';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      
      main: '#292929', //#202020 #231F20
    },
    secondary: {
      main: '#11D39B', //#18de92
    },
    background:{
      paper: '#292929',
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '0.7em'
        },
        '*::-webkit-scrollbar-track': {
          background: '#303030'
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#6b6b6b' 
        }
      }
    }
  }
});

export default theme;
