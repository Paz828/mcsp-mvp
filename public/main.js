/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create main page on start up
const createPage = async () => {
  try {
    // Party table creation magic
    const partyResponse = await fetch(
      "https://encounter-gen.onrender.com/party"
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
// Submit button handler
// const addListeners = async () => {
//   const postForm = document.querySelector("#post-btn");
//   postForm.addEventListener("click", (data) => {
//     console.log("here");
//     // const response = await fetch("https://encounter-gen.onrender.com/party", {
//     //   method: "post",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify(data),
//     // });
//     // const postData = await response.json();
//     // console.log(postData);
//     createPage();
//   });
/////////////////////////////////////////////////////////////////////////////////////////////////
// Switch button handler
// };
const attachToCol = (val, locStr, cls) => {
  const loc = document.querySelector(locStr);
  const div = document.createElement("div");
  div.textContent = val;
  div.classList.add(`entry${cls}`);
  loc.appendChild(div);
};

createPage();
addListeners();
