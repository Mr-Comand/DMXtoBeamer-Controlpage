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

  beforeEach(function() {
    instance = new AnimationControlApi.AnimationsApi();
  });

  describe('(package)', function() {
    describe('AnimationsApi', function() {
      describe('apiAnimationGetShaderIDGet', function() {
        it('should call apiAnimationGetShaderIDGet successfully', function(done) {
          // TODO: uncomment, update parameter values for apiAnimationGetShaderIDGet call and complete the assertions
          /*

          instance.apiAnimationGetShaderIDGet(shaderID, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AnimationControlApi.AnimationDefinition);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiAnimationImageShaderIDGet', function() {
        it('should call apiAnimationImageShaderIDGet successfully', function(done) {
          // TODO: uncomment, update parameter values for apiAnimationImageShaderIDGet call
          /*

          instance.apiAnimationImageShaderIDGet(shaderID, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiAnimationListGet', function() {
        it('should call apiAnimationListGet successfully', function(done) {
          // TODO: uncomment apiAnimationListGet call and complete the assertions
          /*

          instance.apiAnimationListGet(function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            let dataCtr = data;
            expect(dataCtr).to.be.an(Object);
            expect(dataCtr).to.not.be.empty();
            for (let p in dataCtr) {
              let data = dataCtr[p];
              expect(data).to.be.a(AnimationControlApi.AnimationDefinition);
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
