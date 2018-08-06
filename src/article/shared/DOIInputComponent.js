import { Component, FontAwesomeIcon as Icon, sendRequest } from 'substance'
import { convertCSLJSON } from '../converter/bib/BibConversion'

export default class DOIInputComponent extends Component {
  render($$) {
    const labelProvider = this.context.labelProvider

    const inputEl = $$('div').addClass('se-input-group').append(
      $$('input').addClass('se-input').attr({
        type: 'text',
        placeholder: labelProvider.getLabel('enter-doi-placeholder')
      }).on('input', this._unblockUI).ref('DOIInput')
    )

    if (this.state.loading) {
      inputEl.append(
        $$('div').addClass('se-input-sign').append(
          $$(Icon, {icon: 'fa-spinner fa-spin'})
        )
      )
    } else if (this.state.error) {
      const dois = this.state.error.dois
      const errorsList = $$('ul').addClass('se-error-list')
      errorsList.append(
        $$('li').append(this.state.error.message)
      )
      if(dois) {
        errorsList.append(dois.map(d => $$('li').append('- '+d)))
      }
      inputEl.append(
        $$('div').addClass('se-input-sign sm-error').append(
          $$(Icon, {icon: 'fa-exclamation-circle'})
        ),
        $$('div').addClass('se-error-popup').append(errorsList)
      )
    } else {
      inputEl.append(
        $$('button').addClass('se-action').append(
          labelProvider.getLabel('doi-fetch-action')
        ).on('click', this._startImporting)
      )
    }

    const el = $$('div').addClass('se-doi-input').append(
      $$('div').addClass('se-section-title').append(
        labelProvider.getLabel('fetch-datacite')
      ),
      inputEl
    )

    return el
  }

  _startImporting() {
    const input = this.refs.DOIInput
    const val = input.val()
    const dois = val.split(' ').map(v => v.trim()).filter(v => Boolean(v))
    this.extendState({loading: true})

    _getBibEntries(dois).then(entries => {
      this.send('importBib', entries)
    }).catch(error => {
      this.extendState({error, loading: false})
    })
  }

  _unblockUI() {
    if(this.state.error) {
      this.extendState({error: undefined})
    }
  }
}


/*
  Helpers
*/
const ENDPOINT = 'https://doi.org/'

function _getBibEntries(dois) {
  return _fetchCSLJSONEntries(dois).then(entries => {
    let conversionErrors = []
    let convertedEntries = []
    entries.forEach(entry => {
      try {
        convertedEntries.push(
          convertCSLJSON(entry)
        )
      } catch(error) {
        conversionErrors.push(entry.DOI)
      }
    })
    if (conversionErrors.length > 0) {
      let error = new Error('Conversion error')
      error.dois = conversionErrors
      return Promise.reject(error)
    } else {
      return convertedEntries
    }
  })
}

/*
  Fetch CSL JSON entries
*/
function _fetchCSLJSONEntries(dois) {
  let errored = []
  let entries = []

  return dois.reduce((promise, doi) => {
    return promise
      .then(() => _fetchDOI(doi))
      .then(csl => entries.push(JSON.parse(csl)))
      .catch(() => errored.push(doi))
  }, Promise.resolve())
    .then(() => {
      if(errored.length > 0) {
        let err = new Error(`Could not resolve some DOI's`)
        err.dois = errored
        throw err
      } else {
        return entries
      }
    })
}

/*
  Fetch single entry for DOI
*/
function _fetchDOI(doi) {
  const url = ENDPOINT + doi
  return sendRequest({url: url, method: 'GET', header: {'accept': 'application/vnd.citationstyles.csl+json'}})
}
