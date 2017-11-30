export default [
  {
    "type": "person",
    "id": "person-1",
    "givenNames": "Smith",
    "surname": "Jane",
    "affiliations": ["organisation-1"]
  },
  {
    "type": "person",
    "id": "person-2",
    "givenNames": "Smith",
    "surname": "John",
    "affiliations": ["organisation-2"]
  },
  {
    "type": "person",
    "id": "person-3",
    "givenNames": "Max",
    "surname": "Mustermann",
    "affiliations": []
  },
  {
    "type": "person",
    "id": "person-4",
    "givenNames": "Alex",
    "surname": "Meyer",
    "affiliations": []
  },
  {
    "type": "organisation",
    "id": "organisation-1",
    "name": "Settles-Young Research Corporation",
    "division1": "Laboratory of Neural Systems",
    "division2": "",
    "division3": "",
    "street": "283 Hawthorne Drive",
    "addressComplements": "Suite 310",
    "city": "Lexington",
    "state": "KY",
    "postalCode": "40503",
    "country": "USA",
    "phone": "(859) 273-8543",
    "fax": "(859) 299-4683"
  },
  {
    "type": "organisation",
    "id": "organisation-2",
    "name": "Example organisation",
    "division1": "Example division",
    "division2": "",
    "division3": "",
    "street": "283 Example street",
    "addressComplements": "Suite 310",
    "city": "Vienna",
    "postalCode": "1010",
    "country": "Austria",
  },
  {
    "type": "book",
    "id": "book-1",
    "authors": [
      "person-2"
    ],
    "editors": [
      "person-1"
    ],
    "chapterTitle": "Tobacco use",
    "source": "Clinical methods: the history, physical, and laboratory examinations",
    "publisherLoc": "Stoneham (MA)",
    "publisherName": "Butterworth Publishers",
    "year": "1990",
    "month": "10",
    "day": "5",
    "fpage": "214",
    "lpage": "216",
    "pageRange": "214-216",
    "doi": "book-1"
  },
  {
    "type": "journal-article",
    "id": "journal-article-1",
    "authors": [
      "person-2"
    ],
    "editors": [
      "person-1"
    ],
    "articleTitle": "Context-specific grasp movement representation in the macaque anterior intraparietal area",
    "source": "Journal of Neuroscience",
    "volume": "29",
    "year": "2009",
    "month": "10",
    "day": "5",
    "fpage": "6436",
    "lpage": "6448",
    "pageRange": "6436-6448",
    "doi": "10.1523/JNEUROSCI.5479-08.2009"
  }
]
