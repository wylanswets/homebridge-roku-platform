function BaseAccessory(log, accessory, device, session) {
    var info = accessory.getService(global.Service.AccessoryInformation);
    
    accessory.context.manufacturer = "Roku"
    accessory.context.model = info.modelName;
    accessory.context.serial = info.serialNumber;
    accessory.context.revision = info.softwareVersion;
    accessory.context.name = info.friendlyDeviceName;

    info.setCharacteristic(global.Characteristic.Manufacturer, accessory.context.manufacturer.toString());
    
    info.setCharacteristic(global.Characteristic.Model, accessory.context.model.toString());
    
    info.setCharacteristic(global.Characteristic.SerialNumber, accessory.context.serial.toString());
    
    info.setCharacteristic(global.Characteristic.FirmwareRevision, accessory.context.revision.toString());

    info.setCharacteristic(global.Characteristic.Name, accessory.context.name.toString());
    
    this.accessory = accessory;
    this.log = log;
}
   
module.exports = BaseAccessory;
  