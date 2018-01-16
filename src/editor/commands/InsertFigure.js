export default function(tx, file) {
  let imageUrl = URL.createObjectURL(file)
  let mimeData = file.type.split('/')
  let fig = tx.createElement('fig')
  fig.append(
   tx.createElement('object-id').text(fig.id),
   tx.createElement('title').text('Figure title'),
   tx.createElement('caption').append(
     tx.createElement('p').text('Figure caption')
   ),
   tx.createElement('graphic').attr({
     'mime-subtype': mimeData[1],
     'mimetype': mimeData[0],
     'xlink:href': imageUrl
   })
  )
  return fig
}
