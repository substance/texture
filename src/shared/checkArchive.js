export default function checkLoadArchive (ArchiveClass, rawArchive) {
  let testArchive = new ArchiveClass()
  try {
    testArchive._ingest(rawArchive)
  } catch (error) {
    /* istanbul ignore next */
    return error
  }
}
