import InsertNodeCommand from './InsertNodeCommand'

export default class InsertFigureCommand extends InsertNodeCommand {

  createNode(tx) {
    let fig = tx.createElement('fig')
    fig.append(
      tx.createElement('object-id').attr('pub-id-type', 'doi').text('test-fig'),
      tx.createElement('title').text(''),
      tx.createElement('caption').append(
        tx.createElement('p').text('')
      ),
      tx.createElement('graphic').attr({
        'mime-subtype': 'jpeg',
        'mimetype': 'image',
        'xlink:href': './assets/fig1.jpg'
      })
    )
    return fig
  }
}
