# AnimationControlApi.AnimationsApi

All URIs are relative to *http://127.0.0.1:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiAnimationGetShaderIDGet**](AnimationsApi.md#apiAnimationGetShaderIDGet) | **GET** /api/animation/get/{shaderID} | Get details of a specific animation
[**apiAnimationImageShaderIDGet**](AnimationsApi.md#apiAnimationImageShaderIDGet) | **GET** /api/animation/image/{shaderID} | Get the image associated with an animation
[**apiAnimationListGet**](AnimationsApi.md#apiAnimationListGet) | **GET** /api/animation/list | List all available animations

<a name="apiAnimationGetShaderIDGet"></a>
# **apiAnimationGetShaderIDGet**
> AnimationDefinition apiAnimationGetShaderIDGet(shaderID)

Get details of a specific animation

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.AnimationsApi();
let shaderID = "shaderID_example"; // String | ID of the animation to retrieve

apiInstance.apiAnimationGetShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the animation to retrieve | 

### Return type

[**AnimationDefinition**](AnimationDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="apiAnimationImageShaderIDGet"></a>
# **apiAnimationImageShaderIDGet**
> apiAnimationImageShaderIDGet(shaderID)

Get the image associated with an animation

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.AnimationsApi();
let shaderID = "shaderID_example"; // String | ID of the animation

apiInstance.apiAnimationImageShaderIDGet(shaderID, (error, data, response) => {
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
 **shaderID** | **String**| ID of the animation | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiAnimationListGet"></a>
# **apiAnimationListGet**
> {&#x27;String&#x27;: AnimationDefinition} apiAnimationListGet()

List all available animations

### Example
```javascript
import {AnimationControlApi} from 'animation_control_api';

let apiInstance = new AnimationControlApi.AnimationsApi();
apiInstance.apiAnimationListGet((error, data, response) => {
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

[**{&#x27;String&#x27;: AnimationDefinition}**](AnimationDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

