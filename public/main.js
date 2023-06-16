/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create main page on start up
const createPage = async () => {
  try {
    // Party table creation magic
    const partyResponse = await fetch(
      "https://encounter-gen.onrender.com/party"
    );
    console.log(partyResponse);
    const partyData = await partyResponse.json();
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
// Submit button handler
const addListeners = async () => {
  const postForm = document.querySelector("#post-btn");
  postForm.addEventListener("submit", async (data) => {
    const response = await fetch("https://encounter-gen.onrender.com/party", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const postData = await response.json();
    createPage();
    console.log(postData);
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Switch button handler
};
const attachToCol = (val, locStr, cls) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");
  div.textContent = val;
  div.classList.add(`entry${cls}`);
  loc.appendChild(div);
};

createPage();
