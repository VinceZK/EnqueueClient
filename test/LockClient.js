/**
 * Created by VinceZK on 5/1/17.
 */
var Lock = require('../index.js');
var lock = new Lock(3721, '127.0.0.1');

describe('Lock Unit Tests', function(){
    it('should acquire the lock of the object',function(){
        lock.acquire(obj, opt, function(fail, callback){
            if (fail) {
                // lock failed
                callback(fail);
                return;
            }
            // do whatever you want with your shared resource

            callback(undefined, {well: "done"});
        });
    });

    it('should release the lock of the object',function(){
        lock.release(obj, function(fail, callback){
            if (fail) {
                // lock failed
                callback(fail);
                return;
            }

            // do whatever you want with your shared resource

            callback(undefined, {well: "done"});
        })
    });
});