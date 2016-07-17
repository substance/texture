import TOCProvider from 'substance/ui/TOCProvider'

class AuthorTOCProvider extends TOCProvider {

  constructor(documentSession) {
    super(documentSession.getDocument(), {
      containerId: 'bodyFlat'
    })
  }

}

export default AuthorTOCProvider
