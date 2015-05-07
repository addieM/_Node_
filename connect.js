var noble = require('../index');
//checking the state of system and scan for BLE devices
noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
        console.log('scanning...');
    } else {
        console.log('not scanning');
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {
    peripheral.connect(function (error) {
        var serviceUUIDs = ["fe1a56c98efa"];
        if (serviceUUIDs == peripheral.uuid) {
            console.log('Trying to connect ...');
            console.log('connected to peripheral: ' + peripheral.uuid);
            peripheral.discoverServices(null, function (error, services) {
                console.log('discovered the following services:');
                for (var i in services) {
                    console.log('  ' + i + ' uuid: ' + services[i].uuid);
                }
            });
        }
    });
});