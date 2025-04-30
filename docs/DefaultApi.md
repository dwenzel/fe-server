# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**itemsIdDelete**](DefaultApi.md#itemsIdDelete) | **DELETE** /items/{id} | Delete an item
[**itemsIdPut**](DefaultApi.md#itemsIdPut) | **PUT** /items/{id} | Update an item
[**itemsPost**](DefaultApi.md#itemsPost) | **POST** /items | Create a new item
[**pagesIdDelete**](DefaultApi.md#pagesIdDelete) | **DELETE** /pages/{id} | Delete a page
[**pagesIdPut**](DefaultApi.md#pagesIdPut) | **PUT** /pages/{id} | Update a page
[**pagesPost**](DefaultApi.md#pagesPost) | **POST** /pages | Create a new page


# **itemsIdDelete**
> void itemsIdDelete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiItemsIdDeleteRequest = {
  // string
  id: "id_example",
};

apiInstance.itemsIdDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Item deleted |  -  |
**401** | Unauthorized |  -  |
**404** | Item not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **itemsIdPut**
> void itemsIdPut(item)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiItemsIdPutRequest = {
  // string
  id: "id_example",
  // Item
  item: {
    id: "id_example",
    name: "name_example",
    attributes: {
      "key": null,
    },
    content: "content_example",
    parent: "parent_example",
    type: "dynamic",
  },
};

apiInstance.itemsIdPut(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **item** | **Item**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Item updated |  -  |
**400** | Invalid input |  -  |
**401** | Unauthorized |  -  |
**404** | Item not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **itemsPost**
> void itemsPost(item)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiItemsPostRequest = {
  // Item
  item: {
    id: "id_example",
    name: "name_example",
    attributes: {
      "key": null,
    },
    content: "content_example",
    parent: "parent_example",
    type: "dynamic",
  },
};

apiInstance.itemsPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **item** | **Item**|  |


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Item created |  -  |
**400** | Invalid input |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **pagesIdDelete**
> void pagesIdDelete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiPagesIdDeleteRequest = {
  // string
  id: "id_example",
};

apiInstance.pagesIdDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Page deleted |  -  |
**401** | Unauthorized |  -  |
**404** | Page not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **pagesIdPut**
> void pagesIdPut(page)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiPagesIdPutRequest = {
  // string
  id: "id_example",
  // Page
  page: {
    id: "id_example",
    name: "name_example",
    attributes: {
      "key": null,
    },
    parent: "parent_example",
    metadata: {
      title: "title_example",
      description: "description_example",
      robots: "robots_example",
      keywords: [
        "keywords_example",
      ],
    },
    items: [
      {
        id: "id_example",
        name: "name_example",
        attributes: {
          "key": null,
        },
        content: "content_example",
        parent: "parent_example",
        type: "dynamic",
      },
    ],
  },
};

apiInstance.pagesIdPut(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Page updated |  -  |
**400** | Invalid input |  -  |
**401** | Unauthorized |  -  |
**404** | Page not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **pagesPost**
> void pagesPost(page)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiPagesPostRequest = {
  // Page
  page: {
    id: "id_example",
    name: "name_example",
    attributes: {
      "key": null,
    },
    parent: "parent_example",
    metadata: {
      title: "title_example",
      description: "description_example",
      robots: "robots_example",
      keywords: [
        "keywords_example",
      ],
    },
    items: [
      {
        id: "id_example",
        name: "name_example",
        attributes: {
          "key": null,
        },
        content: "content_example",
        parent: "parent_example",
        type: "dynamic",
      },
    ],
  },
};

apiInstance.pagesPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page**|  |


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Page created |  -  |
**400** | Invalid input |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


