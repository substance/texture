import { createValueModel } from '../../kit'
// import TranslationCollectionModel from './TranslationCollectionModel'
import FigureCollectionModel from './FigureCollectionModel'
import TableFigureCollectionModel from './TableFigureCollectionModel'
// import TableCollectionModel from './TableCollectionModel'
import ArticleRecordModel from './ArticleRecordModel'

/**
 * This is an artificial Model used to control the content displayed in the Metadata view.
 */
export default class MetadataModel {
  constructor (api) {
    this._api = api
    this._sections = [
      { name: 'authors', model: createValueModel(api, ['metadata', 'authors']) },
      { name: 'editors', model: createValueModel(api, ['metadata', 'editors']) },
      { name: 'groups', model: createValueModel(api, ['metadata', 'groups']) },
      { name: 'organisations', model: createValueModel(api, ['metadata', 'organisations']) },
      { name: 'awards', model: createValueModel(api, ['metadata', 'awards']) },
      { name: 'keywords', model: createValueModel(api, ['metadata', 'keywords']) },
      { name: 'subjects', model: createValueModel(api, ['metadata', 'subjects']) },
      // HACK: 'article-record' is a fake model
      // TODO: we should allow sections without model and create the section via name
      { name: 'article-record', model: new ArticleRecordModel(api) },
      { name: 'figures', model: new FigureCollectionModel(api) },
      { name: 'tables', model: new TableFigureCollectionModel(api) },
      { name: 'references', model: createValueModel(api, ['article', 'references']) },
      { name: 'footnotes', model: createValueModel(api, ['article', 'footnotes']) }
    ]
  }

  getSections () {
    return this._sections
  }
}
