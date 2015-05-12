var noble = require('../index');
var childProcess = require('child_process');
var serviceUUIDs = ["d393a16025f4"];
//checking the state of system and scan for BLE devices
noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
        console.log('scanning...');
    } else {
        console.log('not scanning.. will rescan for : ' + serviceUUIDs);
        setTimeout(function (error) {
        }, 2000);
        function runScript(scriptPath, callback) {

            // keep track of whether callback has been invoked to prevent multiple invocations
            var invoked = false;

            var process = childProcess.fork(scriptPath);

            // listen for errors as they may prevent the exit event from firing
            process.on('error', function (err) {
                if (invoked) return;
                invoked = true;
                callback(err);
            });

            // execute the callback once the process has finished running
            process.on('exit', function (code) {
                if (invoked) return;
                invoked = true;
                var err = code === 0 ? null : new Error('exit code ' + code);
                callback(err);
            });

        }

// Now we can run a script and invoke a callback when complete, e.g.
        runScript('./connect.js', function (err) {
            if (err) throw err;
            console.log('finished running some-script.js');
        });
        noble.stopScanning();
    }
});


noble.on('discover', function (peripheral) {
    peripheral.connect(function (error) {
        //var serviceUUIDs = ["fe1a56c98efa"];
        if (serviceUUIDs == peripheral.uuid) {
            console.log('Trying to connect ...');
            console.log('connected to peripheral: ' + peripheral.uuid);
            peripheral.discoverServices(null, function (error, services) {
                console.log('Discovered the following services:');
                for (var i in services) {
                    console.log('  ' + i + ' uuid: ' + services[i].uuid);
                }
                //******************************************************************
                // ******** Getting information about 180d *********
                var deviceInformationService = services[2];
                console.log('Discovered device information service: (' + deviceInformationService + ')');

                deviceInformationService.discoverCharacteristics(null, function (error, characteristics) {
                    console.log('discovered the following characteristics:');
                    for (var i in characteristics) {
                        console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
                    }
                    //***********
                });
            });
        }
    });
});