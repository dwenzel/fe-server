# Pages & Items API Documentation

This document provides details about the Pages & Items API, which allows you to manage pages and their associated items.

## API Overview

- **Version**: 1.0.0
- **Title**: Pages & Items API
- **Description**: An API to manage pages & items

## Authentication

The API uses API key authentication:

- **Type**: API Key
- **Header Name**: X-Api-Key
- **Location**: HTTP Header

## Endpoints

### Pages

#### Create a new page

```
POST /pages
```

Creates a new page.

**Security**: Requires API Key

**Request Body**: Required
- Content-Type: application/json
- Schema: [Page](#page-schema)

**Responses**:
- `201`: Page created
- `400`: Invalid input
- `401`: Unauthorized

#### Update a page

```
PUT /pages/{id}
```

Updates an existing page.

**Parameters**:
- `id` (path, required): The UUID of the page to update

**Security**: Requires API Key

**Request Body**: Required
- Content-Type: application/json
- Schema: [Page](#page-schema)

**Responses**:
- `200`: Page updated
- `400`: Invalid input
- `401`: Unauthorized
- `404`: Page not found

#### Delete a page

```
DELETE /pages/{id}
```

Deletes a page.

**Parameters**:
- `id` (path, required): The UUID of the page to delete

**Security**: Requires API Key

**Responses**:
- `204`: Page deleted
- `401`: Unauthorized
- `404`: Page not found

### Items

#### Create a new item

```
POST /items
```

Creates a new item.

**Security**: Requires API Key

**Request Body**: Required
- Content-Type: application/json
- Schema: [Item](#item-schema)

**Responses**:
- `201`: Item created
- `400`: Invalid input
- `401`: Unauthorized

#### Update an item

```
PUT /items/{id}
```

Updates an existing item.

**Parameters**:
- `id` (path, required): The UUID of the item to update

**Security**: Requires API Key

**Request Body**: Required
- Content-Type: application/json
- Schema: [Item](#item-schema)

**Responses**:
- `200`: Item updated
- `400`: Invalid input
- `401`: Unauthorized
- `404`: Item not found

#### Delete an item

```
DELETE /items/{id}
```

Deletes an item.

**Parameters**:
- `id` (path, required): The UUID of the item to delete

**Security**: Requires API Key

**Responses**:
- `204`: Item deleted
- `401`: Unauthorized
- `404`: Item not found

## Schemas

### Page Schema

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "The page's ID."
    },
    "name": {
      "type": "string",
      "description": "The page's name."
    },
    "attributes": {
      "type": "object",
      "additionalProperties": {
        "oneOf": [
          { "type": "string" },
          { "type": "integer" },
          {
            "type": "string",
            "enum": ["Option1", "Option2"]
          }
        ]
      },
      "description": "Page attributes, key-value pairs."
    },
    "parent": {
      "type": "string",
      "format": "uuid",
      "description": "The ID of the parent page, if any."
    },
    "metadata": {
      "$ref": "#/components/schemas/Metadata",
      "description": "The metadata of the page."
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Item"
      },
      "description": "The items associated with the page."
    }
  }
}
```

### Metadata Schema

```json
{
  "type": "object",
  "description": "The metadata of the page.",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "robots": {
      "type": "string"
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### Item Schema

```json
{
  "type": "object",
  "required": ["id", "parent", "type"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "The item's ID."
    },
    "name": {
      "type": "string",
      "description": "The item's name."
    },
    "attributes": {
      "type": "object",
      "additionalProperties": {
        "oneOf": [
          { "type": "string" },
          { "type": "integer" },
          {
            "type": "string",
            "enum": ["Option1", "Option2"]
          }
        ]
      },
      "description": "Item attributes, key-value pairs."
    },
    "content": {
      "type": "string",
      "description": "The content of the item."
    },
    "parent": {
      "type": "string",
      "format": "uuid",
      "description": "The ID of the parent page or item."
    },
    "type": {
      "type": "string",
      "enum": ["dynamic", "list", "news", "project", "event"],
      "description": "The type of the item."
    }
  }
}
```