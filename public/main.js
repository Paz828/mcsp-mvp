const createPage = async () => {
  const partyTable = document.querySelector("#party-table");
  try {
    const response = await fetch("https://encounter-gen.onrender.com/party");
    const charArr = response.value.json();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
createPage();
