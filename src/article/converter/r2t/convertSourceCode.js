/*
  Extracts the code elements and returns array of source-code and code elements
*/
export default function convertSourceCode(el) {
  let source = el.find('code[specific-use=source]')
  let output = el.find('code[specific-use=output]')
  let result = []

  result.push(
    el.createElement('source-code').attr('language', 'mini').append(
      source.textContent
    )
  )

  result.push(
    el.createElement('output').attr('language', output.attr('language')).append(
      output.textContent
    )
  )
  return result
}
