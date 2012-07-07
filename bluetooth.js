/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
 /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

window.addEventListener('DOMContentLoaded', function bluetoothSettings(evt) {
	var gBluetoothManager = navigator.mozBluetooth;
	var gBluetoothAdapter = null;
  var gBluetoothPowerStatus = document.querySelector('#bluetooth-enabled');
	var gBluetoothDiscoverable = document.querySelector('#bluetooth-discoverable');
	var gBluetoothAdapterInfo = document.querySelector('#bluetooth-adapter-info');

	function getAdapter() {
    var req2 = gBluetoothManager.getDefaultAdapter();
    req2.onsuccess = function() {
      gBluetoothAdapter = req2.result;
      if(gBluetoothAdapter == null) {
        gBluetoothPowerStatus.textContent = 'No Adapter Available';
        return;
      }
      var adapterInfo = "";
      for (var key in gBluetoothAdapter) {
        if ( typeof gBluetoothAdapter[key] !== "function" ) {					
          adapterInfo += key + ": " + gBluetoothAdapter[key] + "\n";
        }
      }
			gBluetoothDiscoverable.checked = gBluetoothAdapter.discoverable;
			gBluetoothAdapterInfo.value = adapterInfo;
      var devices = gBluetoothAdapter.devices;
      for(var i = 0; i < devices.length; ++i) {
        console.log(devices[i] + "\n");
      }
      gBluetoothAdapter.ondeviceconnected = function ondeviceconnected(evt) {
        console.log("Device connected: " + evt.device.name + "\n");
      };
      gBluetoothAdapter.ondevicecreated = function ondevicecreated(evt) {
        console.log("Device created: " + evt + "\n");
      };

      gBluetoothAdapter.ondevicedisconnected = function ondevicedisconnected(evt) {
        console.log("Device disconnected: " + evt.deviceAddress + "\n");
        gConnectedDevice = null;
        clearList(gConnectedDeviceList);
      };

      gBluetoothAdapter.onpropertychanged = function onpropertychanged(evt) {
        console.log("Get onpropertychanged\n");
        var propertyName = evt.property;
				var propertyInfo = "";
				var z = 0;
        for (var key in gBluetoothAdapter) {
          if ( typeof gBluetoothAdapter[key] !== "function" ) {					
            propertyInfo += key + ": " + gBluetoothAdapter[key] + "\n";
          }
        }
				gBluetoothAdapterInfo.value = propertyInfo;
      };

      gBluetoothAdapter.ondevicefound = function ondevicefound(evt) {
        var i;
        var len = gDiscoveredDevices.length;

        for (i = 0;i < len;++i) {
          if (gDiscoveredDevices[i].address == evt.device.address) {
            break;
          }
        }

        if (i == len) {
          if (evt.device.name != "") {
            gDeviceList.appendChild(newScanItem(i, evt.device.name));
            gDiscoveredDevices[i] = evt.device;
          }
        }
      };
    };

    req2.onerror = function() {
      console.log("ADAPTER GET ERROR");
      console.log(req2.error.name);
    };
  }
	
	function changeDiscoverable() {
    var req = gBluetoothAdapter.setDiscoverable(this.checked);

    req.onsuccess = function bt_discoverableSuccess() {
      if (gBluetoothManager.enabled) {
				console.log("Discoverable!");
      } else {
				console.log("Not Discoverable!");
      }
    };
	}
	
	function changeBT() {
    var req = gBluetoothManager.setEnabled(this.checked);

    req.onsuccess = function bt_enabledSuccess() {
      if (gBluetoothManager.enabled) {
				console.log("Enabled!");
				getAdapter();
      } else {
				console.log("Disabled!");
				gBluetoothAdapter = null;
      }
    };
  };
	
	gBluetoothPowerStatus.checked = gBluetoothManager.enabled;
	if(gBluetoothManager.enabled) {
		getAdapter();
	}
	gBluetoothPowerStatus.onchange = changeBT;
	gBluetoothDiscoverable.onchange = changeDiscoverable;
});