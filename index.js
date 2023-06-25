// import Data
import { tweetsData } from "./data.js";

const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");

tweetBtn.addEventListener("click", function () {
  const tweetContent = tweetInput.value;
  console.log(tweetContent);
  tweetInput.value = "";
});
