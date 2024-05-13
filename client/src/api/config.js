

// const api_url = process.env.REACT_APP_API_BACKEND;

const api_url = "https://khmerpodcast.onrender.com";
// const api_url = "http://localhost:4000";

if (!api_url) {
  console.log("REACT_APP_BACKEND_API is not defined");
}


export { api_url };