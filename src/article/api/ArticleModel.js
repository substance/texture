import Model from './Model';

/**
 * An extra API for the article, which hides implementation details
 * about how to access certain parts of the document.
 */
export default class ArticleModel extends Model {
  getAbstract() {
    return this._getValueModel('article.abstract');
  }

  getAcknowledgements() {
    return this._getValueModel('article.acknowledgements');
  }

  getAffiliations() {
    return this._getValueModel('metadata.affiliations');
  }

  getAuthors() {
    return this._getValueModel('metadata.authors');
  }

  hasAuthors() {
    return this.getAuthors().length > 0;
  }

  getBody() {
    return this._getValueModel('body.content');
  }

  getFootnotes() {
    return this._getValueModel('article.footnotes');
  }

  hasFootnotes() {
    return this.getFootnotes().length > 0;
  }

  getReferences() {
    return this._getValueModel('article.references');
  }

  hasReferences() {
    return this.getReferences().length > 0;
  }

  getRelatedArticles() {
    return this._getValueModel('article.relatedArticles');
  }

  hasRelatedArticles() {
    return this.getRelatedArticles().length > 0;
  }

  getTitle() {
    return this._getValueModel('article.title');
  }

  getSubTitle() {
    return this._getValueModel('article.subTitle');
  }
}
