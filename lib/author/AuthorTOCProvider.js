import { TOCProvider } from 'substance'

class AuthorTOCProvider extends TOCProvider {
  constructor(documentSession) {
    super(documentSession.getDocument(), {
      containerId: 'bodyFlat'
    })
  }
}

export default AuthorTOCProvider
