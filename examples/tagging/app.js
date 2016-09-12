import App from '../author/app'
import TaggingPackage from './TaggingPackage'

if (typeof window !== 'undefined') {
  window.onload = function() {
    let configurator = new App.Configurator()
    configurator.import(TaggingPackage)
    var app = App.mount({
      configurator: configurator,
      documentId: 'kitchen-sink-author'
    }, document.body)
    window.app = app
  };
}
