const api_url = process.env.REACT_APP_BACKEND_API;

if (!api_url) {
  // throw new Error("REACT_APP_BACKEND_API is not defined");
  console.log("REACT_APP_BACKEND_API is not defined");
}


export { api_url };