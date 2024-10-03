async function getAllUrls(page = 1) {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/v1/urls?page=${page}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getShortUrl(shortID) {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/v1/urls/${shortID}`
    );
    const data = await res.json();
    return data.shortUrl.full;
  } catch (error) {
    console.error(error);
  }
}

async function getProfile() {
  try {
    const response = await fetch("http://localhost:5001/auth/profile", {
      method: "GET",
      credentials: "include", // include credentials (cookies) in the request
    });

    if (response.status === 200) {
      const userProfile = await response.json();
      return userProfile;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

module.exports = { getAllUrls, getShortUrl, getProfile };
