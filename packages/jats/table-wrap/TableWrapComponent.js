var FigureComponent = require('../figure/FigureComponent');

function TableWrapComponent() {
  TableWrapComponent.super.apply(this, arguments);
}

FigureComponent.extend(TableWrapComponent);

module.exports = TableWrapComponent;