import { DefaultDOMElement as DOMElement } from 'substance'

/*
  TODO: Get rid of HTML renderer. Instead extract data as
  JSON and then pass it to a component for rendering
*/
let namesToHTML = function(ref) {
  let nameElements = ref.findAll('name')
  let nameEls = []
  for (let i = 0; i < nameElements.length; i++) {
    let name = nameElements[i]
    let nameEl = DOMElement.createElement('span')
    nameEl.addClass('name')
    nameEl.text(name.find('surname').text() + ' ' + name.find('given-names').text())
    if (i > 0 && i < nameElements.length) {
      let comma = DOMElement.createElement('span')
      comma.text(', ')
      nameEls.push(comma)
    }
    nameEls.push(nameEl)
  }
  return nameEls
}

let titleToHTML = function (ref) {
  let articleTitle = ref.find('article-title')
  let title = DOMElement.createElement('div')
  title.addClass('title')

  if (articleTitle) {
    title.text(articleTitle.text() + '. ')
  } else {
    title.text('Untitled. ')
  }

  return title
}

let metaToHTML = function (ref) {

  // Example: "Cellular and Molecular Life Sciences, 70: 2657-2675, 2013"

  let meta = DOMElement.createElement('div')

  meta.addClass('meta')

  let metaText = ''

  let source = ref.find('source')
  if (source) metaText += source.text() + ', '

  let volume = ref.find('volume')
  if (volume) metaText += volume.text() + ': '

  let fpage = ref.find('fpage')
  if (fpage) metaText += fpage.text() + '-'

  let lpage = ref.find('lpage')
  if (lpage) metaText += lpage.text() + ', '

  let year = ref.find("year");
  if (year) metaText += year.text()

  meta.text(metaText)
  return meta
}

// let URItoHTML = function (ref) {
//   let el = DOMElement.createElement('div')
//   el.addClass('doi')
//
//   let doi = ref.find("pub-id[pub-id-type='doi'], ext-link[ext-link-type='doi']")
//   let uri = ref.find("ext-link[ext-link-type='uri']")
//
//   let url
//
//   if (doi) {
//     url = 'http://dx.doi.org/' + doi.text()
//   } else if (uri) {
//     url = uri.getAttribute('xlink:href')
//   }
//
//   el.appendChild(DOMElement.createElement('a').setAttribute('href', url).text(url))
//   return el
// }

let refToHTML = function (ref) {

  // ref element to HTML - https://jats.nlm.nih.gov/archiving/tag-library/0.4/n-ac60.html
  // ------------------
  // NLM XML example element-citation:
  //
  // <ref id="bib56">
  //     <element-citation publication-type="journal">
  //         <person-group person-group-type="author">
  //             <name>
  //                 <surname>Weinhold</surname>
  //                 <given-names>A</given-names>
  //             </name>
  //             <name>
  //                 <surname>Baldwin</surname>
  //                 <given-names>IT</given-names>
  //             </name>
  //         </person-group>
  //         <year>2011</year>
  //         <article-title>Trichome-derived O-acyl sugars are a first meal for caterpillars that tags them for predation</article-title>
  //         <source>Proc Natl Acad Sci U S A</source>
  //         <volume>108</volume>
  //         <fpage>7855</fpage>
  //         <lpage>7859</lpage>
  //         <ext-link ext-link-type="uri" xlink:href="http://dx.doi.org/10.1073/pnas.1101306108">10.1073/pnas.1101306108</ext-link>
  //     </element-citation>
  // </ref>

  // NLM XML example mixed-citation:
  // <ref id="bib2">
  //   <mixed-citation publication-type="journal">
  //       <person-group person-group-type="author">
  //           <name>
  //               <surname>Im</surname>
  //               <given-names>JT</given-names>
  //           </name>
  //           <name>
  //               <surname>Park</surname>
  //               <given-names>BY</given-names>
  //           </name>
  //       </person-group>.
  //       <year>2013</year>.
  //       <article-title>Giant epidermal cyst on posterior scalp</article-title>.
  //       <source>Arch Plast Surg</source>.
  //       <volume>40</volume>
  //       <fpage>280</fpage>-
  //       <lpage>2</lpage>
  //       <pub-id pub-id-type="doi">10.5999/aps.2013.40.3.280</pub-id>
  //   </mixed-citation>
  // </ref>

  ref = ref.getDOM()

  // TODO: remove safeguard for multiple citation elements
  if(Array.isArray(ref)) {
    ref = ref[0]
  }
  let el = DOMElement.createElement('div')
  if (ref.is('mixed-citation')) {
    el.appendChild(ref.textContent)
  } else if (ref.is('element-citation')) {
    el.appendChild(titleToHTML(ref))
    let names = namesToHTML(ref)
    for (let i = 0; i < names.length; i++) {
      el.appendChild(names[i])
    }
    el.appendChild(metaToHTML(ref))
    // el.appendChild(URItoHTML(ref))
  } else {
    el.text('Citation type is unsupported')
  }

  return el

}

export default refToHTML
