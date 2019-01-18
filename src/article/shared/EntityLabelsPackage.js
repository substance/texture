/* eslint-disable no-template-curly-in-string */
export default {
  name: 'entity-labels',
  configure (config) {
    // EXPERIMENTAL: I want to move to more natural label specifications
    config.addLabel('enter-something', 'Enter ${something}')

    // TODO: at some point I want to refactor the configuration so that we have only one place for labels

    // general
    config.addLabel('edit-references', 'Edit References')
    config.addLabel('edit-affiliations', 'Edit Affiliations')
    config.addLabel('show-more-fields', 'More fields')
    config.addLabel('show-less-fields', 'Less fields')
    config.addLabel('multi-select-default-value', 'Click to select a value')
    config.addLabel('select-default-value', 'No value selected')

    // item types
    config.addLabel('journal-article-ref', 'Journal Article')
    config.addLabel('edit-journal-article-ref', 'Edit Journal Article')
    config.addLabel('add-journal-article-ref', 'Add Journal Article')
    config.addLabel('create-journal-article-ref', 'Create Journal Article')

    config.addLabel('book-ref', 'Book')
    config.addLabel('edit-book-ref', 'Edit Book')
    config.addLabel('add-book-ref', 'Add Book')
    config.addLabel('create-book-ref', 'Create Book')

    config.addLabel('chapter-ref', 'Chapter')
    config.addLabel('edit-chapter-ref', 'Edit Chapter')
    config.addLabel('add-chapter-ref', 'Add Chapter')
    config.addLabel('create-chapter-ref', 'Create Chapter')

    config.addLabel('conference-paper-ref', 'Conference Paper')
    config.addLabel('create-conference-paper-ref', 'Create Conference Paper')
    config.addLabel('edit-conference-paper-ref', 'Edit Conference Paper')

    config.addLabel('webpage-ref', 'Webpage')
    config.addLabel('create-webpage-ref', 'Create Webpage')
    config.addLabel('edit-webpage-ref', 'Edit Webpage')

    config.addLabel('thesis-ref', 'Thesis')
    config.addLabel('create-thesis-ref', 'Create Thesis')
    config.addLabel('edit-thesis-ref', 'Edit Thesis')

    config.addLabel('software-ref', 'Software')
    config.addLabel('create-software-ref', 'Create Software')
    config.addLabel('edit-software-ref', 'Edit Software')

    config.addLabel('report-ref', 'Report')
    config.addLabel('create-report-ref', 'Create Report')
    config.addLabel('edit-report-ref', 'Edit Report')

    config.addLabel('data-publication-ref', 'Data Publication')
    config.addLabel('create-data-publication-ref', 'Create Data Publication')
    config.addLabel('edit-data-publication-ref', 'Edit Data Publication')

    config.addLabel('magazine-article-ref', 'Magazine Article')
    config.addLabel('create-magazine-article-ref', 'Create Magazine Article')
    config.addLabel('edit-magazine-article-ref', 'Edit Magazine Article')

    config.addLabel('newspaper-article-ref', 'Newspaper Article')
    config.addLabel('create-newspaper-article-ref', 'Create Newspaper Article')
    config.addLabel('edit-newspaper-article-ref', 'Edit Newspaper Article')

    config.addLabel('patent-ref', 'Patent')
    config.addLabel('create-patent-ref', 'Create Patent')

    config.addLabel('article-ref', 'Article')
    config.addLabel('create-article-ref', 'Create Article')

    // fields labels
    config.addLabel('authors', 'Authors')
    config.addLabel('edit-authors', 'Edit Authors')

    config.addLabel('editors', 'Editors')
    config.addLabel('edit-editors', 'Edit Editors')

    config.addLabel('translators', 'Translators')
    config.addLabel('edit-translators', 'Edit Translators')

    config.addLabel('abstract', 'Abstract')
    config.addLabel('accessedDate', 'Accessed Date')
    config.addLabel('accessionId', 'Accession ID')
    config.addLabel('archiveId', 'Archive ID')
    config.addLabel('arkId', 'ARK ID')
    config.addLabel('assignee', 'Assignee')
    config.addLabel('confLoc', 'Conference Location')
    config.addLabel('confName', 'Conference Name')
    config.addLabel('containerTitle', 'Source')
    config.addLabel('day', 'Day')
    config.addLabel('doi', 'DOI')
    config.addLabel('edition', 'Edition')
    config.addLabel('elocationId', 'E-Location ID')
    config.addLabel('fpage', 'First Page')
    config.addLabel('inventors', 'Inventors')
    config.addLabel('isbn', 'ISBN')
    config.addLabel('issue', 'Issue')
    config.addLabel('issue-title', 'Issue Title')
    config.addLabel('lpage', 'Last Page')
    config.addLabel('month', 'Month')
    config.addLabel('name', 'Name')
    config.addLabel('pageCount', 'Page Count')
    config.addLabel('pageRange', 'Page Range')
    config.addLabel('patentCountry', 'Patent Country')
    config.addLabel('patentNumber', 'Patent Number')
    config.addLabel('partTitle', 'Part Title')
    config.addLabel('pmid', 'PubMed ID')
    config.addLabel('publisherLoc', 'Publisher Location')
    config.addLabel('publisherName', 'Publisher Name')
    config.addLabel('source', 'Source')
    config.addLabel('sponsors', 'Sponsors')
    config.addLabel('series', 'Series')
    config.addLabel('title', 'Title')
    config.addLabel('version', 'Version')
    config.addLabel('volume', 'Volume')
    config.addLabel('year', 'Year')

    config.addLabel('acceptedDate', 'Accepted Date')
    config.addLabel('publishedDate', 'Published Date')
    config.addLabel('receivedDate', 'Received Date')
    config.addLabel('revReceivedDate', 'Revision Received Date')
    config.addLabel('revRequestedDate', 'Revision Requested Date')

    // person labels
    config.addLabel('person', 'Person')
    config.addLabel('add-person', 'Add Person')
    config.addLabel('edit-person', 'Edit Person')
    config.addLabel('create-person', 'Create Person')
    config.addLabel('orcid', 'ORCID')
    config.addLabel('givenNames', 'Given Names')
    config.addLabel('surname', 'Surname')
    config.addLabel('alias', 'Alias')
    config.addLabel('prefix', 'Prefix')
    config.addLabel('suffix', 'Suffix')
    config.addLabel('bio', 'Biography')
    config.addLabel('affiliations', 'Affiliations')
    config.addLabel('awards', 'Awards')
    config.addLabel('group', 'Group')
    config.addLabel('equalContrib', 'Equal Contribution')
    config.addLabel('corresp', 'Corresponding Author')
    config.addLabel('deceased', 'Deceased')

    // organisation labels
    config.addLabel('organisation', 'Affiliation')
    config.addLabel('add-organisation', 'Add Organisation')
    config.addLabel('edit-organisation', 'Edit Organisation')
    config.addLabel('create-organisation', 'Create Organisation')
    config.addLabel('division1', 'Division 1 (Department)')
    config.addLabel('division2', 'Division 2')
    config.addLabel('division3', 'Division 2')
    config.addLabel('street', 'Address Line 1 (Street)')
    config.addLabel('addressComplements', 'Address Line 2 (Complements)')
    config.addLabel('city', 'City')
    config.addLabel('state', 'State')
    config.addLabel('postalCode', 'Postal Code')
    config.addLabel('country', 'Country')
    config.addLabel('phone', 'Phone')
    config.addLabel('fax', 'Fax')
    config.addLabel('email', 'Email')
    config.addLabel('uri', 'Website')
    config.addLabel('members', 'Members')
    config.addLabel('edit-members', 'Edit Members')

    // award labels
    config.addLabel('award', 'Award')
    config.addLabel('institution', 'Institution')
    config.addLabel('fundRefId', 'Institution Identifier')
    config.addLabel('awardId', 'Award Identifier')

    // keyword labels
    config.addLabel('keyword', 'Keyword')
    config.addLabel('category', 'Category')
    config.addLabel('language', 'Language')

    // subject labels
    config.addLabel('subject', 'Subject')

    // figure labels
    config.addLabel('figure', 'Figure')
    config.addLabel('content', 'Content')
    config.addLabel('legend', 'Legend')
    config.addLabel('copyrightStatement', 'Copyright Statement')
    config.addLabel('copyrightYear', 'Copyright Year')
    config.addLabel('copyrightHolder', 'Copyright Holder')
    config.addLabel('license', 'License')
    config.addLabel('licenseText', 'License Text (optional)')

    // table figure labels
    config.addLabel('table-figure', 'Table')

    // translatable labels
    config.addLabel('translatable', 'Translation')

    // footnote labels
    config.addLabel('fn', 'Footnote')
  }
}
