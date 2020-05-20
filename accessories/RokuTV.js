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

    //TODO remove switch service
    var switchCheck = this.accessory.getService(global.Service.Switch);
    if(switchCheck !== undefined) {
        this.accessory.removeService(global.Service.Switch);
    }

    //TODO add Television service
    var tvService = this.accessory.getService(global.Service.Television);
    if(tvService === undefined) {
        this.accessory.addService(global.Service.Television);
    }

    this.accessoryInfo();
    this.setupTV();

    this.setupSpeaker();

    // this.setupPower();
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
    // var service = this.accessory.getService(global.Service.Switch);

    // this.roku.info().then((info) => {
    //     var state = false;
    //     if(info.powerMode == 'PowerOn') {
    //         state = true;
    //     }
    //     // console.log("state " + state);
    //     service
    //         .getCharacteristic(Characteristic.On)
    //         .setValue(state, null, 'internal');

    // })

    
}

RokuTV.prototype.setupTV = function() {
    // this.addCharacteristic(Characteristic.Active);
    // this.addCharacteristic(Characteristic.ActiveIdentifier);
    // this.addCharacteristic(Characteristic.ConfiguredName);
    // this.addCharacteristic(Characteristic.RemoteKey);
    // this.addCharacteristic(Characteristic.SleepDiscoveryMode);

    var TV = this.accessory.getService(global.Service.Television);
    TV.getCharacteristic(global.Characteristic.Active)
        .on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));

    TV.getCharacteristic(global.Characteristic.ActiveIdentifier)
        .on('get', this.getChannel.bind(this))
        .on('set', this.setChannel.bind(this));

    TV.getCharacteristic(global.Characteristic.ConfiguredName)
        .on('get', this.getConfiguredName.bind(this))
        .on('set', this.setConfiguredName.bind(this));

    TV.getCharacteristic(global.Characteristic.RemoteKey)
        .on('set', this.setRemoteKey.bind(this));

    TV.setCharacteristic(
        Characteristic.SleepDiscoveryMode,
        Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
      );
    
}

RokuTV.prototype.setupSpeaker = function() {

    // // Required Characteristics
    // this.addCharacteristic(Characteristic.Mute);

    // // Optional Characteristics
    // this.addOptionalCharacteristic(Characteristic.Active);
    // this.addOptionalCharacteristic(Characteristic.Volume);
    // this.addOptionalCharacteristic(Characteristic.VolumeControlType);
    // this.addOptionalCharacteristic(Characteristic.VolumeSelector);

    var TVSpeaker = this.accessory.getService(global.Service.TelevisionSpeaker);

    if(TVSpeaker === undefined) {
        this.accessory.addService(global.Service.TelevisionSpeaker);
        TVSpeaker = this.accessory.getService(global.Service.TelevisionSpeaker);
    }

    TVSpeaker.getCharacteristic(global.Characteristic.Mute)
        .on('get', this.getMute.bind(this))
        .on('set', this.setMute.bind(this));

    TVSpeaker.setCharacteristic(
        Characteristic.VolumeControlType,
        Characteristic.VolumeControlType.RELATIVE
    );

    TVSpeaker.getCharacteristic(Characteristic.VolumeSelector)
        .on('set', this.setVolumeSelector.bind(this));

}

RokuTV.prototype.getPowerState = function(callback) {
    var char = global.Characteristic.Active;

    console.log("getting active");
    this.roku
    .info().then((info) => {
        var currentState = info.powerMode == 'PowerOn' ? char.ACTIVE : char.INACTIVE;
        console.log(currentState);
        callback(null, currentState);
    });
}

RokuTV.prototype.setPowerState = function(value, callback, context) {
    var char = global.Characteristic.Active;
    
    if(context !== 'internal') {
        
        this.roku
                .info().then((info) => {
                    var currentState = info.powerMode == 'PowerOn' ? char.ACTIVE : char.INACTIVE;

                    if(value === currentState) {
                        //Do nothing
                        callback(null);
                    } else {
                        console.log('Set power to: ' + value);
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

RokuTV.prototype.getChannel = function(callback) {
    // var char = global.Characteristic.ActiveIdentifier;
    console.log('getting active identifier "Channel"');
    callback(null, 0);

}

RokuTV.prototype.setChannel = function(value, callback) {
    console.log('setting active identifier "Channel": ' + value);
    callback(null);
}

RokuTV.prototype.getConfiguredName = function(callback) {
    // var char = global.Characteristic.ActiveIdentifier;
    console.log('getting configured name');
    callback(null, "test");

}

RokuTV.prototype.setConfiguredName = function(value, callback) {
    console.log('setting configured name: ' + value);
    callback(null);
}

RokuTV.prototype.setRemoteKey = function(key, callback) {
    var value = '';

    switch (key) {
        case Characteristic.RemoteKey.REWIND:
          value = 'REV';
          break;
        case Characteristic.RemoteKey.FAST_FORWARD:
          value = 'FWD';
          break;
        case Characteristic.RemoteKey.NEXT_TRACK:
          value = 'RIGHT';
          break;
        case Characteristic.RemoteKey.PREVIOUS_TRACK:
          value = 'LEFT';
          break;
        case Characteristic.RemoteKey.ARROW_UP:
          value = 'UP';
          break;
        case Characteristic.RemoteKey.ARROW_DOWN:
          value = 'DOWN';
          break;
        case Characteristic.RemoteKey.ARROW_LEFT:
          value = 'LEFT';
          break;
        case Characteristic.RemoteKey.ARROW_RIGHT:
          value = 'RIGHT';
          break;
        case Characteristic.RemoteKey.SELECT:
          value = 'SELECT';
          break;
        case Characteristic.RemoteKey.BACK:
          value = 'BACK';
          break;
        case Characteristic.RemoteKey.EXIT:
          value = 'BACK';
          break;
        case Characteristic.RemoteKey.PLAY_PAUSE:
          value = 'PLAY';
          break;
        case Characteristic.RemoteKey.INFORMATION:
          value = 'INFO';
          break;
      }

      console.log('setting remote key: ' + value);

      this.roku
                .keypress(value)
                .then(() => callback(null, key));
}

RokuTV.prototype.setMute = function(value, callback) {
    console.log("set mute: " + value);
   
    this.roku.keypress("VOLUME_MUTE")
                .then(() => callback(null, value));
}

RokuTV.prototype.getMute = function(callback) {
    console.log("getting mute: ");

    //get volume / mute status from roku?
    callback(null, 0);

}

RokuTV.prototype.setVolumeSelector = function(value, callback) {
    console.log("Setting volume value: " + value);
    var char = Characteristic.VolumeSelector;
    if(value === char.INCREMENT) {
        this.roku.keypress("VolumeUp")
                .then(() => callback(null, value));
    }
    else if (value === char.DECREMENT) {
        this.roku.keypress("VolumeDown")
                .then(() => callback(null, value));
    }
    
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
