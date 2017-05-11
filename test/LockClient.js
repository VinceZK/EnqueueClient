/**
 * Created by VinceZK on 5/1/17.
 */
var lockClient = require('../index.js');

describe('Lock Unit Tests', function(){
    it('should get all locks',function(done){
        lockClient.getLocksBy(null, null, function(RC, locks){
            RC.should.eql('0');
            console.log(locks.length);
            console.log(locks);
            done();
        })
    });
});