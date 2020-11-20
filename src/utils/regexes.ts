// sample header= "multipart/form-data;boundary=Boundary_1"
// get the part after "boundary=" and before any subsequent ;
export const extractMultipartBoundary = /.*;boundary=(Boundary.*);?.*/;

export const extractMultipartFileName = /Content-Disposition: form-data; name="([^"]+)"/;

// eveything between { } including newlines. [^] is like . but matches newline
export const extractJSONContent = /(\{[^]*\})/;

export const extractCQLInclude = /include .* called (.*)/;

export const extractCQLLibraryName = /library ([^ ]*)/;

export const extractCQLVersion = /version '(.*)'/;
