# AnimationControlApi.ShadersApi

All URIs are relative to *http://127.0.0.1:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiElementShaderGetShaderIDGet**](ShadersApi.md#apiElementShaderGetShaderIDGet) | **GET** /api/elementShader/get/{shaderID} | Get details of a specific shader
[**apiElementShaderImageShaderIDGet**](ShadersApi.md#apiElementShaderImageShaderIDGet) | **GET** /api/elementShader/image/{shaderID} | Get the image associated with a shader
[**apiElementShaderListGet**](ShadersApi.md#apiElementShaderListGet) | **GET** /api/elementShader/list | List all available shaders
[**apiTextureShaderGetShaderIDGet**](ShadersApi.md#apiTextureShaderGetShaderIDGet) | **GET** /api/textureShader/get/{shaderID} | Get details of a specific shader
[**apiTextureShaderImageShaderIDGet**](ShadersApi.md#apiTextureShaderImageShaderIDGet) | **GET** /api/textureShader/image/{shaderID} | Get the image associated with a shader
[**apiTextureShaderListGet**](ShadersApi.md#apiTextureShaderListGet) | **GET** /api/textureShader/list | List all available shaders

<a name="apiElementShaderGetShaderIDGet"></a>
# **apiElementShaderGetShaderIDGet**
> ShaderDefinition apiElementShaderGetShaderIDGet(shaderID)

Get details of a specific shader

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
let shaderID = "shaderID_example"; // String | ID of the shader to retrieve

apiInstance.apiElementShaderGetShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the shader to retrieve | 

### Return type

[**ShaderDefinition**](ShaderDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiElementShaderImageShaderIDGet"></a>
# **apiElementShaderImageShaderIDGet**
> apiElementShaderImageShaderIDGet(shaderID)

Get the image associated with a shader

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
let shaderID = "shaderID_example"; // String | ID of the shader

apiInstance.apiElementShaderImageShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the shader | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiElementShaderListGet"></a>
# **apiElementShaderListGet**
> {&#x27;String&#x27;: ShaderDefinition} apiElementShaderListGet()

List all available shaders

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
apiInstance.apiElementShaderListGet((error, data, response) => {
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

[**{&#x27;String&#x27;: ShaderDefinition}**](ShaderDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiTextureShaderGetShaderIDGet"></a>
# **apiTextureShaderGetShaderIDGet**
> ShaderDefinition apiTextureShaderGetShaderIDGet(shaderID)

Get details of a specific shader

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
let shaderID = "shaderID_example"; // String | ID of the shader to retrieve

apiInstance.apiTextureShaderGetShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the shader to retrieve | 

### Return type

[**ShaderDefinition**](ShaderDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiTextureShaderImageShaderIDGet"></a>
# **apiTextureShaderImageShaderIDGet**
> apiTextureShaderImageShaderIDGet(shaderID)

Get the image associated with a shader

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
let shaderID = "shaderID_example"; // String | ID of the shader

apiInstance.apiTextureShaderImageShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the shader | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiTextureShaderListGet"></a>
# **apiTextureShaderListGet**
> {&#x27;String&#x27;: ShaderDefinition} apiTextureShaderListGet()

List all available shaders

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.ShadersApi();
apiInstance.apiTextureShaderListGet((error, data, response) => {
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

[**{&#x27;String&#x27;: ShaderDefinition}**](ShaderDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

