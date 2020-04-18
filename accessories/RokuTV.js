function RokuTV(log, accessory, roku, info, maxVolume) {

    this.log = log;
    this.accessory = accessory;
    this.roku = roku;
    this.info = info;
    this.name = "";

    // this.maxVolume = maxVolume;
    // this.lastVolume = 10;

    this.setup();

    this.accessory.updateReachability(true);

}

RokuTV.prototype = Object.create(RokuTV.prototype);

RokuTV.prototype.setup = function() {
    this.accessoryInfo();
    this.setupPower();
    // this.setupVolume();
}

RokuTV.prototype.accessoryInfo = function() {
    var accessoryinfo = this.accessory.getService(global.Service.AccessoryInformation);
    accessoryinfo.setCharacteristic(global.Characteristic.Manufacturer, this.info.vendorName.toString());
    accessoryinfo.setCharacteristic(global.Characteristic.Model, this.info.modelName.toString());
    accessoryinfo.setCharacteristic(global.Characteristic.SerialNumber, this.info.serialNumber.toString());
    accessoryinfo.setCharacteristic(global.Characteristic.FirmwareRevision, this.info.softwareVersion.toString());
    accessoryinfo.setCharacteristic(global.Characteristic.Name, this.info.friendlyDeviceName.toString());
    this.name = this.info.friendlyDeviceName.toString();
    return accessoryinfo;
}

RokuTV.prototype.statusInterval = function() {
    var service = this.accessory.getService(global.Service.Switch);

    this.roku.info().then((info) => {
        var state = false;
        if(info.powerMode == 'PowerOn') {
            state = true;
        }
        // console.log("state " + state);
        service
            .getCharacteristic(Characteristic.On)
            .setValue(state, null, 'internal');

    })

    
}

RokuTV.prototype.setupPower = function() {

    var switch_ = this.accessory.getService(global.Service.Switch);

    switch_
        .getCharacteristic(Characteristic.On)
        .on('get', callback => {
            this.roku
                .info().then((info) => {
                    var state = false;
                    if(info.powerMode == 'PowerOn') {
                        state = true;
                    }
                    callback(null, state);
                })
        })
        .on('set', this.setPower.bind(this));
}

RokuTV.prototype.setPower = function(value, callback, context) {

    if(context !== 'internal') {
        
        this.roku
                .info().then((info) => {
                    var state = info.powerMode == 'PowerOn' ? true : false;

                    if(value === state) {
                        //Do nothing
                        callback(null);
                    } else {
                        //send power signal
                        this.log.debug();
                        this.roku
                            .keypress('Power')
                            .then(() => callback(null))
                            .catch(callback);
                    }

                });

    } else {
        callback(null);
    }
}

// RokuTV.prototype.setupVolume = function() {

//     var volume = this.accessory.getService(global.Service.Lightbulb);

//     if(volume === undefined) {
//         this.accessory.addService(global.Service.Lightbulb);
//         this.accessory.removeService(global.Service.Lightbulb);
//     }
    
//     volume
//         .getCharacteristic(Characteristic.On)
//         .on('get', callback => {
//             callback(null, true);
//         })
//         .on('set', this.setVolumeOn.bind(this));

//     volume
//         .getCharacteristic(Characteristic.Brightness)
//         .on('get', this.getVolume.bind(this))
//         .on('set', this.setVolume.bind(this));

// }

// RokuTV.prototype.setVolume = function(volume, callback) {
//     console.log("setting volume " + volume);

//     if(volume > this.maxVolume) {
//         volume = this.maxVolume;
//     }

//     this.lastVolume = volume;

//     this.roku.command()
//         .volumeDown(this.maxVolume)
//         .volumeUp(volume)
//         .send();

//     callback(null, this.lastVolume);
// }

// RokuTV.prototype.getVolume = function(callback) {
//     callback(this.lastVolume);
// }

// RokuTV.prototype.setVolumeOn = function(state, callback) {
//     console.log("setting state to " + state);
//     callback(null, state);
// }




module.exports = RokuTV;
