const createPage = async () => {
  const partyTable = document.querySelector("#party-table");
  try {
    const response = await fetch("https://encounter-gen.onrender.com/party");
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
createPage();
