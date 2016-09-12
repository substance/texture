import isString from 'lodash/isString'
import { ArrayIterator, makeMap } from 'substance'

export default class XMLIterator {
  constructor(elements) {
    this.it = new ArrayIterator(elements);
  }

  optional(tagName, cb) {
    this._one(tagName, true, cb);
  }

  required(tagName, cb) {
    this._one(tagName, false, cb);
  }

  _one(tagName, optional, cb) {
    if (this.it.hasNext()) {
      var el = this.it.next();
      if (el.tagName === tagName) {
        return cb(el);
      } else {
        this.it.back();
      }
    }
    if (!optional) throw new Error("Expecting element '"+ tagName +"'.");
  }

  _manyOf(tagNames, cb) {
    if (isString(tagNames)) tagNames = [tagNames];
    var count = 0;
    tagNames = makeMap(tagNames);
    while(this.it.hasNext()) {
      var el = this.it.next();
      if (tagNames[el.tagName]) {
        count++;
        cb(el);
      } else {
        this.it.back();
        break;
      }
    }
    return count;
  }

  manyOf(tagNames, cb) {
    return this._manyOf(tagNames, cb);
  }

  oneOrMoreOf(tagNames, cb) {
    var count = this._manyOf(tagNames, cb);
    if (count === 0) {
      throw new Error('Expecting at least one element of ' + String(tagNames));
    }
    return count;
  }

  hasNext() {
    return this.it.hasNext();
  }

}
