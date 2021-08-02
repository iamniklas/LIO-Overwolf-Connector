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

    runDemolishProcedure() {
      fetch(`http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "Blink:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 255, \"G\": 0, \"B\": 0}, \"DURATION\": 75, \"MODULO\": 7}}"
        })
    }

    runTeamBlueGoalProcedure() {
      fetch(`http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "FadeInFadeOut:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 0, \"G\": 0, \"B\": 255}}}"
        })
    }

    runTeamOrangeGoalProcedure() {
      fetch(`http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "FadeInFadeOut:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 255, \"G\": 100, \"B\": 0}}}"
        })
    }

    runSaveProcedure() {
      var ip = `http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`;
      fetch(ip,
        {
          method: 'POST',
          body: "Fill:{\"mBundle\":{\"SPEED\": 5, \"COLOR_PRIMARY\": {\"R\": 255, \"G\": 255, \"B\": 255}, \"PU_MODULO\": 2, \"PU_MODULO_INVERT\": true, \"IS_SUB_PROCEDURE\": false, \"DIRECTION\": 2}}"
        })
        .then(
          setTimeout(function(){
              fetch(ip,
              {
                method: 'POST',
                body: "FadeToMultiColor:{\"mBundle\":{\"COLOR_PRIMARY\":{\"R\":0,\"G\":0,\"B\":0}, \"DURATION\": 0.25, \"PU_MODULO\": 1, \"PU_MODULO_INVERT\": true}}"
              })
            }, 1500)
        );
    }

    runEpicSaveProcedure() {
      var ip = `http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`;
      fetch(ip,
        {
          method: 'POST',
          body: "Fill:{\"mBundle\":{\"SPEED\": 10, \"COLOR_PRIMARY\": {\"R\": 128, \"G\": 128, \"B\": 128}, \"PU_MODULO\": 1, \"PU_MODULO_INVERT\": true, \"IS_SUB_PROCEDURE\": false, \"DIRECTION\": 3}}"
        })
        .then(
          setTimeout(function(){
              fetch(ip,
              {
                method: 'POST',
                body: "FadeToMultiColor:{\"mBundle\":{\"COLOR_PRIMARY\":{\"R\":0,\"G\":0,\"B\":0}, \"DURATION\": 0.25, \"PU_MODULO\": 1, \"PU_MODULO_INVERT\": true}}"
              })
            }, 1500)
        );
    }

    runCountdownProcedure() {
      var ip = `http://000raspberry.ddns.net/lio/game?ip=${deviceIP}`;
      var repetitions = 4;
      for(var i=0; i < repetitions; i++) {
        setTimeout(function() {
          fetch(ip,
            {
              method: 'POST',
              body: "Blink:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 128, \"G\": 128, \"B\": 128}, \"DURATION\": 2, \"MODULO\": 1}}"
            }
          );
        }, 1000 * i);
      }
    }

    // Logs events
    _gameEventHandler(event) {
      //Show game event in console, 
      //additional info if event name is action_points
      this.inGameView.logEvent(event.name, true);
      if(event.name === "action_points") {
        this.inGameView.logEvent(event.data, true);
      }
      this.inGameView.logEvent("Sending", false);

      switch(event.name) {
        case 'gep_internal':
          break;
        case 'death':
          //Event triggered if own car gets destroyed
          this.runDemolishProcedure();
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
          this.runEpicSaveProcedure();
          break;
        case 'stats':
          break;
          //Goal events
        case 'teamGoal':
        case 'opposingTeamGoal':
          var dataObj = JSON.parse(event.data);
          this.inGameView.logEvent(dataObj.team, true);
          if(dataObj.team === "1") {
            this.runTeamBlueGoalProcedure();
          }
          if(dataObj.team === "2") {
            this.runTeamOrangeGoalProcedure();
          }
          break;
        case 'action_points':
          switch(event.data) {
            case "Shot On Goal":
              break;
            case "Goal":
              break;
            case "First Touch":
              break;
            case "Center Ball":
              break;
            case "Pool Shot":
              break;
            case "Assist":
              break;
            case "Clear Goal":
              break;
            case "Demolish":
              this.runDemolishProcedure();
              break;
              //Both events called if player gets points for saving the ball
            case "Save":
              this.runSaveProcedure();
              break;
            case "Epic Save":
              this.runEpicSaveProcedure();
              break;
          }
          break;
      }
    }

    _infoUpdateHandler(infoUpdate) {
      this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);

      if(JSON.stringify(infoUpdate).includes("Countdown")) {
        this.runCountdownProcedure();
      }
    }
  }

  return InGameController;
});
