define(["../SampleAppView.js"], function(SampleAppView) {
  class InGameView extends SampleAppView {
    constructor() {
      super();

      this._eventsLog = document.getElementById("eventsLog");
      this._infoLog = document.getElementById("infoLog");
      this._copyEventsButton = document.getElementById("copyEvents");

      this._testDemolishButton = document.getElementById("testdemolishbutton");
      this._testBlueButton = document.getElementById("testbluebutton");
      this._testOrangeButton = document.getElementById("testorangebutton");

      this._copyInfoButton = document.getElementById("copyInfo");
      this._hotkey = document.getElementById("hotkey");


      this.logEvent = this.logEvent.bind(this);
      this.logInfoUpdate = this.logInfoUpdate.bind(this);
      this.updateHotkey = this.updateHotkey.bind(this);
      this._copyEventsLog = this._copyEventsLog.bind(this);
      this._copyInfoLog = this._copyInfoLog.bind(this);

      this._onTestDemolishButtonClick = this._onTestDemolishButtonClick.bind(this);
      this._onTestBlueButtonClick = this._onTestBlueButtonClick.bind(this);
      this._onTestOrangeButtonClick = this._onTestOrangeButtonClick.bind(this);


      this._copyEventsButton.addEventListener("click", this._copyEventsLog);
      this._copyInfoButton.addEventListener("click", this._copyInfoLog);

      this._testDemolishButton.addEventListener("click", this._onTestDemolishButtonClick);
      this._testBlueButton.addEventListener("click", this._onTestBlueButtonClick);
      this._testOrangeButton.addEventListener("click", this._onTestOrangeButtonClick);
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
      fetch("http://000raspberry.ddns.net/overwolf/api?event_type=action_points&event_data=Demolish&ip=192.168.178.60&color=50%2050%2050")
      .then(response => {
        this.inGameView.logEvent("Done", true);
      });
    }

    _onTestBlueButtonClick() {
      fetch("http://000raspberry.ddns.net/overwolf/api?event_type=teamGoal&event_data=Demolish&ip=192.168.178.60&color=0 0 255")
      .then(response => {
        this.inGameView.logEvent("Done", true);
      });
    }

    _onTestOrangeButtonClick() {
      fetch("http://000raspberry.ddns.net/overwolf/api?event_type=teamGoal&event_data=Demolish&ip=192.168.178.60&color=255 100 0")
      .then(response => {
        this.inGameView.logEvent("Done", true);
      });
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
