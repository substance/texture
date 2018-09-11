import { ListPackage } from 'substance'
import TableConverter from '../r2t/TableConverter'

import BoldConverter from './BoldConverter'
import ExtLinkConverter from './ExtLinkConverter'
import CodeblockConverter from './CodeblockConverter'
import HeadingConverter from './HeadingConverter'
import ItalicConverter from './ItalicConverter'
import ListConverter from './ListConverter'
import ParagraphConverter from './ParagraphConverter'
import StrikeConverter from './StrikeConverter'
import SubConverter from './SubConverter'
import SupConverter from './SupConverter'
import UnderlineConverter from './UnderlineConverter'

export default [
  BoldConverter,
  CodeblockConverter,
  ExtLinkConverter,
  HeadingConverter,
  ItalicConverter,
  ListConverter,
  ListPackage.ListItemHTMLConverter,
  ParagraphConverter,
  StrikeConverter,
  SubConverter,
  SupConverter,
  new TableConverter(),
  UnderlineConverter
]
