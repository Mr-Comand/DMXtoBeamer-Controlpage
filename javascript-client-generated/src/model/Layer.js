/*
 * Animation Control API
 * API for managing animations, shaders, and client configurations.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.67
 *
 * Do not edit the class manually.
 *
 */
import ApiClient from '../ApiClient.js';

/**
 * The Layer model module.
 * @module model/Layer
 * @version 1.0.0
 */
export default class Layer {
  /**
   * Constructs a new <code>Layer</code>.
   * @alias module:model/Layer
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>Layer</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Layer} obj Optional instance to populate.
   * @return {module:model/Layer} The populated <code>Layer</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Layer();
      if (data.hasOwnProperty('layerID'))
        obj.layerID = ApiClient.convertToType(data['layerID'], 'Number');
      if (data.hasOwnProperty('animationID'))
        obj.animationID = ApiClient.convertToType(data['animationID'], 'String');
      if (data.hasOwnProperty('parameters'))
        obj.parameters = ApiClient.convertToType(data['parameters'], {'String': Object});
      if (data.hasOwnProperty('enabled'))
        obj.enabled = ApiClient.convertToType(data['enabled'], 'Number');
      if (data.hasOwnProperty('dimmer'))
        obj.dimmer = ApiClient.convertToType(data['dimmer'], 'Number');
      if (data.hasOwnProperty('hueShift'))
        obj.hueShift = ApiClient.convertToType(data['hueShift'], 'Number');
      if (data.hasOwnProperty('rotate'))
        obj.rotate = ApiClient.convertToType(data['rotate'], 'Number');
      if (data.hasOwnProperty('pan'))
        obj.pan = ApiClient.convertToType(data['pan'], 'Number');
      if (data.hasOwnProperty('tilt'))
        obj.tilt = ApiClient.convertToType(data['tilt'], 'Number');
      if (data.hasOwnProperty('scale'))
        obj.scale = ApiClient.convertToType(data['scale'], 'Number');
      if (data.hasOwnProperty('shader'))
        obj.shader = ApiClient.convertToType(data['shader'], 'String');
      if (data.hasOwnProperty('shaderParameters'))
        obj.shaderParameters = ApiClient.convertToType(data['shaderParameters'], {'String': 'Number'});
      if (data.hasOwnProperty('textureShaders'))
        obj.textureShaders = ApiClient.convertToType(data['textureShaders'], {'String': {'String': 'Number'}});
      if (data.hasOwnProperty('textureShaderOrder'))
        obj.textureShaderOrder = ApiClient.convertToType(data['textureShaderOrder'], ['String']);
    }
    return obj;
  }
}

/**
 * @member {Number} layerID
 */
Layer.prototype.layerID = undefined;

/**
 * @member {String} animationID
 */
Layer.prototype.animationID = undefined;

/**
 * @member {Object.<String, Object>} parameters
 */
Layer.prototype.parameters = undefined;

/**
 * @member {Number} enabled
 */
Layer.prototype.enabled = undefined;

/**
 * @member {Number} dimmer
 */
Layer.prototype.dimmer = undefined;

/**
 * @member {Number} hueShift
 */
Layer.prototype.hueShift = undefined;

/**
 * @member {Number} rotate
 */
Layer.prototype.rotate = undefined;

/**
 * @member {Number} pan
 */
Layer.prototype.pan = undefined;

/**
 * @member {Number} tilt
 */
Layer.prototype.tilt = undefined;

/**
 * @member {Number} scale
 */
Layer.prototype.scale = undefined;

/**
 * @member {String} shader
 */
Layer.prototype.shader = undefined;

/**
 * @member {Object.<String, Number>} shaderParameters
 */
Layer.prototype.shaderParameters = undefined;

/**
 * @member {Object.<String, Object.<String, Number>>} textureShaders
 */
Layer.prototype.textureShaders = undefined;

/**
 * @member {Array.<String>} textureShaderOrder
 */
Layer.prototype.textureShaderOrder = undefined;

