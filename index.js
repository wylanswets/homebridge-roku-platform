var Accessory, Service, Characteristic, UUIDGen;

const { Client, keys } = require('roku-client');

var RokuTV = require('./accessories/RokuTV');

module.exports = function(homebridge) {

    // Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory; global.Accessory = homebridge.platformAccessory;

    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service; global.Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic; global.Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    // For platform plugin to be considered as dynamic platform plugin,
    // registerPlatform(pluginName, platformName, constructor, dynamic), dynamic must be true
    homebridge.registerPlatform("homebridge-rokutv-platform", "RokuPlatform", RokuTVPlatform, true);
}

function RokuTVPlatform(log, config, api) {
    this.log = log;
    this.accessories = [];
    this.api = api;
    // this.subscribed = false;
    var self = this;
    this.config = config;


    if(config !== null) {

        var maxVolume = this.config.maxVolume ? this.config.maxVolume : 30;

        this.api.on('didFinishLaunching', function() {
            //get roku devices
            Client.discoverAll().then((clients) => {
                for(var i in clients) {
                    self.addRoku(clients[i], maxVolume);
                }
                self.pollStatus();
                // console.log("done loading");
            })

            
        });
    }
}

RokuTVPlatform.prototype.pollStatus = function() {
    var self = this;
    var interval = self.config.poll_interval ? (self.config.poll_interval * 1000) : 30000;
    setTimeout(function() {
        for(uuid in self.accessories) {
            var acc = self.accessories[uuid];
            acc.statusInterval();
        }
        self.pollStatus();
    }, interval);
}

RokuTVPlatform.prototype.addRoku = function(roku, maxVolume) {
    var self = this;
    
    roku.info().then((info) => {
        // console.log(info);
        
        var uuid = UUIDGen.generate(info.serialNumber);

        var accessory = this.accessories[uuid];

        if(accessory === undefined) {
            this.registerRokuDevice(roku, info, maxVolume);
        } else {
            this.accessories[uuid] = new RokuTV(this.log, (accessory instanceof RokuTV ? accessory.accessory : accessory), roku, info, maxVolume);
        }
    })
    
}

RokuTVPlatform.prototype.registerRokuDevice = function(roku, info, maxVolume) {

    var uuid = UUIDGen.generate(info.serialNumber);
    var name = info.friendlyDeviceName == '' ? "Roku TV" : info.friendlyDeviceName;
    var acc = new Accessory(name, uuid);
    
    // acc.addService(Service.Switch);
    // acc.addService(Service.Lightbulb);

    this.accessories[uuid] = new RokuTV(this.log, acc, roku, info, maxVolume);

    this.api.registerPlatformAccessories("homebridge-rokutv-platform", "RokuPlatform", [acc]);

}

RokuTVPlatform.prototype.configureAccessory = function(accessory) {
    this.accessories[accessory.UUID] = accessory;
}