# homebridge-roku-platform

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


