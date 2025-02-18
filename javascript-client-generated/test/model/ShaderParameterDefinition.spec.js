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
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.AnimationControlApi);
  }
}(this, function(expect, AnimationControlApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('ShaderParameterDefinition', function() {
      beforeEach(function() {
        instance = new AnimationControlApi.ShaderParameterDefinition();
      });

      it('should create an instance of ShaderParameterDefinition', function() {
        // TODO: update the code to test ShaderParameterDefinition
        expect(instance).to.be.a(AnimationControlApi.ShaderParameterDefinition);
      });

      it('should have the property min (base name: "min")', function() {
        // TODO: update the code to test the property min
        expect(instance).to.have.property('min');
        // expect(instance.min).to.be(expectedValueLiteral);
      });

      it('should have the property max (base name: "max")', function() {
        // TODO: update the code to test the property max
        expect(instance).to.have.property('max');
        // expect(instance.max).to.be(expectedValueLiteral);
      });

      it('should have the property stepSize (base name: "stepSize")', function() {
        // TODO: update the code to test the property stepSize
        expect(instance).to.have.property('stepSize');
        // expect(instance.stepSize).to.be(expectedValueLiteral);
      });

      it('should have the property _default (base name: "default")', function() {
        // TODO: update the code to test the property _default
        expect(instance).to.have.property('_default');
        // expect(instance._default).to.be(expectedValueLiteral);
      });

      it('should have the property description (base name: "description")', function() {
        // TODO: update the code to test the property description
        expect(instance).to.have.property('description');
        // expect(instance.description).to.be(expectedValueLiteral);
      });

    });
  });

}));
