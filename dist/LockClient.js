"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by VinceZK on 5/1/17.
 */
var net = require('net');

var lockUUID = 1;
var isNodeJS = new Function("try {return this===global;}catch(e){return false;}");
var isNode = isNodeJS();
var host = "127.0.0.1";
var port = "3721";

function setEnqueueServerConnection(host_, port_) {
    host = host_;
    port = port_;
}
function lock(elementaryLock, callback) {
    var copyElementaryLock = Object.assign({}, elementaryLock);
    copyElementaryLock['uuid'] = _getLockUUID();
    var req = { OP: '1', eleLock: copyElementaryLock };
    _requestEnqueueServer(req, function (err, res) {
        if (err) return callback(copyElementaryLock.uuid, '3', err);
        switch (res.RC) {
            case '0':
                callback(copyElementaryLock.uuid, res.RC);
                break;
            case '1':
                callback(copyElementaryLock.uuid, res.RC, res.OWNER);
                break;
            case '4':
                callback(copyElementaryLock.uuid, res.RC, res.MSG);
                break;
            default:
        }
    });
}

function unlock(lockUUID, callback) {
    var req = { OP: '2', lockUUID: lockUUID };
    _requestEnqueueServer(req, function (err, res) {
        if (err) return callback('3', err);
        callback(res.RC, res.MSG);
    });
}

function promote(lockUUID, callback) {
    var req = { OP: '3', lockUUID: lockUUID };
    _requestEnqueueServer(req, function (err, res) {
        if (err) return callback('3', err);
        callback(res.RC, res.MSG);
    });
}

function getLocksBy(lockName, lockOwner, callback) {
    var req = { OP: '4', lockName: lockName, lockOwner: lockOwner };
    var client = net.createConnection(port, host, function () {
        client.write(JSON.stringify(req));
        var totalRes = Buffer.alloc(0);
        var currentLength = 0;
        var totalLength = 0;
        client.on('data', function (res) {
            var partLength = res.length;
            var partBuffer = res;
            if (totalLength === 0) {
                totalLength = res.readUInt32LE(0);
                partLength = partLength - 4;
                partBuffer = Buffer.alloc(partLength);
                res.copy(partBuffer, 0, 4);
            }
            currentLength = totalRes.length + partLength;
            totalRes = Buffer.concat([totalRes, partBuffer], currentLength);
            if (currentLength === totalLength) {
                client.end();
                callback('0', JSON.parse(totalRes));
            }
        });
    });

    client.on('error', function (err) {
        callback('3', err);
    });
}

function _requestEnqueueServer(req, callback) {
    var client = net.createConnection(port, host, function () {
        client.write(JSON.stringify(req));
        client.on('data', function (res) {
            client.end();
            callback(null, JSON.parse(res));
        });
    });

    client.on('error', function (err) {
        callback(err);
    });
}

function _getLockUUID() {
    if (isNode) return process.pid + '_' + lockUUID++;else return _generateUUID();
}

var lut = [];for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
function _generateUUID() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

exports.lock = lock;
exports.unlock = unlock;
exports.promote = promote;
exports.getLocksBy = getLocksBy;
exports.setEnqueueServerConnection = setEnqueueServerConnection;