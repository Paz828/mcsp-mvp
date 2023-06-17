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
    /////////////////////////////////////////////////////////////////////////////////////////////////
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

      const data = await response.json();
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
// Adding the edit and delete listeners
const addEditDeleteListeners = async () => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Add
};

const attachToCol = (val, locStr, cls) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");
  div.textContent = val;
  div.classList.add(`entry${cls}`);
  loc.appendChild(div);
};

createPage();
addBtnListeners();
