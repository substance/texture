import { DefaultDOMElement } from 'substance'

/**
 * Renders the specified 'journal' type citation.
 *
 * Generates a document fragment that renders a 'journal' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function journalArticleRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(' ', ...exporter.annotatedText([entity.id, 'title'], entityDb, $$), '.');
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(' ', $$('i').append(entity.containerTitle), '.');
  }

  // <volume>
  if (entity.volume)
  {
    fragments.push(' ', _renderVolume($$, entity.volume));
  }

  // <elocation-id>
  if (entity.elocationId)
  {
    if (entity.volume)
    {
      fragments.push(`:${entity.elocationId}.`);
    }
    else
    {
      fragments.push(` ${entity.elocationId}.`);
    }
  }
  // <fpage>
  else if (entity.fpage)
  {
    if (entity.volume)
    {
      fragments.push(`:${entity.fpage}`);
    }
    else
    {
      fragments.push(` ${entity.fpage}`);
    }

    if (entity.lpage)
    {
      fragments.push(`-${entity.lpage}`);
    }

    fragments.push('.');
  }

  // <comment>
  if (!entity.volume && !entity.elocationId && !entity.fpage && !entity.lpage && entity.comment)
  {
    fragments.push(` ${entity.comment}.`);
  }

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <pub-id pub-id-type="pmid">
  if (entity.pmid)
  {
    fragments.push(', pmid: ', _renderPMID($$, entity.pmid));
  }

  // <pub-id pub-id-type="pmcid">
  if (entity.pmcid)
  {
    fragments.push(', pmcid: ', _renderPMCID($$, entity.pmcid));
  }

  return fragments;
}

/**
 * Renders the specified 'book' type citation.
 *
 * Generates a document fragment that renders a 'book' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function bookRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];
  let isChapterType = (entity.chapterTitle && entity.chapterTitle.length > 0);

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <chapter-title> or <source>
  if (isChapterType)
  {
    fragments.push(` ${entity.chapterTitle}.`);
  }
  else if (entity.title)
  {
    fragments.push(' ', $$('i').append(entity.title), '.');
  }

  // <person-group person-group-type="editor">
  if (entity.editors.length > 0)
  {
    if (isChapterType)
    {
      fragments.push(' In:');
    }

    let editorLabel = entity.editors.length > 1 ? 'Eds' : 'Ed';
    fragments = fragments.concat(' ', _renderAuthors($$, entity.editors, entityDb), ` (${editorLabel}).`);
  }

  // <source>
  if (isChapterType)
  {
    fragments.push(' ', $$('i').append(entity.title), '.');
  }

  // <edition>
  if (entity.edition)
  {
    fragments.push(` ${entity.edition}.`);
  }

  // <publisher-name> <publisher-loc>
  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName));

  // <elocation-id>
  if (isChapterType && entity.elocationId)
  {
    fragments.push(` ${entity.elocationId}.`);
  }

  // <fpage>
  if (isChapterType && entity.fpage)
  {
    fragments.push(` p. ${entity.fpage}`);

    if (entity.lpage)
    {
      fragments.push(`-${entity.lpage}`);
    }
    fragments.push('.');
  }

  // <comment>
  if (!entity.elocationId && !entity.fpage && !entity.lpage && entity.comment)
  {
    fragments.push(` ${entity.comment}.`);
  }

  // <pub-id pub-id-type="isbn">
  if (entity.isbn)
  {
    fragments.push(` isbn: ${entity.isbn}`);
  }

  // <pub-id pub-id-type="doi">
  if (isChapterType && entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  return fragments;
}

function chapterRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.translators.length) {
    fragments = fragments.concat(
      ' (',
      _renderAuthors($$, entity.translators, entityDb),
      ', trans).'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  fragments = fragments.concat('In: ')
  if (entity.editors.length > 0) {
    let editorLabel = entity.editors.length > 1 ? 'eds' : 'ed'
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.editors, entityDb),
      ', ',
      editorLabel,
      '.'
    )
  }
  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(
        entity.containerTitle
      ),
      '.'
    )
  }
  if (entity.volume) {
    if (/^\d+$/.test(entity.volume)) {
      fragments.push(' ', entity.volume, '.')
    } else {
      fragments.push(' Vol ', entity.volume, '.')
    }
  }
  if (entity.edition) {
    fragments.push(' ', entity.edition, '.')
  }

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  if (entity.series) {
    fragments.push(' (', entity.series, ')')
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }
  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }
  return fragments
}

/**
 * Renders the specified 'patent' type citation.
 *
 * Generates a document fragment that renders a 'patent' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function patentRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.inventors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.inventors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(' ', ...exporter.annotatedText([entity.id, 'title'], entityDb, $$), '.');
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(' ', $$('i').append(entity.containerTitle), '.');
  }

  // <patent>
  if (entity.patentNumber)
  {
    fragments.push(` pat: ${entity.patentNumber}`);

    if (!entity.patentCountry)
    {
      fragments.push('.');
    }
  }

  // <patent country="United States">
  if (entity.patentCountry)
  {
    fragments.push(` (${entity.patentCountry}).`);
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments
}

function articleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  // We render an annotated article title here:
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  if (entity.editors.length > 0) {
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.editors, entityDb),
      '.'
    )
  }
  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }

  let date = _renderDate($$, entity.year, entity.month, entity.day, 'short')
  if (date) {
    fragments.push(' ', date, ';')
  }

  if (entity.issue) {
    fragments.push('(', entity.issue, ')')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  if (entity.pmid) {
    fragments.push(' PMID ', entity.pmid)
  }
  return fragments
}

/**
 * Renders the specified 'data' type citation.
 *
 * Generates a document fragment that renders a 'data' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function dataPublicationRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <data-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    );
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    );
  }

  // One of <pub-id pub-id-type="doi">,
  //        <pub-id pub-id-type="accession">,
  //        <pub-id pub-id-type="archive">,
  //        <pub-id pub-id-type="ark">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }
  else if (entity.accessionId)
  {
    fragments.push(' identifier: ', entity.accessionId);
    if (entity.href)
    {
      fragments.push('. url: ', _renderURI($$, entity.href));
    }
  }
  else if (entity.archiveId)
  {
    fragments.push(' identifier: ', entity.archiveId);
    if (entity.href)
    {
      fragments.push('. url: ', _renderURI($$, entity.href));
    }
  }
  else if (entity.arkId)
  {
    fragments.push(' identifier: ', entity.arkId);
    if (entity.href)
    {
      fragments.push('. url: ', _renderURI($$, entity.href));
    }
  }

  // <element-citation[specific-use]>
  if (entity.specificUse && entity.specificUse !== 'generated')
  {
    fragments.push(' Previously published');
  }

  return fragments
}

function magazineArticleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      ','
    )
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

function newspaperArticleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      ','
    )
    if (entity.edition) {
      fragments.push(
        ' ',
        $$('i').append(entity.edition),
        ','
      )
    }
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation)
  }
  if (entity.partTitle) {
    fragments.push(' (', entity.partTitle, ')')
  }
  fragments.push('.')

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

/**
 * Renders the specified 'report' type citation.
 *
 * Generates a document fragment that renders a 'report' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function reportRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '. '
    );
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <source>
  if (entity.title)
  {
    fragments.push(
      ' ',
      $$('i').append(entity.title),
      '.'
    )
  }

  // <volume>
  if (entity.volume)
  {
    fragments.push(' ', _renderVolume($$, entity.volume), '.');
  }

  // <publisher-name>
  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  // <pub-id pub-id-type="isbn">
  if (entity.isbn)
  {
    fragments.push(` isbn: ${entity.isbn}`);
  }

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    if (entity.isbn)
    {
      fragments.push(',');
    }
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    if (entity.isbn || entity.doi)
    {
      fragments.push(',');
    }
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments
}

/**
 * Renders the specified 'conference' type citation.
 *
 * Generates a document fragment that renders a 'conference' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function conferencePaperRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  // <conf-name>
  if (entity.confName)
  {
    fragments.push(` ${entity.confName}.`);
  }

  // <conf-loc>
  if (entity.confLoc)
  {
    fragments.push(` ${entity.confLoc}.`);
  }

  // <conf-date>
  if (entity.confDate)
  {
    fragments.push(` ${entity.confDate}.`);
  }

  // <volume>
  if (entity.volume)
  {
    fragments.push(' ', _renderVolume($$, entity.volume));
  }

  // <elocation-id>
  if (entity.elocationId)
  {
    if (entity.volume)
    {
      fragments.push(`:${entity.elocationId}.`);
    }
    else
    {
      fragments.push(` ${entity.elocationId}.`);
    }
  }
  // <fpage>
  else if (entity.fpage)
  {
    if (entity.volume)
    {
      fragments.push(`:${entity.fpage}`);
    }
    else
    {
      fragments.push(` ${entity.fpage}`);
    }

    if (entity.lpage)
    {
      fragments.push('-', entity.lpage);
    }
    fragments.push('.');
  }

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments;
}

/**
 * Renders the specified 'software' type citation.
 *
 * Generates a document fragment that renders a 'software' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function softwareRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <data-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    );
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }

  // <version>
  if (entity.version)
  {
    fragments.push(` version: ${entity.version}.`);
  }

  // <publisher-name>, <publisher-loc>
  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments
}

/**
 * Renders the specified 'thesis' type citation.
 *
 * Generates a document fragment that renders a 'thesis' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function thesisRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  // <publisher-name>, <publisher-loc>
  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments
}

/**
 * Renders the specified 'webpage' type citation.
 *
 * Generates a document fragment that renders a 'webpage' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function webpageRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  // <date-in-citation iso-8601-date="1995-09-10"></date-in-citation>
  if (entity.accessedDate)
  {
    fragments.push(`. [Accessed date: ${entity.accessedDate}]`);
  }

  return fragments
}

/**
 * Renders the specified 'periodical' type citation.
 *
 * Generates a document fragment that renders a 'periodical' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function periodicalRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }

  // <string-date>
  if (entity.stringDate)
  {
    let stringDate = entityDb.get(entity.stringDate);
    if (stringDate.month)
    {
      fragments.push(` ${stringDate.month}`);
    }

    if (stringDate.day)
    {
      fragments.push(` ${stringDate.day}`);
    }

    if (stringDate.year)
    {
      if (stringDate.month || stringDate.day)
      {
        fragments.push(',');
      }
      fragments.push(` ${stringDate.year}.`);
    }
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(' ', $$('i').append(entity.containerTitle), '.');
  }

  // <volume>
  if (entity.volume)
  {
    fragments.push(' ', _renderVolume($$, entity.volume));
  }

  // <fpage>-<lpage>
  if (entity.fpage)
  {
    if (entity.volume)
    {
      fragments.push(':');
    }
    else
    {
      fragments.push(' ');
    }

    fragments.push(entity.fpage);

    if (entity.lpage)
    {
      fragments.push('-', entity.lpage);
    }
    fragments.push('.');
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments;
}

/**
 * Renders the specified 'preprint' type citation.
 *
 * Generates a document fragment that renders a 'preprint' type citation.
 *
 * @param {*}      $$ - DOM
 * @param {string} entityId - The ID of entity to render
 * @param {object} entityDb - Handle to a collection of entities
 * @param {*}      exporter - Handle to an exporter for generating formatted types.
 *
 * @returns A document fragment.
 */
function preprintRenderer ($$, entityId, entityDb, exporter)
{
  let entity = entityDb.get(entityId);
  let fragments = [];

  // <person-group person-group-type="author">
  if (entity.authors.length > 0)
  {
    fragments = fragments.concat(_renderAuthors($$, entity.authors, entityDb), '.');
  }

  // <year>
  if (entity.year)
  {
    fragments.push(` ${entity.year}.`);
  }

  // <article-title>
  if (entity.title)
  {
    fragments.push(' ', ...exporter.annotatedText([entity.id, 'title'], entityDb, $$), '.');
  }

  // <source>
  if (entity.containerTitle)
  {
    fragments.push(' ', $$('i').append(entity.containerTitle), '.');
  }

  // <elocation-id>
  if (entity.elocationId)
  {
    fragments.push(` ${entity.elocationId}.`);
  }

  // <pub-id pub-id-type="doi">
  if (entity.doi)
  {
    fragments.push(' doi: ', _renderDOI($$, entity.doi));
  }

  // <ext-link ext-link-type="uri">
  if (entity.uri)
  {
    fragments.push(' url: ', _renderURI($$, entity.uri));
  }

  return fragments;
}

function entityRenderer ($$, entityId, entityDb, options = {}) {
  let entity = entityDb.get(entityId)
  return entity.render(options)
}

/*
  Exports
*/
export default {
  'article-ref': _delegate(articleRenderer),
  'person': _delegate(entityRenderer),
  'group': _delegate(entityRenderer),
  'book-ref': _delegate(bookRenderer),
  'chapter-ref': _delegate(chapterRenderer),
  'journal-article-ref': _delegate(journalArticleRenderer),
  'conference-paper-ref': _delegate(conferencePaperRenderer),
  'report-ref': _delegate(reportRenderer),
  'affiliation': _delegate(entityRenderer),
  'funder': _delegate(entityRenderer),
  'data-publication-ref': _delegate(dataPublicationRenderer),
  'magazine-article-ref': _delegate(magazineArticleRenderer),
  'newspaper-article-ref': _delegate(newspaperArticleRenderer),
  'software-ref': _delegate(softwareRenderer),
  'thesis-ref': _delegate(thesisRenderer),
  'webpage-ref': _delegate(webpageRenderer),
  'periodical-ref': _delegate(periodicalRenderer),
  'preprint-ref': _delegate(preprintRenderer),
  'keyword': _delegate(entityRenderer),
  'ref-contrib': _delegate(entityRenderer),
  'patent-ref': _delegate(patentRenderer),
  'subject': _delegate(entityRenderer),
  'custom-abstract': _delegate(entityRenderer)
}

/*
  Helpers
*/
function _renderAuthors ($$, authors, entityDb) {
  let fragments = []
  authors.forEach((refContribId, i) => {
    fragments = fragments.concat(
      entityRenderer($$, refContribId, entityDb, { short: false })
    )
    if (i < authors.length - 1) {
      fragments.push(', ')
    }
  })
  return fragments
}

function _renderDate ($$, year, month, day, format) {
  if (year) {
    if (month) {
      if (day) {
        return year + ' ' + _renderMonth(month, format) + ' ' + day
      } else {
        return year + ' ' + _renderMonth(month, format)
      }
    } else {
      return year
    }
  }
}

function _renderMonth (month, format) {
  let monthNames
  if (format === 'long') {
    monthNames = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  } else {
    monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
  if (month) {
    return monthNames[month] || month
  }
}

function _renderVolume ($$, volume) {
  return $$('b').append(volume);
}

function _renderDOI ($$, doi) {
  return $$('a').attr({
    href: `https://doi.org/${doi}`,
    target: '_blank'
  }).append(
    'https://doi.org/',
    doi
  )
}

/**
 * Generates an anchor element, targeting PubMed, for the specified ID.
 *
 * @param {*} $$ - DOM
 * @param {*} id - The PubMed ID of the article to link to.
 *
 * @returns {*} Document Fragment
 */
function _renderPMID ($$, id)
{
  return $$('a').attr({
    href: `https://www.ncbi.nlm.nih.gov/pubmed/${id}`,
    target: '_blank'
  }).append(
    id
  );
}

/**
 * Generates an anchor element, targeting PubMed Central, for the specified ID.
 *
 * @param {*} $$ - DOM
 * @param {*} id - The PubMed Central ID of the article to link to.
 *
 * @returns {*} Document Fragment
 */
function _renderPMCID ($$, id)
{
  return $$('a').attr({
    href: `https://www.ncbi.nlm.nih.gov/pmc/articles/${id}`,
    target: '_blank'
  }).append(
    id
  );
}

function _renderLocation ($$, fpage, lpage, pageRange, elocationId) {
  if (pageRange) {
    // Give up to three page ranges, then use passim for more, see
    // https://www.ncbi.nlm.nih.gov/books/NBK7282/box/A33679/?report=objectonly
    let parts = pageRange.split(',')
    if (parts.length > 3) {
      return parts.slice(0, 3).join(',') + ' passim'
    } else {
      return pageRange
    }
  } else if (fpage) {
    if (lpage) {
      // Do not repeat page numbers unless they are followed by a letter
      // e.g. 211-218 => 211-8 but 211A-218A stays
      if (fpage.length === lpage.length && /^\d+$/.test(fpage) && /^\d+$/.test(lpage)) {
        let i
        for (i = 0; i < fpage.length; i++) {
          if (fpage[i] !== lpage[i]) break
        }
        return fpage + '-' + lpage.substring(i)
      }
      return fpage + '-' + lpage
    } else {
      return fpage
    }
  } else if (elocationId) {
    return elocationId
  }
}

function _renderPublisherPlace ($$, place, publisher) {
  if (place && publisher) {
    return ' ' + place + ': ' + publisher + '.'
  } else if (place) {
    return ' ' + place + '.'
  } else if (publisher) {
    return ' ' + publisher + '.'
  } else {
    return ''
  }
}

function _renderURI ($$, uri)
{
  if (uri)
  {
    return $$('a').attr({
        href: uri,
        target: '_blank'
      }).append(
        uri
      );
  }
  else
  {
    return '';
  }
}

function _delegate (fn) {
  return function (entityId, db, exporter, options) {
    let el = _createElement()
    let $$ = el.createElement.bind(el)
    let fragments = fn($$, entityId, db, exporter, options)
    el.append(fragments)
    return el.innerHTML
  }
}

function _createElement () {
  return DefaultDOMElement.parseSnippet('<div>', 'html')
}
