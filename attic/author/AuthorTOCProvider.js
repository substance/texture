import { TOCProvider } from 'substance'

class AuthorTOCProvider extends TOCProvider {
  constructor(editorSession) {
    super(editorSession.getDocument(), {
      containerId: 'bodyFlat'
    })
  }
}

export default AuthorTOCProvider
