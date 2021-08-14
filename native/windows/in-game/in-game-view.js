define(["../SampleAppView.js"], function(SampleAppView) {
  class InGameView extends SampleAppView {
    static deviceIP = "192.168.178.60";
    static apiAdress = "http://000raspberry.ddns.net";

    constructor() {
      super();

      this._eventsLog = document.getElementById("eventsLog");
      this._infoLog = document.getElementById("infoLog");
      this._copyEventsButton = document.getElementById("copyEvents");

      this._testDemolishButton = document.getElementById("testdemolishbutton");
      this._testBlueButton = document.getElementById("testbluebutton");
      this._testOrangeButton = document.getElementById("testorangebutton");
      this._testSaveButton = document.getElementById("testsavebutton");
      this._testEpicSaveButton = document.getElementById("testepicsavebutton");

      this._copyInfoButton = document.getElementById("copyInfo");
      this._hotkey = document.getElementById("hotkey");


      /***********************************************************************/
      this.logEvent = this.logEvent.bind(this);
      this.logInfoUpdate = this.logInfoUpdate.bind(this);
      this.updateHotkey = this.updateHotkey.bind(this);
      this._copyEventsLog = this._copyEventsLog.bind(this);
      this._copyInfoLog = this._copyInfoLog.bind(this);

      this._onTestDemolishButtonClick = this._onTestDemolishButtonClick.bind(this);
      this._onTestBlueButtonClick = this._onTestBlueButtonClick.bind(this);
      this._onTestOrangeButtonClick = this._onTestOrangeButtonClick.bind(this);
      this._onTestSaveButtonClick = this._onTestSaveButtonClick.bind(this);
      this._onTestEpicSaveButtonClick = this._onTestEpicSaveButtonClick.bind(this);
      

      this._copyEventsButton.addEventListener("click", this._copyEventsLog);
      this._copyInfoButton.addEventListener("click", this._copyInfoLog);

      this._testDemolishButton.addEventListener("click", this._onTestDemolishButtonClick);
      this._testBlueButton.addEventListener("click", this._onTestBlueButtonClick);
      this._testOrangeButton.addEventListener("click", this._onTestOrangeButtonClick);
      this._testSaveButton.addEventListener("click", this._onTestSaveButtonClick);
      this._testEpicSaveButton.addEventListener("click", this._onTestEpicSaveButtonClick);
    }

    // -- Public --

    // Add a line to the events log
    logEvent(string, isHighlight) {
      this._logLine(this._eventsLog, string, isHighlight);
    }
    // Add a line to the info updates log
    logInfoUpdate(string, isHighlight) {
      this._logLine(this._infoLog, string, isHighlight);
    }

    // Update hotkey header
    updateHotkey(hotkey) {
      this._hotkey.textContent = hotkey;
    }

    // -- Private --

    _copyEventsLog() {
      this._copyLog(this._eventsLog);
    }

    _copyInfoLog() {
      this._copyLog(this._infoLog);
    }

    _onTestDemolishButtonClick() {
      fetch(`${apiAdress}/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "Blink:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 255, \"G\": 0, \"B\": 0}, \"DURATION\": 75, \"MODULO\": 7}}"
        })
    }

    _onTestBlueButtonClick() {
      fetch(`${apiAdress}/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "FadeInFadeOut:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 0, \"G\": 0, \"B\": 255}}}"
        })
    }

    _onTestOrangeButtonClick() {
      fetch(`${apiAdress}/lio/game?ip=${deviceIP}`,
        {
          method: 'POST',
          body: "FadeInFadeOut:{\"mBundle\":{\"COLOR_PRIMARY\": {\"R\": 255, \"G\": 100, \"B\": 0}}}"
        })
    }

    _onTestSaveButtonClick() {
      var ip = `${apiAdress}/lio/game?ip=${deviceIP}`;
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

    _onTestEpicSaveButtonClick() {
      var ip = `${apiAdress}/lio/game?ip=${deviceIP}`;
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

    // Copy text from log
    _copyLog(log) {
      // Get text from all span children
      const nodes = log.childNodes;
      let text = "";
      for (let node of nodes) {
        if (node.tagName === "PRE") {
          text += node.innerText + "\n";
        }
      }

      // Create temporary textarea to copy to clipboard from
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    // Add a line to a log
    _logLine(log, string, isHighlight) {
      const line = document.createElement("pre");
      // Check if scroll is near bottom
      const autoScrollOn =
        log.scrollTop + log.offsetHeight > log.scrollHeight - 10;

      if (isHighlight) {
        line.className = "highlight";
      }

      line.textContent = string;

      log.appendChild(line);

      if (autoScrollOn) {
        log.scrollTop = log.scrollHeight;
      }
    }
  }

  return InGameView;
});
