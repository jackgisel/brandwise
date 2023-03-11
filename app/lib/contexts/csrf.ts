import { createContext } from 'react';

const CsrfTokenContext = createContext<Maybe<string>>(undefined);

export default CsrfTokenContext;