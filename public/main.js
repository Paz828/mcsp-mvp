/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create main page on start up
const createPage = async () => {
  const delArr = document.querySelectorAll(".deletable");
  delArr.forEach((elem) => {
    elem.remove();
  });
  try {
    // Party table creation magic
    const partyResponse = await fetch(
      "https://encounter-gen.onrender.com/party",
      {
        method: "GET",
      }
    );
    const partyData = await partyResponse.json();
    partyData.forEach((elem) => {
      attachToCol(elem["char_lvl"], "#char-lvl", elem["char_id"]);
      attachToCol(elem["char_name"], "#char-name", elem["char_id"]);
      attachToCol(elem["char_class"], "#char-class", elem["char_id"]);
      attachToCol(elem["char_ancestry"], "#char-ancestry", elem["char_id"]);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Creature table creation magic
    const creaturesResponse = await fetch(
      "https://encounter-gen.onrender.com/creature",
      {
        method: "GET",
      }
    );
    const creaturesData = await creaturesResponse.json();
    creaturesData.forEach((elem) => {
      attachToCol(elem["creature_lvl"], "#creature-lvl", elem["creature_id"]);
      attachToCol(elem["creature_name"], "#creature-name", elem["creature_id"]);
      attachToCol(
        elem["creature_plane"],
        "#creature-plane",
        elem["creature_id"]
      );
      attachToCol(elem["creature_url"], "#creature-url", elem["creature_id"]);
    });
  } catch (err) {
    console.error(err);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Adding listeners to submit and switch buttons
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit button handler
const addSubmitBtnListener = async () => {
  const postForm = document.querySelector("#post-form");
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let url = form.action;

    const formData = new FormData(form);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: formDataJsonString,
    };

    try {
      switch (document.querySelector("#col-2-input").name) {
        case "char_name":
          url += "party";
          const partyResponse = await fetch(url, fetchOptions);

          if (!partyResponse.ok) {
            const errorMessage = await partyResponse.text();
            throw new Error(errorMessage);
          }
          break;

        case "creature_name":
          url += "creature";
          const creatureResponse = await fetch(url, fetchOptions);

          if (!creatureResponse.ok) {
            const errorMessage = await creatureResponse.text();
            throw new Error(errorMessage);
          }

          break;
      }
    } catch (err) {
      console.error(err);
    }
    createPage();
  });
};
///////////////////////////////////////////////////////////////////////////////////////////////
// Switch button handler
const addSwitchBtnListener = async () => {
  const switchBtn = document.querySelector("#switch");
  switchBtn.addEventListener("click", async (e) => {
    const postSwitch = document.querySelector("#col-2-input");
    switch (postSwitch.name) {
      case "char_name":
        changeUp("#col-1-input", "creature_lvl", "Level", "input");
        changeUp("#col-2-input", "creature_name", "Creature Name", "input");
        changeUp("#col-3-input", "creature_plane", "Plane", "input");
        changeUp("#col-4-input", "creature_url", "URL", "input");
        break;

      case "creature_name":
        changeUp("#col-1-input", "char_lvl", "Level", "input");
        changeUp("#col-2-input", "char_name", "Character Name", "input");
        changeUp("#col-3-input", "char_class", "Class", "input");
        changeUp("#col-4-input", "char_ancestry", "Ancestry", "input");
        break;
    }
  });
};
///////////////////////////////////////////////////////////////////////////////////////////////
// Encounter button handler
const addRngsusBtnListener = () => {
  const form = document.querySelector("#rngsus-form");
  let encounterList;
  form.addEventListener("submit", async () => {
    await createPage();
    const value = document.querySelector("#rngsus-input").value;
    const partySize = partyAvg()[1];
    switch (value) {
      case "trivial":
        encounterList = generateEncounters(partySize, 40, 10);
        break;

      case "low":
        encounterList = generateEncounters(partySize, 60, 15);
        break;

      case "moderate":
        encounterList = generateEncounters(partySize, 80, 20);
        break;

      case "severe":
        encounterList = generateEncounters(partySize, 120, 30);
        break;

      case "extreme":
        encounterList = generateEncounters(partySize, 160, 40);
        break;

      default:
        alert("Please select a threat level.");
    }
    encounterList.forEach((elem) => {
      const entryArr = document.querySelectorAll(`.${elem}`);
      attachToCol(entryArr[0].textContent, "#rngsus-lvl", undefined);
      attachToCol(entryArr[1].textContent, "#rngsus-name", undefined);
      attachToCol(entryArr[2].textContent, "#rngsus-plane", undefined);
      attachToCol(entryArr[3].textContent, "#rngsus-url", undefined);
    });
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Moving the selected entry to the edit/delete box
const moveToUsualRoom = async (id, type) => {
  const usualRmArr = document.querySelectorAll(".usual-room");
  const h2 = document.querySelector("#usual-room-title");
  const inputIdArr = [
    "#hidden-room",
    "#lvl-room",
    "#name-room",
    "#class-plane-room",
    "#ancestry-url-room",
  ];
  const labelIdArr = ["#class-plane-label", "#ancestry-url-label"];

  switch (type) {
    case "party":
      h2.innerHTML = "Character";

      const charInputValArr = [
        "char_id",
        "char_lvl",
        "char_name",
        "char_class",
        "char_ancestry",
      ];

      const charLabelValArr = ["Class:", "Ancestry:"];

      for (let i = 0; i < inputIdArr.length; i++) {
        changeUp(inputIdArr[i], charInputValArr[i], undefined, "input");
      }

      for (let i = 0; i < labelIdArr.length; i++) {
        changeUp(labelIdArr[i], undefined, charLabelValArr[i], "label");
      }
      break;

    case "creature":
      h2.innerHTML = "Creature";

      const creatureInputValArr = [
        "creature_id",
        "creature_lvl",
        "creature_name",
        "creature_plane",
        "creature_url",
      ];

      const creatureLabelValArr = ["Plane:", "URL:"];

      for (let i = 0; i < inputIdArr.length; i++) {
        changeUp(inputIdArr[i], creatureInputValArr[i], undefined, "input");
      }

      for (let i = 0; i < labelIdArr.length; i++) {
        changeUp(labelIdArr[i], undefined, creatureLabelValArr[i], "label");
      }
      break;
  }
  try {
    const response = await fetch(
      `https://encounter-gen.onrender.com/${type}/${id}`
    );
    const returnObj = await response.json();
    const keysArr = Object.keys(returnObj);
    for (let i = 0; i < usualRmArr.length; i++) {
      usualRmArr[i].value = returnObj[keysArr[i]];
    }
  } catch (err) {
    console.error(err);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Adding functionality to the delete/edit buttons
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete button handler
const addDelBtnListeners = async () => {
  const delBtn = document.querySelector("#del-btn");
  delBtn.addEventListener("click", () => {
    const indicator = document.querySelector("#indicator");
    indicator.textContent = "delete";
  });

  const theUsualRm = document.querySelector("#usual-room");
  theUsualRm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.querySelector("#hidden-room").value;
    const form = e.currentTarget;
    let url = form.action;
    try {
      switch (document.querySelector("#usual-room-title").textContent) {
        case "Character":
          url += `party/${id}`;
          break;

        case "Creature":
          url += `creature/${id}`;
          break;
      }
      let indicated = document.querySelector("#indicator");
      if (indicated.textContent === "delete") {
        const response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        createPage();
      }
    } catch (err) {
      console.error(err);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Edit button handler
const addEditBtnListeners = async () => {
  const editBtn = document.querySelector("#edit-btn");
  editBtn.addEventListener("click", () => {
    const indicator = document.querySelector("#indicator");
    indicator.textContent = "edit";
  });

  const theUsualRm = document.querySelector("#usual-room");
  theUsualRm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.querySelector("#hidden-room").value;
    const form = e.currentTarget;
    let url = form.action;

    try {
      switch (document.querySelector("#usual-room-title").textContent) {
        case "Character":
          url += `party/${id}`;
          break;

        case "Creature":
          url += `creature/${id}`;
          break;
      }
      let indicated = document.querySelector("#indicator");
      if (indicated.textContent === "edit") {
        const formData = new FormData(form);
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);

        const fetchOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: formDataJsonString,
        };
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        alert(`Character Updated`);
        createPage();
      }
    } catch (err) {
      console.error(err);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that attaches things to the table
const attachToCol = (val, locStr, id) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");

  let type;
  if (/char/.test(locStr)) {
    type = "party";
    div.classList.add(`party-entry${id}`);
  } else if (/creature/.test(locStr)) {
    type = "creature";
    div.classList.add(`creature-entry${id}`);
  }

  if (/url/.test(locStr)) {
    const a = document.createElement("a");
    a.href = val;
    a.textContent = "See Page";
    div.appendChild(a);
  } else {
    div.textContent = val;
    if (id) {
      div.addEventListener("click", () => {
        moveToUsualRoom(id, type);
      });
    }
  }
  div.classList.add("deletable");
  loc.appendChild(div);
};
// Function that changes the names and values of whatever I pass
const changeUp = (locStr, newName, val, type) => {
  const loc = document.querySelector(locStr);
  switch (type) {
    case "input":
      loc.name = newName;
      loc.value = val;
      break;

    case "label":
      loc.textContent = val;
      break;
  }
};
// Function that averages the party level
const partyAvg = () => {
  const charLvlCol = document.querySelector("#char-lvl").childNodes;
  let runningTotal = 0;
  let rowNum = charLvlCol.length - 1;
  let avg;
  charLvlCol.forEach((elem) => {
    if (Object.is(elem.textContent * 1, NaN)) {
      return;
    } else {
      runningTotal += parseInt(elem.textContent);
    }
  });
  avg = Math.floor(runningTotal / rowNum);
  return [avg, rowNum];
};
// Function that makes an object of arrays of the monsters
const levelOrganizer = () => {
  const avg = partyAvg()[0];
  const creatureLvlCol = document.querySelector("#creature-lvl").childNodes;
  let creatureObj = {
    lowLackey: [10, []],
    lowModLackey: [15, []],
    lackeyCreature: [20, []],
    stanCreature: [30, []],
    creatureLowBoss: [40, []],
    lowModBoss: [60, []],
    modSevBoss: [80, []],
    sevExBoss: [120, []],
    exBoss: [160, []],
    outtaRange: [],
  };
  creatureLvlCol.forEach((elem) => {
    if (Object.is(elem.textContent * 1, NaN)) {
      return;
    } else {
      switch (parseInt(elem.textContent)) {
        case avg - 4:
          creatureObj.lowLackey[1].push(elem.classList[0]);
          break;

        case avg - 3:
          creatureObj.lowModLackey[1].push(elem.classList[0]);
          break;

        case avg - 2:
          creatureObj.lackeyCreature[1].push(elem.classList[0]);

          break;

        case avg - 1:
          creatureObj.stanCreature[1].push(elem.classList[0]);

          break;

        case avg:
          creatureObj.creatureLowBoss[1].push(elem.classList[0]);

          break;

        case avg + 1:
          creatureObj.lowModBoss[1].push(elem.classList[0]);
          break;

        case avg + 2:
          creatureObj.modSevBoss[1].push(elem.classList[0]);
          break;

        case avg + 3:
          creatureObj.sevExBoss[1].push(elem.classList[0]);
          break;

        case avg + 4:
          creatureObj.exBoss[1].push(elem.classList[0]);
          break;

        default:
          creatureObj.outtaRange.push(elem.classList[0]);
      }
    }
  });
  return creatureObj;
};
//Function that generates the random encounters
const generateEncounters = (party, bdgt, adj) => {
  const creatureObj = levelOrganizer();
  let budget;
  let encounter = [];
  if (party < 4) {
    budget = bdgt - (4 - party) * adj;
  } else if (party > 4) {
    budget = bdgt + (party - 4) * adj;
  } else {
    budget = bdgt;
  }

  const creatureKeysArr = Object.keys(creatureObj);
  while (budget > 5) {
    const randomKey = Math.floor(Math.random() * (creatureKeysArr.length - 1));
    const tempKey = creatureObj[creatureKeysArr[randomKey]];
    if (budget < tempKey[0] || tempKey[1].length === 0) {
      continue;
    } else {
      const randomCreature = Math.floor(Math.random() * tempKey[1].length);
      const tempVal = tempKey[1][randomCreature];
      encounter.push(tempVal);
      budget -= tempKey[0];
    }
  }
  return encounter;
};

createPage();
addSubmitBtnListener();
addDelBtnListeners();
addEditBtnListeners();
addSwitchBtnListener();
addRngsusBtnListener();
/////////////////////////////////////////////////////////////////////////////////////////////////////
// CSS mumbo jumbo
/////////////////////////////////////////////////////////////////////////////////////////////////////
