/// <reference types="@mapeditor/tiled-api" />

const CUSTOM_ACTION_NAME = "com.marvel.tiled.co-op";
const CUSTOM_ACTION_UI_TEXT = "Tiled Co-Op";

let activeUser = null;
let hasInitializedTiledCoop = false;
const actions = {
  connected() {
    hasInitializedTiledCoop = true;
  },
  connectError(data) {
    tiled.log(JSON.stringify(data));
  },
  userDisconnected(data) {
    tiled.log(JSON.stringify(data));
  },
  newUserConnected(data) {
    userUI[data.user] = {};
    tiled.log(JSON.stringify(data));
    if (data.user !== activeUser) {
      tiled.log(`New user "${data.user}" connected!`);
    }
  },
  userLayerChanged(data) {
    tiled.log(JSON.stringify(data));
  },
};
const userUI = {};

function tiledCoopActionCallback(action) {
  if (hasInitializedTiledCoop) {
    tiled.alert(`${CUSTOM_ACTION_UI_TEXT} has already been initialized!`);
    return;
  }

  setupTiledCoopDialog();

  const objGroup = setupTiledCoopLayer(tiled.activeAsset);

  // logAsIndexedList(tiled.activeAsset);

  // tiled.mapEditor.tilesetsView.currentTileChanged.connect(() => {
  //   tiled.log("current tile changed");
  //   tiled.log(tiled.mapEditor.tilesetsView.selectedTiles[0].id);
  // });

  tiled.activeAsset.currentLayerChanged.connect(() => {
    if (!tiled.activeAsset.currentLayer) {
      return;
    }

    sendMessage("layerChanged", tiled.activeAsset.currentLayer.name);

    // tiled.log(
    //   `current layer changed to ${tiled.activeAsset.currentLayer.name}`
    // );
  });

  tiled.activeAsset.regionEdited.connect((data) => {
    tiled.log("region edited");
    tiled.log(data);
  });
}

function setupTiledCoopDialog() {
  const dialog = new Dialog("Tiled Coop");
  const usernameInput = dialog.addTextInput("Username", "some user name");
  dialog.addSeparator();
  const serverInput = dialog.addTextInput("Server", "server123");
  dialog.addNewRow();
  const passwordInput = dialog.addTextInput("Password");
  const submitInput = dialog.addButton("submit");
  submitInput.clicked.connect(() => dialog.accept());
  dialog.accepted.connect(() => {
    activeUser = usernameInput.text;
    sendMessage("connect", {
      username: usernameInput.text,
      server: serverInput.text,
      password: passwordInput.text,
      initialLayer: tiled.activeAsset.currentLayer.name,
    });
  });
  dialog.sizeGripEnabled = false;
  dialog.maximumWidth = dialog.minimumWidth;
  dialog.maximumHeight = dialog.minimumHeight;
  dialog.show();

  return dialog;
}

/**
 * @param {Asset} asset
 */
function setupTiledCoopLayer(asset) {
  const existingTiledCoopLayer = asset.layers.find((layer) =>
    layer.name.includes(CUSTOM_ACTION_UI_TEXT)
  );
  const objGroup =
    existingTiledCoopLayer ||
    new ObjectGroup(`${CUSTOM_ACTION_UI_TEXT} \*DON'T EDIT\*`);

  if (!existingTiledCoopLayer) {
    asset.addLayer(objGroup);
  }

  objGroup.setLocked(true);
  objGroup.setVisible(true);

  // logAsIndexedList(objGroup.properties());

  // logAsIndexedList(objGroup);

  asset.removeObjects(objGroup.objects);

  // objGroup.removeObjects(objGroup.objects);

  return objGroup;
}

/**
 * @param {ObjectGroup} objGroup
 */
function updateTiledCoopLayer(objGroup) {}

function logAsIndexedList(obj) {
  tiled.log(
    Object.keys(obj)
      .map((key, idx) => `[${idx}] ${key}`)
      .join("\n")
  );
}

const serverConfigurationAction = tiled.registerAction(
  CUSTOM_ACTION_NAME,
  tiledCoopActionCallback
);

serverConfigurationAction.text = CUSTOM_ACTION_UI_TEXT;

tiled.extendMenu("Map", [{ action: CUSTOM_ACTION_NAME }]);

const ioServer = new Process();

Qt.application.aboutToQuit.connect(() => {
  ioServer.close();
  tiled.log("closed io server!");
});

initialize();

function initialize() {
  setupIOServer();
  update();
}

function setupIOServer() {
  tiled.log(
    `Starting io server process from: "${FileInfo.cleanPath(
      `${__filename}/../tiled-coop-client.exe`
    )}"`
  );
  ioServer.started = ioServer.start(
    FileInfo.cleanPath(`${__filename}/../tiled-coop-client.exe`)
  );

  if (ioServer.started) {
    tiled.log("successfully started io server!");
  } else {
    tiled.log("failed to start io server!");
  }
}

function update() {
  processIOServerMessages();
  Qt.callLater(update);
}

function processIOServerMessages() {
  const messages = getIOServerMessages();
  while (messages.length > 0) {
    const message = messages.pop();

    if (actions[message.action]) {
      actions[message.action](message.payload);
    }
  }
}

function getIOServerMessages() {
  const stdout = ioServer.readStdOut();
  const messages = stdout
    .split("\n")
    .map((message) => {
      try {
        return JSON.parse(message);
      } catch (err) {
        // ignoring message, snuffing exception
      }
    })
    .filter((message) => !!message);

  return messages;
}

function updateUserUI() {}

function sendMessage(action, payload) {
  const message = {
    action,
    payload,
  };

  if (ioServer.started) {
    ioServer.writeLine(JSON.stringify(message));
  }
}
