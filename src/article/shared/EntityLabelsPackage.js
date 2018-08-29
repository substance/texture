export default {
  name: 'entity-labels',
  configure (config) {
    // general
    config.addLabel('edit-references', 'Edit References')
    config.addLabel('edit-affiliations', 'Edit Affiliations')
    config.addLabel('show-more-fields', 'More fields')
    config.addLabel('show-less-fields', 'Less fields')
    config.addLabel('multi-select-default-value', 'Click to select a value')
    config.addLabel('select-default-value', 'No value selected')

    // item types
    config.addLabel('journal-article', 'Journal Article')
    config.addLabel('edit-journal-article', 'Edit Journal Article')
    config.addLabel('add-journal-article', 'Add Journal Article')
    config.addLabel('create-journal-article', 'Create Journal Article')

    config.addLabel('book', 'Book')
    config.addLabel('edit-book', 'Edit Book')
    config.addLabel('add-book', 'Add Book')
    config.addLabel('create-book', 'Create Book')

    config.addLabel('chapter', 'Chapter')
    config.addLabel('edit-chapter', 'Edit Chapter')
    config.addLabel('add-chapter', 'Add Chapter')
    config.addLabel('create-chapter', 'Create Chapter')

    config.addLabel('conference-paper', 'Conference Paper')
    config.addLabel('create-conference-paper', 'Create Conference Paper')
    config.addLabel('edit-conference-paper', 'Edit Conference Paper')

    config.addLabel('webpage', 'Webpage')
    config.addLabel('create-webpage', 'Create Webpage')
    config.addLabel('edit-webpage', 'Edit Webpage')

    config.addLabel('thesis', 'Thesis')
    config.addLabel('create-thesis', 'Create Thesis')
    config.addLabel('edit-thesis', 'Edit Thesis')

    config.addLabel('software', 'Software')
    config.addLabel('create-software', 'Create Software')
    config.addLabel('edit-software', 'Edit Software')

    config.addLabel('report', 'Report')
    config.addLabel('create-report', 'Create Report')
    config.addLabel('edit-report', 'Edit Report')

    config.addLabel('data-publication', 'Data Publication')
    config.addLabel('create-data-publication', 'Create Data Publication')
    config.addLabel('edit-data-publication', 'Edit Data Publication')

    config.addLabel('magazine-article', 'Magazine Article')
    config.addLabel('create-magazine-article', 'Create Magazine Article')
    config.addLabel('edit-magazine-article', 'Edit Magazine Article')

    config.addLabel('newspaper-article', 'Newspaper Article')
    config.addLabel('create-newspaper-article', 'Create Newspaper Article')
    config.addLabel('edit-newspaper-article', 'Edit Newspaper Article')

    config.addLabel('patent', 'Patent')
    config.addLabel('create-patent', 'Create Patent')

    // fields labels
    config.addLabel('authors', 'Authors')
    config.addLabel('edit-authors', 'Edit Authors')

    config.addLabel('editors', 'Editors')
    config.addLabel('edit-editors', 'Edit Editors')

    config.addLabel('translators', 'Translators')
    config.addLabel('edit-translators', 'Edit Translators')

    config.addLabel('abstract', 'Abstract')
    config.addLabel('accessionId', 'Accession ID')
    config.addLabel('archiveId', 'Archive ID')
    config.addLabel('arkId', 'ARK ID')
    config.addLabel('assignee', 'Assignee')
    config.addLabel('confLoc', 'Conference Location')
    config.addLabel('confName', 'Conference Name')
    config.addLabel('containerTitle', 'Container Title')
    config.addLabel('day', 'Day')
    config.addLabel('doi', 'DOI')
    config.addLabel('edition', 'Edition')
    config.addLabel('elocationId', 'E-Location ID')
    config.addLabel('fpage', 'First Page')
    config.addLabel('inventors', 'Inventors')
    config.addLabel('isbn', 'ISBN')
    config.addLabel('issue', 'Issue')
    config.addLabel('lpage', 'Last Page')
    config.addLabel('month', 'Month')
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
    config.addLabel('prefix', 'Prefix')
    config.addLabel('suffix', 'Suffix')
    config.addLabel('affiliations', 'Affiliations')
    config.addLabel('awards', 'Awards')
    config.addLabel('group', 'Group')
    config.addLabel('equalContrib', 'Equal Contribution')
    config.addLabel('corresp', 'Corresponding Author')
    config.addLabel('deceased', 'Deceased')

    // organisation labels
    config.addLabel('organisation', 'Organisation')
    config.addLabel('add-organisation', 'Add Organisation')
    config.addLabel('edit-organisation', 'Edit Organisation')
    config.addLabel('create-organisation', 'Create Organisation')
    config.addLabel('name', 'Name')
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
    config.addLabel('institution', 'Institution Name')
    config.addLabel('fundRefId', 'Institution Identifier')
    config.addLabel('awardId', 'Award Identifier')

    // keyword labels
    config.addLabel('category', 'Category')
    config.addLabel('language', 'Language')

    // figure labels
    config.addLabel('content', 'Content')
    config.addLabel('caption', 'Caption')

    config.addLabel('copyrightStatement', 'Copyright Statement')
    config.addLabel('copyrightYear', 'Copyright Year')
    config.addLabel('copyrightHolder', 'Copyright Holder')
    config.addLabel('license', 'License')
    config.addLabel('licenseText', 'License Text (optional)')
  }
}
