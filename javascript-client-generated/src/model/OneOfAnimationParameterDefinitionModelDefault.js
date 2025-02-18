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
 * The OneOfAnimationParameterDefinitionModelDefault model module.
 * @module model/OneOfAnimationParameterDefinitionModelDefault
 * @version 1.0.0
 */
export default class OneOfAnimationParameterDefinitionModelDefault {
  /**
   * Constructs a new <code>OneOfAnimationParameterDefinitionModelDefault</code>.
   * @alias module:model/OneOfAnimationParameterDefinitionModelDefault
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>OneOfAnimationParameterDefinitionModelDefault</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OneOfAnimationParameterDefinitionModelDefault} obj Optional instance to populate.
   * @return {module:model/OneOfAnimationParameterDefinitionModelDefault} The populated <code>OneOfAnimationParameterDefinitionModelDefault</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OneOfAnimationParameterDefinitionModelDefault();
    }
    return obj;
  }
}
