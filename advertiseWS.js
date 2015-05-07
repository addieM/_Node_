var noble = require('../index');

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

    console.log('peripheral discovered (' + peripheral.uuid + '):');
    console.log(' Name of Bluetooth Device(' + peripheral.advertisement.localName + ')');
    console.log('Service to be Interested? :', +JSON.stringify(peripheral.advertisement.serviceUuids));
    //console.log('\t' );


    var serviceUUIDs = ["fe1a56c98efa"];
    if (serviceUUIDs == peripheral.uuid) {
        console.log('Trying to connect ...');
        peripheral.connect();

        console.log('getting Service Data');
        var serviceData = peripheral.advertisement.serviceData;

        if (serviceData == []) {
            console.log('NO service Data for: ', peripheral.advertisement.localName + ',' + peripheral.uuid);
        } else {
            console.log('service data : ', serviceData);
            console.log('Length : Size -> ', serviceData.length + serviceData.size);
            if (serviceData && serviceData.length) {
                console.log(' 3');
                console.log('\t there is my service data:');
                for (var i in serviceData) {
                    console.log(' 4');
                    console.log('\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
                }
            }
            if (peripheral.advertisement.manufacturerData) {
                console.log(' 5');
                console.log('\there is my manufacturer data:');
                console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
            }
            if (peripheral.advertisement.txPowerLevel !== undefined) {
                console.log(' 5');
                console.log('\tmy TX power level is:');
                console.log('\t\t' + peripheral.advertisement.txPowerLevel);
            }
            console.log(' 6');
        }

    }

})
/*
 noble.on('discover', function(peripheral) {
 peripheral.connect(function (err) {




 console.log('Trying to connect ...');
 var serviceUUIDs = ["fe1a56c98efa"];
 if (serviceUUIDs == peripheral.uuid){

 peripheral.connect();
 }
 /!* peripheral.discoverServices(serviceUUIDs, function (error, services) {

 console.log('found service:', services);
 console.log('logging off..');

 }); // particular UUID's*!/


 })
 })
 */