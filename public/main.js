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
    console.log(formDataJsonString);
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
          console.log(url);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Moving the selected entry to the edit/delete box
const moveToUsualRoom = async (id) => {
  const usualRmArr = document.querySelectorAll(".usual-room");

  try {
    const response = await fetch(
      `https://encounter-gen.onrender.com/party/${id}`
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
    url += `/${id}`;

    try {
      let indicated = document.querySelector("#indicator");
      if (indicated.textContent === "delete") {
        const response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      console.error(err);
    }
    createPage();
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
    url += `/${id}`;

    try {
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
      }
    } catch (err) {
      console.error(err);
    }
    createPage();
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions

// Function that attaches things to the table
const attachToCol = (val, locStr, cls) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");
  if (/url/.test(locStr)) {
    const a = document.createElement("a");
    a.href = val;
    a.textContent = "See Page";
    div.appendChild(a);
  } else {
    div.textContent = val;
    div.addEventListener("click", () => {
      const returnedObj = moveToUsualRoom(cls);
    });
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

createPage();
addSubmitBtnListener();
addDelBtnListeners();
addEditBtnListeners();
addSwitchBtnListener();
