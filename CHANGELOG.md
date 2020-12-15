# Change Log
All notable changes to the "magic" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.4.8] - 2020-12-15
### Changes
- S(0) hover uses 24h time instead of 12h

## [1.4.7] - 2019-11-08
### Fixed
- Lines wrapping incorrectly in AMS language

## [1.4.7] - 2019-11-08
### Added
- New language "ams" which wraps at 80 characters

## [1.4.6] - 2019-06-13
### Added
- Hover support for MRI visit nodes (for NPR, the reverse chronlogical subscript)
  - Setting: `magic.hoverVisitNodes`

## [1.4.5] - 2019-05-29
### Changed
- Language is no longer associated to txt extension by default

## [1.4.4] - 2019-01-16
### Added
- Configuration option to toggle S(0) hover support (magic.hoverSeconds)

## [1.4.3] - 2018-08-03
### Added
- Symbol support for procedure macros
- Experimental hover support for S(0) values

## [1.4.2] - 2018-06-21
### Changed
- MAGIC Language word definition

### Fixed
- Fix bug with definition commands

## [1.4.1] - 2018-06-21
### Added
- Support "Go to definition" and "Peek definition" for procedure macro calls

## [1.4.0] - 2018-05-10
### Added
- Custom code folding based on procedure macros

## [1.3.3] - 2018-03-12
### Added
- //noformat and //endnoformat tags to add inline notes to MAGIC document (not valid MAGIC code)

## [1.3.2] - 2018-03-12
### Fixed
- Fix bug with hover support
- Fix formatting with quotebrackets

## [1.3.1] - 2018-03-08
### Added
- Hover support for local variables and structures with proper documentation
- Support for the "quotebracket" MAGIC function (`1,two,THREE')

## [1.3.0] - 2018-03-01
### Added
- Integrate formatting logic into built-in commands: Format Document and Format Selection

## [1.2.6] - 2018-02-01
### Fixed
- Fix indentation for non-control curly brace statements

## [1.2.5] - 2017-10-19
### Fixed
- Fix syntax order

## [1.2.4] - 2017-10-19
### Changed
- Syntax improvements

## [1.2.3] - 2017-10-18
### Fixed
- Bugfix

## [1.2.2] - 2017-10-16
### Fixed
- Small syntax fixes

## [1.2.1] - 2017-10-11
### Changed
- Syntax improvements

## [1.2.0] - 2017-10-04
### Changed
- Major changes to syntax formatting
- A few changes to reindent code

## [1.1.7] - 2017-10-03
### Changed
- Rewrote reindent code

## [1.1.6] - 2017-09-28
### Changed
- Clean up documentation

### Fixed
- Fix square bracket multiline bug

## [1.1.5] - 2017-09-20
### Fixed
- Reindent uses entire document if there's no selection

## [1.1.4] - 2017-09-20
### Fixed
- Bugfix

## [1.1.3] - 2017-09-20
### Changed
- Add line number to reindent error

## [1.1.2] - 2017-09-19
### Fixed
- Fixed crash with Reindent

## [1.1.1] - 2017-09-18
### Changed
- Improvements to the Reindent command

## [1.1.0] - 2017-09-16
### Added
- "Reindent MAGIC Code" command (experimental)

## [1.0.2] - 2017-09-15
### Changed
- Disable code folding (until indentation rules can be created)

## [1.0.1] - 2017-09-14
### Added
- MAGIC-specific settings overrides

## [1.0.0] - 2017-09-13
- Initial release
