import { Component, sendRequest } from 'substance'
import { convertCSLJSON } from '../converter/bib/BibConversion'
import QueryComponent from './QueryComponent'

export default class DOIInputComponent extends Component {
  constructor (...args) {
    super(...args)
    this.handleActions({
      'query': this._startImporting
    })
  }

  getInitialState () {
    return {
      loading: false
    }
  }

  render ($$) {
    return $$('div').addClass('sc-doi-input').append(
      $$(QueryComponent, {
        placeholder: 'enter-doi-placeholder',
        actionLabel: 'add-action',
        loading: this.state.loading,
        errors: this.state.errors
      })
    )
  }

  async _startImporting (input) {
    const dois = input.split(' ').map(v => v.trim()).filter(v => Boolean(v))
    this.extendState({ loading: true })

    try {
      const entries = await _getBibEntries(dois)
      this.send('importBib', entries)
    } catch (error) {
      const dois = error.dois
      const errorMessage = error.message
      let errors = [
        errorMessage
      ]
      errors = errors.concat(dois.map(d => '- ' + d))
      this.extendState({ errors, loading: false })
    }
  }
}

/*
  Helpers
*/
const ENDPOINT = 'https://doi.org/'

function _getBibEntries (dois) {
  return _fetchCSLJSONEntries(dois).then(entries => {
    let conversionErrors = []
    let convertedEntries = []
    entries.forEach(entry => {
      try {
        convertedEntries.push(
          convertCSLJSON(entry)
        )
      } catch (error) {
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
function _fetchCSLJSONEntries (dois) {
  let errored = []
  let entries = []

  return dois.reduce((promise, doi) => {
    return promise
      .then(() => _fetchDOI(doi))
      .then(csl => entries.push(JSON.parse(csl)))
      .catch(() => errored.push(doi))
  }, Promise.resolve())
    .then(() => {
      if (errored.length > 0) {
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
function _fetchDOI (doi) {
  const url = ENDPOINT + doi
  return sendRequest({ url: url, method: 'GET', header: { 'accept': 'application/vnd.citationstyles.csl+json' } })
}
