# enqueue-client
Javascript client of [enqueue server](https://www.npmjs.com/package/enqueue-server)

## lockClient.lock(elementaryLock, callback)
Acquire a lock for the elementaryLock. The _callback_ will be called once the result is received. 

```javascript    
var elementaryLock = {"name":"product","argument":["Computer"],"mode":"E","owner":"B"};
lockClient.lock(elementaryLock, function(lockUUID,RC,MSG){
   //lockUUID is a unique id for the acquired lock, you must record it so that you can unlock it afterward;
   //RC stands for the return code. 0:Success, 1:Fail, 3:Error in client, 4:Error in server;
   //MSG returns the detail error message if RC is 3 or 4, and the lock owner if RC is 1;      
});
```

## lockClient.unlock(lockUUID [,callback])
Release the lock with the specified lock UUID. The _callback_ is optional. 

```javascript
lockClient.unlock(lockUUID, function(RC,MSG){
   //RC: 0:Success, 4:Error in server;
   //MSG returns the detail error message if RC is 4;      
});
```
    
## lockClient.promote(lockUUID, callback)
Promote the optimistic lock with the specified lock UUID. The _callback_ receives the response from server. 

```javascript
lockClient.promote(lockUUID, function(RC,MSG){
   //RC: 0:Success, 2:Fail, 3:Error in client, 4:Error in server;
   //MSG returns the detail error message if RC is 3 or 4, and the existing lock owner if RC is 2;      
});
```
 
## lockClient.getLocksBy(lockName, lockOwner, callback)
Get a list of existing locks in the enqueue server by lockName and lockOwner. 
The callback receives an array of locks. 
If you give both lockName and lockOwner, it filters with both. 
If you only give either lockName or lockOwner, it filters with one of the given.
If you assign null for both, it return the complete lock list. 

```javascript
lockClient.getLocksBy(null, null, function(RC,locks){
   //RC: 0:Success, 3:Error in client;
   //locks is an array contains the locks if RC is 0 , and an error message if RC is 2;      
});
```
    
## lockClient.setEnqueueServerConnection(host, port)
Set the remote enqueue server's host and port. 
The method is optional if the enqueue server lies on the same server as the lock client. 
As the default host and port are "127.0.0.1" and "3721".
