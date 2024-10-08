const { getAllUrls } = require("./getters");

async function deleteShortUrl(shortID, userId) {
  try {
    const body = { userId: userId };
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    // DELETE request
    await fetch(
      `${process.env.SERVER_URL}/v1/urls/${shortID}`,
      requestOptions
    );

    const data = await getAllUrls();
    return data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { deleteShortUrl };
