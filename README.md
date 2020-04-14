# homebridge-roku-platform

This plugin started by wanting to fully utelize the "Power State" information of a Roku TV. The other available plugins did not pull the state of the TV even though that is available. Most other states are not available but power is one you can automate reliably.

To install:

    npm install -g homebridge-roku-platform

To configure, add this to your homebridge config.json file:
    
    
    "platforms": [
        {
            "platform": "RokuPlatform",
            "poll_interval": 30
        }
    ]

### Note:
#### poll_interval (optional) 
How often to check for power status.
If poll_interval it is not defined in the config it will default to 30 seconds. Adjusting this number will lengthen or shorten the amount of time between status checks for each Roku TV.


