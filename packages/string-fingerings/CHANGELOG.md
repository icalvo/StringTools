# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
## [1.0.2] - 2025-08-27
### Removed
- [BREAKING] Removed `String.additionalOpenNotes`
### Changed
- [BREAKING] Changed `String.openNote` type to `Note`
### Added
- Added `String.additionalOpenSemitones` which is a collection of (negative) numbers that can be added to the open note to get the additional available open notes.

## [0.6.0] 
### Added
- Optional max stops per string.
- `Note` class to preserve enharmonic representation.
- `parse` and `tryParse` to convert a text into a `Note`.
- `Note.abcnote` gives the ABC notation of the note (preserving enharmonic).
- `Note.text` gives back the textual representation of the note.

## [0.5.0] 
### Fixed
- Fixed max stretches and added total stretch check to filter out some impossible fingerings.
## [0.4.0] - 2014-08-17 [YANKED]