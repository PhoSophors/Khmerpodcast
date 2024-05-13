

// const api_url = process.env.REACT_APP_API_BACKEND;

const api_url = "https://khmerpodcast.onrender.com";
// const api_url = "http://localhost:4000";

if (!api_url) {
  // throw new Error("REACT_APP_BACKEND_API is not defined");
  console.log("REACT_APP_BACKEND_API is not defined");
}

console.log(api_url)

export { api_url };