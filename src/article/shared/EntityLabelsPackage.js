/* eslint-disable no-template-curly-in-string */
export default {
  name: 'entity-labels',
  configure(config) {
    // EXPERIMENTAL: I want to move to more natural label specifications
    config.addLabel('enter-something', 'Enter ${something}');

    // TODO: at some point I want to refactor the configuration so that we have only one place for labels

    // general
    config.addLabel('edit-references', 'Edit References');
    config.addLabel('edit-affiliations', 'Edit Affiliations');
    config.addLabel('show-more-fields', 'More fields');
    config.addLabel('show-less-fields', 'Less fields');
    config.addLabel('multi-select-default-value', 'Click to select a value');
    config.addLabel('select-default-value', 'No value selected');
    config.addLabel('add-license', 'Add License');

    // item types
    config.addLabel('journal-article-ref', 'Journal Article');
    config.addLabel('edit-journal-article-ref', 'Edit Journal Article');
    config.addLabel('add-journal-article-ref', 'Add Journal Article');
    config.addLabel('create-journal-article-ref', 'Create Journal Article');

    config.addLabel('book-ref', 'Book');
    config.addLabel('edit-book-ref', 'Edit Book');
    config.addLabel('add-book-ref', 'Add Book');
    config.addLabel('create-book-ref', 'Create Book');

    config.addLabel('chapter-ref', 'Chapter');
    config.addLabel('edit-chapter-ref', 'Edit Chapter');
    config.addLabel('add-chapter-ref', 'Add Chapter');
    config.addLabel('create-chapter-ref', 'Create Chapter');

    config.addLabel('conference-paper-ref', 'Conference Paper');
    config.addLabel('create-conference-paper-ref', 'Create Conference Paper');
    config.addLabel('edit-conference-paper-ref', 'Edit Conference Paper');

    config.addLabel('webpage-ref', 'Webpage');
    config.addLabel('create-webpage-ref', 'Create Webpage');
    config.addLabel('edit-webpage-ref', 'Edit Webpage');

    config.addLabel('thesis-ref', 'Thesis');
    config.addLabel('create-thesis-ref', 'Create Thesis');
    config.addLabel('edit-thesis-ref', 'Edit Thesis');

    config.addLabel('software-ref', 'Software');
    config.addLabel('create-software-ref', 'Create Software');
    config.addLabel('edit-software-ref', 'Edit Software');

    config.addLabel('report-ref', 'Report');
    config.addLabel('create-report-ref', 'Create Report');
    config.addLabel('edit-report-ref', 'Edit Report');

    config.addLabel('data-publication-ref', 'Data Publication');
    config.addLabel('create-data-publication-ref', 'Create Data Publication');
    config.addLabel('edit-data-publication-ref', 'Edit Data Publication');

    config.addLabel('magazine-article-ref', 'Magazine Article');
    config.addLabel('create-magazine-article-ref', 'Create Magazine Article');
    config.addLabel('edit-magazine-article-ref', 'Edit Magazine Article');

    config.addLabel('newspaper-article-ref', 'Newspaper Article');
    config.addLabel('create-newspaper-article-ref', 'Create Newspaper Article');
    config.addLabel('edit-newspaper-article-ref', 'Edit Newspaper Article');

    config.addLabel('patent-ref', 'Patent');
    config.addLabel('create-patent-ref', 'Create Patent');

    config.addLabel('article-ref', 'Article');
    config.addLabel('create-article-ref', 'Create Article');

    config.addLabel('periodical-ref', 'Periodical');
    config.addLabel('create-data-periodical-ref', 'Create Periodical');
    config.addLabel('edit-data-periodical-ref', 'Edit Periodical');

    config.addLabel('preprint-ref', 'Preprint');
    config.addLabel('create-data-preprint-ref', 'Create Preprint');
    config.addLabel('edit-data-preprint-ref', 'Edit Preprint');

    // fields labels
    config.addLabel('authors', 'Authors');
    config.addLabel('edit-authors', 'Edit Authors');

    config.addLabel('editors', 'Editors');
    config.addLabel('edit-editors', 'Edit Editors');

    config.addLabel('translators', 'Translators');
    config.addLabel('edit-translators', 'Edit Translators');

    config.addLabel('abstract', 'Main Abstract');
    config.addLabel('abstractType', 'Abstract Type');
    config.addLabel('acknowledgement', 'Acknowledgements');
    config.addLabel('accessedDate', 'Accessed Date');
    config.addLabel('accessedDateIso8601', 'Accessed Date (ISO 8601)');
    config.addLabel('accessionId', 'Accession ID');
    config.addLabel('archiveId', 'Archive ID');
    config.addLabel('arkId', 'ARK ID');
    config.addLabel('assignee', 'Assignee');
    config.addLabel('authority', 'Authority');
    config.addLabel('chapterTitle', 'Chapter Title');
    config.addLabel('comment', 'Comment');
    config.addLabel('confDate', 'Conference Date');
    config.addLabel('confLoc', 'Conference Location');
    config.addLabel('confName', 'Conference Name');
    config.addLabel('containerTitle', 'Source');
    config.addLabel('custom-abstract', 'Custom Abstract');
    config.addLabel('day', 'Day');
    config.addLabel('doi', 'DOI');
    config.addLabel('era', 'Era');
    config.addLabel('edition', 'Edition');
    config.addLabel('elocationId', 'E-Location ID');
    config.addLabel('extLinkType', 'Link Type');
    config.addLabel('fpage', 'First Page');
    config.addLabel('given-names', 'Given Names');
    config.addLabel('href', 'URL');
    config.addLabel('inventors', 'Inventors');
    config.addLabel('isbn', 'ISBN');
    config.addLabel('issue', 'Issue');
    config.addLabel('issue-title', 'Issue Title');
    config.addLabel('iso8601Date', 'Date (ISO 8601)');
    config.addLabel('lpage', 'Last Page');
    config.addLabel('month', 'Month');
    config.addLabel('name', 'Name');
    config.addLabel('pageCount', 'Page Count');
    config.addLabel('pageRange', 'Page Range');
    config.addLabel('patentCountry', 'Patent Country');
    config.addLabel('patentNumber', 'Patent Number');
    config.addLabel('partTitle', 'Part Title');
    config.addLabel('pmid', 'PubMed ID');
    config.addLabel('pmcid', 'PubMed Central \u00AE ID');
    config.addLabel('publisherLoc', 'Publisher Location');
    config.addLabel('publisherName', 'Publisher Name');
    config.addLabel('season', 'Season');
    config.addLabel('series', 'Series');
    config.addLabel('source', 'Source');
    config.addLabel('specificUse', 'Specific Use');
    config.addLabel('sponsors', 'Sponsors');
    config.addLabel('stringDate', 'Date');
    config.addLabel('title', 'Title');
    config.addLabel('version', 'Version');
    config.addLabel('volume', 'Volume');
    config.addLabel('year', 'Year');

    config.addLabel('acceptedDate', 'Accepted Date');
    config.addLabel('publishedDate', 'Published Date');
    config.addLabel('receivedDate', 'Received Date');
    config.addLabel('revReceivedDate', 'Revision Received Date');
    config.addLabel('revRequestedDate', 'Revision Requested Date');

    // person labels
    config.addLabel('person', 'Person');
    config.addLabel('add-person', 'Add Person');
    config.addLabel('edit-person', 'Edit Person');
    config.addLabel('create-person', 'Create Person');
    config.addLabel('orcid', 'ORCID');
    config.addLabel('givenNames', 'Given Names');
    config.addLabel('surname', 'Surname');
    config.addLabel('alias', 'Alias');
    config.addLabel('prefix', 'Prefix');
    config.addLabel('suffix', 'Suffix');
    config.addLabel('bio', 'Biography');
    config.addLabel('affiliations', 'Affiliations');
    config.addLabel('funders', 'Funders');
    config.addLabel('group', 'Group');
    config.addLabel('equalContrib', 'Equal Contribution');
    config.addLabel('corresp', 'Corresponding Author');
    config.addLabel('deceased', 'Deceased');

    // affiliation labels
    config.addLabel('affiliation', 'Affiliation');
    config.addLabel('division1', 'Division 1 (Department)');
    config.addLabel('division2', 'Division 2');
    config.addLabel('division3', 'Division 3');
    config.addLabel('street', 'Address Line 1 (Street)');
    config.addLabel('addressComplements', 'Address Line 2 (Complements)');
    config.addLabel('city', 'City');
    config.addLabel('state', 'State');
    config.addLabel('postalCode', 'Postal Code');
    config.addLabel('country', 'Country');
    config.addLabel('phone', 'Phone');
    config.addLabel('fax', 'Fax');
    config.addLabel('email', 'Email');
    config.addLabel('uri', 'URL');
    config.addLabel('members', 'Members');
    config.addLabel('edit-members', 'Edit Members');

    // award labels
    config.addLabel('funder', 'Funder');
    config.addLabel('institution', 'Institution');
    config.addLabel('fundRefId', 'Institution Identifier');
    config.addLabel('awardId', 'Award Identifier');

    // keyword labels
    config.addLabel('keyword', 'Keyword');
    config.addLabel('category', 'Category');
    config.addLabel('language', 'Language');

    // subject labels
    config.addLabel('subject', 'Subject');

    // figure labels
    config.addLabel('figure', 'Figure');
    config.addLabel('content', 'Content');
    config.addLabel('legend', 'Legend');

    // permission labels
    config.addLabel('copyrightStatement', 'Copyright');
    config.addLabel('copyrightStatement-placeholder', 'Enter copyright');
    config.addLabel('copyrightYear', 'Year');
    config.addLabel('copyrightYear-placeholder', 'Enter year');
    config.addLabel('copyrightHolder', 'Holder');
    config.addLabel('copyrightHolder-placeholder', 'Enter holder');
    config.addLabel('license', 'License');
    config.addLabel('license-placeholder', 'Enter license URL');
    config.addLabel('licenseText', 'Statement');
    config.addLabel('licenseText-placeholder', 'Enter statement');

    // table figure labels
    config.addLabel('table-figure', 'Table');

    // translatable labels
    config.addLabel('translatable', 'Translation');

    // footnote labels
    config.addLabel('fn', 'Footnote');

    // related article labels
    config.addLabel('relatedArticle', 'Related Articles');
    config.addLabel('relatedArticleHref', 'Article DOI');
    config.addLabel('relatedArticleHrefPlaceholder', '10.7554/eLife.00000');
    config.addLabel('relatedArticleType', 'Link Type');
    config.addLabel('relatedArticleTypePlaceholder', 'commentary-article');
  }
};
