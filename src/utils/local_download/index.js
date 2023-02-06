/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import RNFetchBlob from 'rn-fetch-blob';
/** INIT */
const { fs: { dirs } } = RNFetchBlob;

export default {
  /** Download */
  download: {
    path: `${dirs.DocumentDir}/downloads/`
  },
  /** Pdf */
  pdf: {
    ext: "pdf",
    path: `${dirs.DocumentDir}/pdfs/`
  }
}