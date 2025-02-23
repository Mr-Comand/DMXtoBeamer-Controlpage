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
    instance = new AnimationControlApi.ClientsApi();
  });

  describe('(package)', function() {
    describe('ClientsApi', function() {
      describe('apiClientGetClientIDGet', function() {
        it('should call apiClientGetClientIDGet successfully', function(done) {
          // TODO: uncomment, update parameter values for apiClientGetClientIDGet call and complete the assertions
          /*

          instance.apiClientGetClientIDGet(clientID, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AnimationControlApi.ClientConfig);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiClientListGet', function() {
        it('should call apiClientListGet successfully', function(done) {
          // TODO: uncomment apiClientListGet call and complete the assertions
          /*

          instance.apiClientListGet(function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AnimationControlApi.InlineResponse200);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiClientSetClientIDPost', function() {
        it('should call apiClientSetClientIDPost successfully', function(done) {
          // TODO: uncomment, update parameter values for apiClientSetClientIDPost call
          /*

          instance.apiClientSetClientIDPost(body, clientID, function(error, data, response) {
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
      describe('apiClientSetPost', function() {
        it('should call apiClientSetPost successfully', function(done) {
          // TODO: uncomment, update parameter values for apiClientSetPost call
          /*

          instance.apiClientSetPost(body, function(error, data, response) {
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
    });
  });

}));
