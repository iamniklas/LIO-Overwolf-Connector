function fail(event) {
  console.log("Error");
}

// var gameMode = "";
// var mapName = "";
// var gameState = "";
// var mi = new MatchInfo("m");

class Configuration {
  static deviceIP = "";
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
      let gameinfo = overwolf.games.getRunningGameInfo(function(){console.log(JSON.stringify(arguments))});
      console.logEvent(gameinfo);

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
        case 'match_start':
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
      this._gameEventHandler.gameID = 12345;
      
      this.inGameView.logEvent("Sending", true);
      
      var link = "http://000raspberry.ddns.net/lio/game?ip=192.168.178.60"
      
      switch(event.name) {
        case 'gep_internal':
          break;
        case 'death':
          break;
        case 'game_info':
          break;
        case 'matchStart':
          break;
        case 'match_start':
          break;
        case 'match':
          break;
        case 'match_info':
          break;
        case 'roster':
          break;
        case 'me':
          break;
        case 'matchEnd':
          break;
        case 'stats':
          break;
        case 'teamGoal':
          break;
        case 'opposingTeamGoal':
          break;
      }

      if(event.name == "action_points") {
          link += `&event_data=${event.data}`;
      }
      link += '&ip=192.168.178.60'
      if(event.name == "teamGoal" || event.name == "opposingTeamGoal") {
          var data = JSON.parse(event.data);
          var team = data.team;
          var color = "";
          switch(team) {
              case "0": color = "128 128 128";
                break;
              case "1": color = "0 0 255";
                break;
              case "2": color = "255 100 0";
                break;
              default: color = "128 128 128";
                break;
          }
          this.inGameView.logEvent(color, true);
          link += `&color=${color}`;
      }

      this.inGameView.logEvent(link, true);

      this.inGameView.logEvent(JSON.stringify(event), isHightlight);

      fetch(`http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: `ColorInstantSet:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": ${r}, \"G\": ${g}, \"B\": ${b}}, \"PU_MODULO\": 1, \"PU_MODULO_INVERT\": true}}`
        })

      fetch(link)
      .then(response => {
        this.inGameView.logEvent("Done", true);
      });
    }

    _infoUpdateHandler(infoUpdate) {
      this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
    }
  }

  return InGameController;
});
