import { tweetsData as defaultTweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let tweetsData =
  JSON.parse(localStorage.getItem("tweetsData")) || defaultTweetsData;

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.replyInput) {
    handleReplyBtnClick(e.target.dataset.replyInput);
  } else if (e.target.dataset.delete) {
    console.log(e.target.dataset.delete);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweetId === tweet.uuid;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }

  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  saveDataToLocalStorage();
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweetId === tweet.uuid;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }

  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;

  saveDataToLocalStorage();
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    const newTweet = {
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    };
    tweetsData.unshift(newTweet);
    saveDataToLocalStorage();

    localStorage.setItem("localId", newTweet.uuid);
    render();
    document
      .getElementById(`delete-${newTweet.uuid}`)
      .classList.toggle("hidden");
    tweetInput.value = "";
  }
}

function handleReplyBtnClick(replyId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === replyId;
  })[0];
  const replyInput = document.getElementById(`reply-input-${replyId}`);

  if (replyInput.value) {
    targetTweetObj.replies.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyInput.value,
    });

    saveDataToLocalStorage();
    render();
    handleReplyClick(replyId);
    replyInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;
  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";
    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = `    
    <div class="tweet-reply">
    <div class="tweet-inner">
      <div class="tweet-input-area reply-area">
      <img src="images/scrimbalogo.png" class="profile-pic" />
      <input type="text" placeholder="Tweet your reply!" id="reply-input-${tweet.uuid}"></textarea>
    </div>
    <button class="reply-btn" data-reply-input="${tweet.uuid}">Reply</button>
  </div>
</div>`;
    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `<div class="tweet-reply">
        <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${reply.handle}</p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
    </div>`;
      });
    }

    feedHtml += `<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail hidden" id="delete-${tweet.uuid}">
                <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
            </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>`;
  });

  return feedHtml;
}

function saveDataToLocalStorage() {
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
