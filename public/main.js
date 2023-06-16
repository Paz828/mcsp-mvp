const createPage = async () => {
  const partyTable = document.querySelector("#party-table");
  try {
    const response = await fetch("https://encounter-gen.onrender.com/party");
    console.log(response.json());
  } catch (err) {
    console.error(err);
  }
};
createPage();
