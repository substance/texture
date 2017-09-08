/*
  Extracts the code elements and returns array of source-code and code elements
*/
export default function convertSourceCode(el, converter) {
  let miniSource = el.find('code[language=mini]')
  let nativeSource = el.find('code:not([language=mini])')
  let output = el.find('code[specific-use=output]')
  let miniSourceText
  let result = []

  if (miniSource) {
    miniSourceText = miniSource.textContent
  } else if (nativeSource) {
    // We make up mini source string if not present
    miniSourceText = nativeSource.attr('language')+'()'
  } else {
    converter.error({
      msg: 'Either code[lanuage=mini] or code:not([language=mini]) must be provided',
      el: el
    })
  }

  result.push(
    el.createElement('source-code').attr('language', 'mini').append(
      miniSourceText
    )
  )

  if (nativeSource) {
    result.push(
      el.createElement('source-code').attr('language', nativeSource.attr('language')).append(
        nativeSource.textContent
      )
    )
  }

  result.push(
    el.createElement('output').append(output.textContent)
  )
  return result
}
