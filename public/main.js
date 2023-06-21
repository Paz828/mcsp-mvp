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
    const partyArr = makeColInfo(partyData);
    makeRow(partyArr[0], "#party-table-body", partyArr[1]);
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Creature table creation magic
    const creaturesResponse = await fetch(
      "https://encounter-gen.onrender.com/creature",
      {
        method: "GET",
      }
    );
    const creaturesData = await creaturesResponse.json();
    const creatureArr = makeColInfo(creaturesData);
    makeRow(creatureArr[0], "#creature-table-body", creatureArr[1]);
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
        changeUp("#switch-h1", undefined, "Creature", "label");
        changeUp("#switch", undefined, "Switch to Character", "label");
        break;

      case "creature_name":
        changeUp("#col-1-input", "char_lvl", "Level", "input");
        changeUp("#col-2-input", "char_name", "Character Name", "input");
        changeUp("#col-3-input", "char_class", "Class", "input");
        changeUp("#col-4-input", "char_ancestry", "Ancestry", "input");
        changeUp("#switch-h1", undefined, "Character", "label");
        changeUp("#switch", undefined, "Switch to Creature", "label");
        break;
    }
  });
};
///////////////////////////////////////////////////////////////////////////////////////////////
// Encounter button handler
const addRngsusBtnListener = () => {
  const rngBtn = document.querySelector("#rngsus-btn");
  let encounterList;
  rngBtn.addEventListener("click", () => {
    const rngsusTable = document.querySelector("#rngsus-table-body");
    const value = document.querySelector("#rngsus-input").value;
    const partySize = partyAvg()[1];

    rngsusTable.innerHTML = `
      <tr>
        <td id="rngsus-lvl" class="tilt">Lvl</td>
        <td id="rngsus-name" class="tilt">Name</td>
        <td id="rngsus-plane" class="tilt">Plane</td>
        <td id="rngsus-url" class="tilt">URL</td>
      </tr>`;

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
    let inputArr = [];
    let a;
    encounterList.forEach((elem) => {
      let tempArr = [];
      const rowList = document.querySelector(`.${elem}`).childNodes;
      rowList.forEach((elem) => {
        if (elem.textContent === "See Page") {
          a = elem.firstChild.href;
          tempArr.push(a);
        } else {
          tempArr.push(elem.textContent);
        }
      });
      inputArr.push(tempArr);
    });
    makeRow(inputArr, "#rngsus-table-body");
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
//Function that makes a new row and passes the arguments to it
const makeRow = (colArr, locStr, idArr) => {
  const check = colArr[0][3];
  const loc = document.querySelector(locStr);
  let id = 0;
  let i = 0;
  colArr.forEach((elem) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    let type;

    if (idArr) {
      id = idArr[i];
    }

    td1.innerHTML = elem[0];
    td2.innerHTML = elem[1];
    td3.innerHTML = elem[2];
    if (idArr && /https/.test(elem[3])) {
      tr.classList.add(`creature-entry${id}`);
    }

    if (/https/.test(elem[3])) {
      const a = document.createElement("a");
      a.href = elem[3];
      a.textContent = "See Page";
      td4.appendChild(a);
      type = "creature";
    } else {
      td4.innerHTML = elem[3];
      tr.classList.add(`party-entry${id}`);
      type = "party";
    }
    if (idArr) {
      tr.addEventListener("click", (e) => {
        const classList = e.target.parentNode.classList;
        let usualId = classList[0].slice(classList[0].length - 2);
        if (Object.is(parseInt(usualId), NaN)) {
          usualId = parseInt(usualId.split("").reverse().join(""));
        }
        moveToUsualRoom(usualId, type);
      });
    }
    tr.append(td1, td2, td3, td4);

    if (/https/.test(check)) {
    } else {
    }
    if (Math.floor(Math.random() * 10) % 2 === 0) {
      tr.classList.add("tilt");
    }
    tr.classList.add("deletable");
    loc.appendChild(tr);
    i++;
  });
};

// Function that attaches things to the table
const makeColInfo = (arrOfObj) => {
  let ArrOfArr = [];
  let idArr = [];
  arrOfObj.forEach((elem) => {
    let tempArr = [];
    let check;
    if (elem["char_name"]) {
      check = "party";
    } else {
      check = "creature";
    }
    switch (check) {
      case "party":
        tempArr.push(elem["char_lvl"]);
        tempArr.push(elem["char_name"]);
        tempArr.push(elem["char_class"]);
        tempArr.push(elem["char_ancestry"]);
        idArr.push(elem["char_id"]);
        break;

      case "creature":
        tempArr.push(elem["creature_lvl"]);
        tempArr.push(elem["creature_name"]);
        tempArr.push(elem["creature_plane"]);
        tempArr.push(elem["creature_url"]);
        idArr.push(elem["creature_id"]);
        break;
    }
    ArrOfArr.push(tempArr);
  });
  let outputArr = [ArrOfArr, idArr];
  return outputArr;
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
  const charLvlCol = document.querySelector("#party-table-body").childNodes;
  let runningTotal = 0;
  let rowNum = charLvlCol.length - 3;
  let avg;
  charLvlCol.forEach((elem) => {
    const firstTwoDig = parseInt(elem.textContent.slice(0, 2));

    if (Object.is(firstTwoDig, NaN)) {
      return;
    } else {
      runningTotal += firstTwoDig;
    }
  });
  avg = Math.floor(runningTotal / rowNum);
  return [avg, rowNum];
};
// Function that makes an object of arrays of the monsters
const levelOrganizer = () => {
  const avg = partyAvg()[0];
  const creatureLvlCol = document.querySelector(
    "#creature-table-body"
  ).childNodes;
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
    const td = elem.lastChild;

    if (!td) {
      return;
    } else if (!td.firstChild) {
      return;
    }

    const firstTwoDig = parseInt(elem.textContent.slice(0, 2));
    switch (firstTwoDig) {
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
const generatePage = async () => {
  await createPage();
  addSubmitBtnListener();
  addDelBtnListeners();
  addEditBtnListeners();
  addSwitchBtnListener();
  addRngsusBtnListener();
};
generatePage();
