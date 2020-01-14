import { Component } from 'substance';
import { renderModel } from '../../kit';
import ManuscriptSection from './ManuscriptSection';

export default class ManuscriptComponent extends Component {
  render($$) {
    const manuscript = this.props.model;
    const AuthorsListComponent = this.getComponent('authors-list');
    const ReferenceListComponent = this.getComponent('reference-list');
    const RelatedArticlesListComponent = this.getComponent('related-articles-list');

    let el = $$('div').addClass('sc-manuscript');

    // TODO: maybe we want to be able to configure if a section should be hidden when empty

    // Title
    let titleModel = manuscript.getTitle();
    el.append(
      $$(ManuscriptSection, {
        name: 'title',
        label: this.getLabel('title-label'),
        model: titleModel
      }).append(
        renderModel($$, this, titleModel, {
          placeholder: this.getLabel('title-placeholder')
        }).addClass('sm-title')
      )
    );
    // Sub-title
    let subTitleModel = manuscript.getSubTitle();
    el.append(
      $$(ManuscriptSection, {
        name: 'subtitle',
        label: this.getLabel('subtitle-label'),
        model: subTitleModel
      }).append(
        renderModel($$, this, subTitleModel, {
          placeholder: this.getLabel('subtitle-placeholder')
        }).addClass('sm-subtitle')
      )
    );
    // Authors
    let authorsModel = manuscript.getAuthors();
    el.append(
      $$(ManuscriptSection, {
        name: 'authors',
        label: this.getLabel('authors-label'),
        model: authorsModel,
        hideWhenEmpty: true
      }).append(
        $$(AuthorsListComponent, {
          model: authorsModel,
          placeholder: this.getLabel('authors-placeholder')
        }).addClass('sm-authors')
      )
    );
    // Abstract
    let abstractModel = manuscript.getAbstract();
    el.append(
      $$(ManuscriptSection, {
        name: 'abstract',
        label: this.getLabel('abstract-label'),
        model: abstractModel
      }).append(
        renderModel($$, this, abstractModel, {
          name: 'abstract',
          placeholder: this.getLabel('abstract-placeholder')
        }).addClass('sm-abstract')
      )
    );
    // Body
    let bodyModel = manuscript.getBody();
    el.append(
      $$(ManuscriptSection, {
        name: 'body',
        label: this.getLabel('body-label'),
        model: bodyModel
      }).append(
        renderModel($$, this, bodyModel, {
          name: 'body',
          placeholder: this.getLabel('body-placeholder')
        }).addClass('sm-body')
      )
    );
    // Footnotes
    let footnotesModel = manuscript.getFootnotes();
    el.append(
      $$(ManuscriptSection, {
        name: 'footnotes',
        label: this.getLabel('footnotes-label'),
        model: footnotesModel,
        hideWhenEmpty: true
      }).append(renderModel($$, this, footnotesModel).addClass('sm-footnotes'))
    );
    // References
    let referencesModel = manuscript.getReferences();
    el.append(
      $$(ManuscriptSection, {
        name: 'references',
        label: this.getLabel('references-label'),
        model: referencesModel,
        hideWhenEmpty: true
      }).append(
        $$(ReferenceListComponent, {
          model: referencesModel
        }).addClass('sm-references')
      )
    );

    // Related Articles
    let relatedArticlesModel = manuscript.getRelatedArticles();
    el.append(
      $$(ManuscriptSection, {
        name: 'related-articles',
        label: 'Related Articles',
        model: relatedArticlesModel,
        hideWhenEmpty: true
      }).append(
        $$(RelatedArticlesListComponent, {
          model: relatedArticlesModel
        }).addClass('sm-related-articles')
      )
    );

    // Acknowledgements
    let acknowledgementsModel = manuscript.getAcknowledgements();
    el.append(
      $$(ManuscriptSection, {
        name: 'acknowledgements',
        label: this.getLabel('acknowledgement-label'),
        model: acknowledgementsModel
      }).append(
        renderModel($$, this, acknowledgementsModel, {
          name: 'acknowledgement',
          placeholder: this.getLabel('acknowledgement-placeholder')
        }).addClass('sm-acknowledgement')
      )
    );

    return el;
  }
}
