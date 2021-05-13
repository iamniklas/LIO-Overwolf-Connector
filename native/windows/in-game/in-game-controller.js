function fail(event) {
  console.log("Error");
}

define([
  '../../windows/in-game/in-game-view.js',
  '../../scripts/services/hotkeys-service.js'
], function (
  InGameView,
  HotkeysService
  ) {

  class InGameController {

    constructor() {
      this.inGameView = new InGameView();

      this._gameEventHandler = this._gameEventHandler.bind(this);
      this._infoUpdateHandler = this._infoUpdateHandler.bind(this);
      this._eventListener = this._eventListener.bind(this);
      this._updateHotkey = this._updateHotkey.bind(this);
    }

    run() {
      // listen to events from the event bus from the main window,
      // the callback will be run in the context of the current window
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.ow_eventBus.addListener(this._eventListener);

      // Update hotkey view and listen to changes:
      this._updateHotkey();
      HotkeysService.addHotkeyChangeListener(this._updateHotkey);
    }

    async _updateHotkey() {
      const hotkey = await HotkeysService.getToggleHotkey();
      this.inGameView.updateHotkey(hotkey);
    }

    _eventListener(eventName, data) {
      switch (eventName) {
        case 'event': {
          this._gameEventHandler(data);
          break;
        }
        case 'info': {
          this._infoUpdateHandler(data);
          break;
        }
      }
    }

    // Logs events
    _gameEventHandler(event) {
      let isHightlight = false;
      switch (event.name) {
        case 'gep_internal':
        case 'death':
        case 'game_info':
        case 'matchStart':
        case 'match':
        case 'match_info':
        case 'roster':
        case 'me':
        case 'matchEnd':
        case 'stats':
        case 'teamGoal':
        case 'opposingTeamGoal':
          isHightlight = true;
      }
      this.inGameView.logEvent("Sending", true);
      
      var link = `http://000raspberry.ddns.net/overwolf/api?event_type=${event.name}`
      if(event.name == "action_points") {
          link += `&event_data=${event.data}`;
      }
      fetch(link)
      .then(response => {
        this.inGameView.logEvent("Done", true);
      });

      this.inGameView.logEvent(JSON.stringify(event), isHightlight);
    }

    // Logs info updates
    _infoUpdateHandler(infoUpdate) {
      this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), false);
    }
  }


  return InGameController;
});
