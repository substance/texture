import { createValueModel } from '../../kit'
import ArticleInformationSectionModel from './ArticleInformationSectionModel'
import AbstractsSectionModel from './AbstractsSectionModel'

/**
 * This is an artificial Model used to control the content displayed in the Metadata view.
 */
export default class MetadataModel {
  constructor (api) {
    this._api = api
    this._sections = [
      { name: 'article-information', model: new ArticleInformationSectionModel(api) },
      { name: 'abstracts', model: new AbstractsSectionModel(api) },
      { name: 'authors', model: createValueModel(api, ['metadata', 'authors']) },
      { name: 'editors', model: createValueModel(api, ['metadata', 'editors']) },
      { name: 'groups', model: createValueModel(api, ['metadata', 'groups']) },
      { name: 'organisations', model: createValueModel(api, ['metadata', 'organisations']) },
      { name: 'funders', model: createValueModel(api, ['metadata', 'funders']) },
      { name: 'keywords', model: createValueModel(api, ['metadata', 'keywords']) },
      { name: 'subjects', model: createValueModel(api, ['metadata', 'subjects']) },
      // TODO: references are not really metadata. This should be edited in the Manuscript directly
      // for the time being we leave it as it is
      { name: 'references', model: createValueModel(api, ['article', 'references']) }
    ]
  }

  getSections () {
    return this._sections
  }
}
