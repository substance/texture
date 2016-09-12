import { TOCProvider } from 'substance'

function AuthorTOCProvider(documentSession) {
  TOCProvider.call(this, documentSession.getDocument(), {
    containerId: 'bodyFlat'
  });
}

TOCProvider.extend(AuthorTOCProvider);

export default AuthorTOCProvider;
