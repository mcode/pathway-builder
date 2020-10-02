import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    dialogCloseButton: {
      float: 'right',
      width: '45px'
    },
    input: {
      display: 'none'
    },
    chooseFileInput: {
      display: 'flex',
      alignItems: 'center'
    },
    inputButton: {
      whiteSpace: 'nowrap',
      marginRight: '1em'
    },
    fileName: {
      fontStyle: 'italic'
    }
  }),
  { name: 'FileImportModal', index: 1 }
);
