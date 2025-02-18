# AnimationControlApi.ClientsApi

All URIs are relative to *http://127.0.0.1:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiClientGetClientIDGet**](ClientsApi.md#apiClientGetClientIDGet) | **GET** /api/client/get/{clientID} | Get configuration of a specific client
[**apiClientListGet**](ClientsApi.md#apiClientListGet) | **GET** /api/client/list | List all connected clients
[**apiClientSetClientIDPost**](ClientsApi.md#apiClientSetClientIDPost) | **POST** /api/client/set/{clientID} | Set configuration for a specific client
[**apiClientSetPost**](ClientsApi.md#apiClientSetPost) | **POST** /api/client/set/ | Set configuration for all clients

<a name="apiClientGetClientIDGet"></a>
# **apiClientGetClientIDGet**
> ClientConfig apiClientGetClientIDGet(clientID)

Get configuration of a specific client

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ClientsApi();
let clientID = "clientID_example"; // String | ID of the client

apiInstance.apiClientGetClientIDGet(clientID, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientID** | **String**| ID of the client | 

### Return type

[**ClientConfig**](ClientConfig.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiClientListGet"></a>
# **apiClientListGet**
> InlineResponse200 apiClientListGet()

List all connected clients

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ClientsApi();
apiInstance.apiClientListGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiClientSetClientIDPost"></a>
# **apiClientSetClientIDPost**
> apiClientSetClientIDPost(body, clientID)

Set configuration for a specific client

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ClientsApi();
let body = new AnimationControlApi.ClientConfig(); // ClientConfig | 
let clientID = "clientID_example"; // String | ID of the client (leave empty to broadcast to all clients)

apiInstance.apiClientSetClientIDPost(body, clientID, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ClientConfig**](ClientConfig.md)|  | 
 **clientID** | **String**| ID of the client (leave empty to broadcast to all clients) | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="apiClientSetPost"></a>
# **apiClientSetPost**
> apiClientSetPost(body)

Set configuration for all clients

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ClientsApi();
let body = new AnimationControlApi.ClientConfig(); // ClientConfig | 

apiInstance.apiClientSetPost(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ClientConfig**](ClientConfig.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

