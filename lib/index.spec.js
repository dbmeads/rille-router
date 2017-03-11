const Router = require('./index');
const {expect} = require('chai');

describe('Router', () => {

    it('should handle static routes', done => {
        Router()
            .use('/test/this/path', () => done())
            .route('/test/this/path');
    });

    it('should handle dynamic routes', done => {
        Router()
            .use('/test/*/path', request => {
                expect(request.params[0]).to.eql('this');
                done();
            })
            .route('/test/this/path');
    });

    it('should support a default handler', done => {
        Router({
            defaultHandler: request => {
                expect(request).to.exist;
                done();
            }
        }).route('/an/unknown/path');
    });
});