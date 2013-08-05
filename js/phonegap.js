// Listener that will invoke the onDeviceReady() function as soon as phonegap has loaded properly

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    navigator.splashscreen.hide();
    //document.addEventListener("backbutton", onBackClickEvent, false); // Adding the back button listener    
}
