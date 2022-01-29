// Initialize native API communication. This is non-blocking
// use 'ready' event to run code on app load.
// Avoid calling API functions before init or after init.
Neutralino.init();
Neutralino.events.on("windowClose", () => Neutralino.app.exit());

Neutralino.window.setFullScreen();
