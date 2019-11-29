import BodyConverter from './BodyConverter'
import BoldConverter from './BoldConverter'
import BlockFormulaConverter from './BlockFormulaConverter'
import BlockQuoteConverter from './BlockQuoteConverter'
import BreakConverter from './BreakConverter'
import FigureConverter from './FigureConverter'
import FigurePanelConverter from './FigurePanelConverter'
import FootnoteConverter from './FootnoteConverter'
import ElementCitationConverter from './ElementCitationConverter'
import ExternalLinkConverter from './ExternalLinkConverter'
import GraphicConverter from './GraphicConverter'
import HeadingConverter from './HeadingConverter'
import InlineFormulaConverter from './InlineFormulaConverter'
import InlineGraphicConverter from './InlineGraphicConverter'
import ItalicConverter from './ItalicConverter'
import MonospaceConverter from './MonospaceConverter'
import ListConverter from './ListConverter'
import OverlineConverter from './OverlineConverter'
import ParagraphConverter from './ParagraphConverter'
import PermissionsConverter from './PermissionsConverter'
import PreformatConverter from './PreformatConverter'
import SmallCapsConverter from './SmallCapsConverter'
import StringDateConvertor from './StringDateConverter'
import StrikeThroughConverter from './StrikeThroughConverter'
import SubscriptConverter from './SubscriptConverter'
import SuperscriptConverter from './SuperscriptConverter'
import SupplementaryFileConverter from './SupplementaryFileConverter'
import TableConverter from './TableConverter'
import TableFigureConverter from './TableFigureConverter'
import UnderlineConverter from './UnderlineConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

export default [
  new BodyConverter(),
  new BoldConverter(),
  new BlockFormulaConverter(),
  new BlockQuoteConverter(),
  new BreakConverter(),
  new ExternalLinkConverter(),
  new FigureConverter(),
  new FigurePanelConverter(),
  new FootnoteConverter(),
  new GraphicConverter(),
  new HeadingConverter(),
  new ElementCitationConverter(),
  new InlineFormulaConverter(),
  new InlineGraphicConverter(),
  new ItalicConverter(),
  new MonospaceConverter(),
  new ListConverter(),
  new OverlineConverter(),
  new ParagraphConverter(),
  new PermissionsConverter(),
  new PreformatConverter(),
  new SmallCapsConverter(),
  new StringDateConvertor(),
  new StrikeThroughConverter(),
  new SubscriptConverter(),
  new SuperscriptConverter(),
  new SupplementaryFileConverter(),
  new TableConverter(),
  new TableFigureConverter(),
  new UnderlineConverter(),
  UnsupportedNodeConverter,
  UnsupportedInlineNodeConverter,
  new XrefConverter()
]
