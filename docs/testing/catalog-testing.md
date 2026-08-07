# Catalog Testing Guide

## Overview

Test scenarios for the customer-facing product catalog: browsing, filtering, and viewing product detail.

> This should match the project's implementation for exact filter options and pagination behavior.

## Test Scenarios

### Listing

- [ ] Catalog page loads and displays products
- [ ] Pagination (or infinite scroll) works correctly across pages
- [ ] Empty catalog state (no products matching filters) displays an appropriate message

### Filtering & Sorting

- [ ] Filtering by brand returns only matching products
- [ ] Filtering by category returns only matching products
- [ ] Combining multiple filters (brand + category) narrows results correctly
- [ ] Sorting by price (asc/desc) orders results correctly
- [ ] Clearing filters resets to the full catalog

### Product Detail

- [ ] Product detail page displays correct name, price, description, and images
- [ ] Out-of-stock products are clearly indicated
- [ ] "Add to Cart" is disabled or handled appropriately for out-of-stock items
- [ ] Navigating to a non-existent product ID shows a 404/not-found state

### Images

- [ ] Product images load correctly from Supabase Storage
- [ ] Missing/broken image URLs fall back to a placeholder rather than a broken image icon

## Related Documentation

- `../api/catalog.md`
- `search-testing.md`
- `inventory-testing.md`
