import { CustomSurface, FontAwesomeIcon } from 'substance';
import { NodeComponent } from '../../kit';
import FootnoteComponent from './FootnoteComponent';
import { CONTENT_MODE } from '../ArticleConstants';

export default class AuthorDetailsListComponent extends CustomSurface {
  getInitialState() {
    let items = this._getAuthors();
    return {
      hidden: items.length === 0,
      edit: false
    };
  }

  render($$) {
    let el = $$('div').addClass('sc-author-details-list');
    el.append(this._renderAuthors($$));
    return el;
  }

  _renderAuthors($$) {
    const authors = this._getAuthors();
    let els = [];
    authors.forEach((author, index) => {
      const authorEl = $$(AuthorDetailsDisplay, { node: author }).ref(author.id);
      els.push(authorEl);
    });
    return els;
  }

  _getCustomResourceId() {
    return 'author-details-list';
  }

  _getAuthors() {
    return this.props.model.getItems();
  }
}

class AuthorDetailsDisplay extends NodeComponent {
  render($$) {
    const author = this.props.node;
    const doc = author.document;

    let el = $$('div').addClass('se-author-details');
    el.append(
      $$('p')
        .addClass('se-author-details-fullname')
        .append(`${author.givenNames} ${author.surname}${author.corresp ? '*' : ''}`)
    );

    // Only display an email fir corresponding authors
    if (author.corresp && author.email) {
      el.append(
        $$('p')
          .addClass('se-author-details-correspondence')
          .append(`${this.getLabel('author-details-correspendance')}: `)
          .append(
            $$('a')
              .attr('href', `mailto:${author.email}`)
              .append(author.email)
          )
      );
    }

    // Render affliations in the format, <insitution> <dept> <city> <country>
    if (author.affiliations.length > 0) {
      author.affiliations.map(affiliationId => {
        const affiliationElement = doc.get(affiliationId);
        if (affiliationElement) {
          el.append(
            $$('p')
              .addClass('se-author-details-affilations')
              .append(affiliationElement.toString())
          );
        }
      });
    }

    if (author.contributorIds.length > 0) {
      author.contributorIds.map(contributorId => {
        const orcidIdElement = $$('div').addClass('se-author-details-orchid');
        const contributorIdElement = doc.get(contributorId);
        if (contributorIdElement && contributorIdElement.contribIdType === 'orcid') {
          if (contributorIdElement.authenticated) {
            orcidIdElement.append($$(FontAwesomeIcon, { icon: 'fa-circle' }).addClass('se-icon'));
          }
          // FIXME: Not 100% happy with the below solution, there is likely a better way to do this.
          const match = /0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]/.exec(contributorIdElement.content);
          if (match) {
            orcidIdElement.append(
              $$('p')
                .addClass('se-author-details-orcid')
                .append(
                  $$('a')
                    .attr('href', match.input)
                    .append(match[0])
                )
            );
          } else {
            orcidIdElement.append(
              $$('p')
                .addClass('se-author-details-orcid')
                .append(
                  $$('a')
                    .attr('href', contributorIdElement.content)
                    .append(contributorIdElement.content)
                )
            );
          }
        }
        el.append(orcidIdElement);
      });
    }

    if (author.competingInterests.length > 0) {
      author.competingInterests.map(id => {
        const element = doc.get(id);
        if (element) {
          el.append($$(FootnoteComponent, { node: element, mode: CONTENT_MODE }));
        }
      });
    }

    return el;
  }
}
