# Search Testing Guide

## Overview

Test scenarios for product search/autocomplete functionality within the catalog.

> This should match the project's implementation for the actual search mechanism (client-side filter, Supabase full-text search, or third-party search service).

## Test Scenarios

### Basic Search

- [ ] Searching an exact product name returns that product
- [ ] Searching a partial product name returns relevant matches
- [ ] Searching a brand name returns products from that brand (if brand is indexed for search)
- [ ] Search is case-insensitive
- [ ] Search with no matches shows a clear "no results" state

### Edge Cases

- [ ] Empty search query behaves sensibly (no results, or full catalog — confirm expected behavior)
- [ ] Search with special characters does not error
- [ ] Very long search queries are handled gracefully (truncation or rejection, per implementation)
- [ ] Search input is debounced to avoid excessive requests while typing (if applicable)

### Performance

- [ ] Search results return within an acceptable time on a representative catalog size (see `performance-testing.md`)

## Related Documentation

- `../api/catalog.md`
- `catalog-testing.md`
- `performance-testing.md`
