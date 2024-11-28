
let currentSong = new Audio();
let songs;
let folder;

Array.from(document.getElementsByClassName("recent")).forEach(e => {
  e.addEventListener("click", async () => {
      folder = e.getAttribute('data-folder');
      console.log(folder);
      const songs = await getSongs(folder);
       // Wait for songs to be retrieved
       // Print the songs retrieved
  });
});

async function getSongs(folder) {
  const url = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
  console.log(url);
  let response = await url.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
          songs.push(element.href.split(`/songs/${folder}/`)[1]);
      }
  }
  console.log(songs);
  return songs; // Return the songs array
}

async function main(folder){

// songs = await getSongs(`/songs/${folder}/`)
// console.log(songs)

let songUL=document.querySelector(".songlists").getElementsByTagName("ul")[0];
for (const song of songs) {
  songUL.innerHTML=songUL.innerHTML+`<li> 
  <div class="playnow-container flex space-evenly align">
      <i class="fa-solid fa-music"></i>
      <div class="song-info">
          <span>${song.replaceAll("%20"," ")}</span><br>
          <span>Artist name</span>
      </div>
      <div class="play-button flex align">
          Play Now
          <i class="fa-solid fa-circle-play bar"></i>
      </div>
  </div>
</li>
`;
  
}

const playMusic=(track)=>{
  // let modifiedTrack = track.charAt(0).toLowerCase() + track.slice(1);
  // currentSong.src = `/songs/${modifiedTrack.replace(" ", "%20")}.mp3`;


  currentSong.src=`/song/${folder}/`+ track.replace(" ","%20");
  currentSong.play();
  document.querySelector(".songIN").innerHTML=track.replaceAll("%20"," ").replace(".mp3","");
  document.getElementById("play").className = "fa-solid fa-circle-pause bar";

  
}
Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click",element=>{
  console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
  playMusic(e.querySelector(".song-info").firstElementChild.innerHTML);
})
})

play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    document.getElementById("play").className = "fa-solid fa-circle-pause bar";
  } else {
    currentSong.pause();
    document.getElementById("play").className = "fa-solid fa-circle-play bar";
  }
});

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

currentSong.addEventListener("timeupdate",()=>{
  //console.log(currentSong.currentTime,currentSong.duration);
  document.querySelector(".songTime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
  document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
})

document.querySelector(".seekbar").addEventListener("click", e=>{
  document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
  currentSong.currentTime=((currentSong.duration)*(e.offsetX/e.target.getBoundingClientRect().width));
})

document.querySelector(".ham").addEventListener("click",()=>{
  document.querySelector(".box12").style.left="0";
})

document.querySelector(".fa-xmark").addEventListener("click",()=>{
  document.querySelector(".box12").style.left="-100%";
})
previous.addEventListener("click",()=>{
  console.log("previous");
  let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index-1)>=0){
    playMusic(songs[index-1])
  }

  
})
next.addEventListener("click",()=>{
  console.log("next");
  
  let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index+1)<(songs.length)){
    playMusic(songs[index+1])
  }
})

//const capitalizeFirstLetter = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
// Array.from(document.getElementsByClassName("recent")).forEach(e=>{
//   console.log(e)
//   e.addEventListener("click",async item=>{
//     console.log(item,item.currentTarget.dataset)
//     songs= await getSongs(`songs/${item.currentTarget.dataset}`)
//   })
// })

}


main(folder)