import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsFromLS = JSON.parse(localStorage.getItem("tweetsData"))
let newTweetData = tweetsData

if(tweetsFromLS) {
    newTweetData = tweetsFromLS
}
// if(tweetsFromLS.length > 0) {
//     newTweetData = tweetsFromLS
// }else if(tweetsFromLS.length === 0) {
//     newTweetData = tweetsData
// }

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.dataset.delete) {
        deleteTweet(e.target.dataset.delete)
    }else if(e.target.dataset.comment) {
         handleCommentBtnClick(e.target.dataset.comment)
    }else if(e.target.dataset.deleteComment) {
        deleteComment(e.target.dataset.deleteComment)
    }
    
})



function handleLikeClick(tweetId){ 
    const targetTweetObj = newTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    
   
    
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = newTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
   
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        newTweetData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

 function handleCommentBtnClick(commentId) {
        const commentedObj = newTweetData.filter(tweet => {
            return tweet.uuid === commentId
        })[0]
        const commentEl = document.getElementById(`comment-${commentId}`)
        
        const commentBtn = document.getElementById(`comment_btn-${commentId}`)
        
        commentBtn.addEventListener("click", function() {
            if(commentEl.value) {    
                commentedObj.replies.unshift(
                    {
                        handle: `@Scrimba`,
                        profilePic: `images/scrimbalogo.png`,
                        tweetText: commentEl.value,
                        uuid: uuidv4()
                    }
                )
                render()
                commentEl.value = ""
            }
        })   
    }

function deleteTweet(deleteId) {
    const deletingObj = newTweetData.filter(tweet => {
        return tweet.uuid === deleteId
    })[0]
    const index = newTweetData.indexOf(deletingObj)
    newTweetData.splice(index, 1)
    render()
}

function deleteComment(commentId) {
       
    newTweetData.forEach(function(tweet){

     tweet.replies = tweet.replies.filter(function(reply){

        return reply.uuid !== commentId })
        
    })
    
    render()
  
}


function repliesLayout(tweet) {
    let repliesHtml = ''
    
    if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml +=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div class="comment_text">
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        ${reply.handle == "@Scrimba" ? `<i class="fa-regular fa-trash-can" data-delete-comment="${reply.uuid}"></i>` : ""}   
                        </div>
                </div>
                `
            })
        }

    
    return repliesHtml
}



function getFeedHtml(){
    let feedHtml = ``

    
    newTweetData.forEach(function(tweet){        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
       
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

              
        feedHtml += `
        <div class="tweet">
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
                    </div>   
                </div>   
                <i class="fa-regular fa-trash-can" data-delete="${tweet.uuid}"></i>        
            </div>
            <div class="hidden replies_field" id="replies-${tweet.uuid}">
            <form>
                <textarea wrap="hard" placeholder="Your comment..." type="text" class="comment-input" id="comment-${tweet.uuid}" data-comment ="${tweet.uuid}" autofocus></textarea>
                <input type="submit" class="comment_btn__submit" id="comment_btn-${tweet.uuid}" value="tweet"></input>
            </form>
                ${repliesLayout(tweet)}
            </div>   
        </div>
        `
       
   })
  
   return feedHtml 
}

function render(){ 
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem('tweetsData', JSON.stringify(newTweetData))
}

render()

