/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create main page on start up
const createPage = async () => {
  try {
    // Party table creation magic
    const partyResponse = await fetch(
      "https://encounter-gen.onrender.com/party",
      {
        method: "GET",
      }
    );
    const partyData = await partyResponse.json();
    console.log(partyData);
    partyData.forEach((elem) => {
      attachToCol(elem["char_lvl"], "#char-lvl", elem["char_id"]);
      attachToCol(elem["char_name"], "#char-name", elem["char_id"]);
      attachToCol(elem["char_class"], "#char-class", elem["char_id"]);
      attachToCol(elem["char_ancestry"], "#char-ancestry", elem["char_id"]);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Creature table creation magic
  } catch (err) {
    console.error(err);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Adding listeners to buttons
const addBtnListeners = async () => {
  const postForm = document.querySelector("#post-form");
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const url = form.action;
    // Form handlers
    try {
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
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////
      // Switch button handler
      ///////////////////////////////////////////////////////////////////////////////////////////////
      // Encounter button handler
    } catch (err) {
      console.error(err);
    }
    createPage();
  });
};
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
      usualRmArr[i].value = returnObj[keysArr[i + 1]];
    }
  } catch (err) {
    console.error(err);
  }
};

const attachToCol = (val, locStr, cls) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");
  div.textContent = val;
  div.addEventListener("click", () => {
    const returnedObj = moveToUsualRoom(cls);
  });
  loc.appendChild(div);
};

createPage();
addBtnListeners();
