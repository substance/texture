import Abstract from './Abstract';
import Acknowledgement from './Acknowledgement';
import Affiliation from './Affiliation';
import Article from './Article';
import ArticleRef from './ArticleRef';
import BlockFormula from './BlockFormula';
import BlockQuote from './BlockQuote';
import Body from './Body';
import Bold from './Bold';
import Box from './Box';
import BookRef from './BookRef';
import Break from './Break';
import ChapterRef from './ChapterRef';
import ConferencePaperRef from './ConferencePaperRef';
import CustomAbstract from './CustomAbstract';
import MetadataField from './MetadataField';
import DataPublicationRef from './DataPublicationRef';
import ExternalLink from './ExternalLink';
import Figure from './Figure';
import FigurePanel from './FigurePanel';
import Footnote from './Footnote';
import Funder from './Funder';
import Graphic from './Graphic';
import Group from './Group';
import Heading from './Heading';
import InlineFormula from './InlineFormula';
import InlineGraphic from './InlineGraphic';
import Italic from './Italic';
import Keyword from './Keyword';
import JournalArticleRef from './JournalArticleRef';
import List from './List';
import ListItem from './ListItem';
import MagazineArticleRef from './MagazineArticleRef';
import Metadata from './Metadata';
import Monospace from './Monospace';
import NewspaperArticleRef from './NewspaperArticleRef';
import Overline from './Overline';
import Paragraph from './Paragraph';
import PatentRef from './PatentRef';
import PeriodicalRef from './PeriodicalRef';
import Permission from './Permission';
import Person from './Person';
import Preformat from './Preformat';
import PreprintRef from './PreprintRef';
import RefContrib from './RefContrib';
import Reference from './Reference';
import RelatedArticle from './RelatedArticle';
import ReportRef from './ReportRef';
import SmallCaps from './SmallCaps';
import SoftwareRef from './SoftwareRef';
import StringDate from './StringDate';
import StrikeThrough from './StrikeThrough';
import Subject from './Subject';
import Subscript from './Subscript';
import Superscript from './Superscript';
import SupplementaryFile from './SupplementaryFile';
import Table from './Table';
import TableCell from './TableCell';
import TableFigure from './TableFigure';
import TableRow from './TableRow';
import ThesisRef from './ThesisRef';
import Underline from './Underline';
import UnsupportedNode from './UnsupportedNode';
import UnsupportedInlineNode from './UnsupportedInlineNode';
import WebpageRef from './WebpageRef';
import Xref from './Xref';

export default {
  name: 'article.model',
  configure(config) {
    [
      Abstract,
      Acknowledgement,
      Article,
      ArticleRef,
      BlockFormula,
      BlockQuote,
      Body,
      Bold,
      BookRef,
      Box,
      Break,
      ChapterRef,
      ConferencePaperRef,
      CustomAbstract,
      MetadataField,
      DataPublicationRef,
      ExternalLink,
      Figure,
      FigurePanel,
      Footnote,
      Funder,
      Graphic,
      Group,
      Heading,
      InlineFormula,
      InlineGraphic,
      Italic,
      Keyword,
      JournalArticleRef,
      List,
      ListItem,
      MagazineArticleRef,
      Metadata,
      Monospace,
      NewspaperArticleRef,
      Affiliation,
      Overline,
      Paragraph,
      PatentRef,
      PeriodicalRef,
      Permission,
      Person,
      Preformat,
      PreprintRef,
      RefContrib,
      Reference,
      RelatedArticle,
      ReportRef,
      SmallCaps,
      SoftwareRef,
      StringDate,
      StrikeThrough,
      Subject,
      Subscript,
      Superscript,
      SupplementaryFile,
      Table,
      TableCell,
      TableFigure,
      TableRow,
      ThesisRef,
      Underline,
      WebpageRef,
      Xref
    ].forEach(node => config.addNode(node));
    // additionally register nodes that are used to wrap unsupported XML elements
    config.addNode(UnsupportedNode);
    config.addNode(UnsupportedInlineNode);
  }
};
