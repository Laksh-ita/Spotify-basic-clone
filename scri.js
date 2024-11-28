let currentSong = new Audio();
let songs;
let folder;


async function getFolder() {
  const url = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await url.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songss = [];
  let listHTML = ""; 

  
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith('.ab')) {
      let folderName = element.href.split('/').slice(-1)[0];
      songss.push(folderName);
    }
  }

  
  for (let index = 0; index < songss.length; index++) {
    const response = await fetch(`http://127.0.0.1:5500/songs/${songss[index]}/info.json`);
    const data = await response.json();
    listHTML += `<div class="recent flex justify margin" data-folder="${data.title}">
                    <div class="img"> 
                        <img src="${data.background}" alt="${data.title}" class="back_img">
                    </div> 
                    <div class="songName"> <!-- Added a wrapper div for song info -->
                        <p style="font-size: 20px;">${data.title.replace('.ab', '')}</p>
                        <p style="font-size: 16px;">${data.description}</p>
                    </div>
                </div>`;
}



  document.querySelector(".mix").innerHTML = document.querySelector(".mix").innerHTML + listHTML; // Append HTML after loop


  
  
  Array.from(document.getElementsByClassName("recent")).forEach(e => {
    e.addEventListener("click", async () => {
        folder = e.getAttribute('data-folder');
        console.log(folder);
        const songs = await getSongs(folder);
        const songUL = document.querySelector(".songlists").getElementsByTagName("ul")[0];
        songUL.innerHTML = ""; // Clear the previous songs
        for (const song of songs) {
            songUL.innerHTML += `
                <li> 
                    <div class="playnow-container flex space-evenly align">
                        <i class="fa-solid fa-music"></i>
                        <div class="song-info">
                            <span>${song.replaceAll("%20", " ")}</span><br>
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
        addPlayEventListeners(); // Add event listeners to play songs

        
          playMusic(folder,songs[0])  
        
       
    });
});

}


  
  getFolder()
    


async function getSongs(folder) {
    const url = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
    let response = await url.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/${folder}/`)[1]);
        }
    }
    //console.log(songs);
    return songs; 
}

function addPlayEventListeners() {
    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".song-info").firstElementChild.innerHTML;
            playMusic(folder, songName); // Call playMusic with folder and songName
        });
    });
}

function playMusic(folder, track) {
    currentSong.src = `/songs/${folder}/` + track.replaceAll(" ","%20")
    currentSong.play();
    document.querySelector(".songIN").style.border="1px solid white"
    document.querySelector(".songIN").innerHTML = track.replaceAll("%20", " ");
    document.getElementById("play").className = "fa-solid fa-circle-pause bar";
}

  
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        document.getElementById("play").className = "fa-solid fa-circle-pause bar";
      } else {
        currentSong.pause();
        document.getElementById("play").className = "fa-solid fa-circle-play bar";
      }
    });

   
    
    
    

//Call main function to initialize the player

function main(){

    // document.querySelector(".play").addEventListener("click",()=>{
    //   playMusic(folder,songs[0])
    //   if (songs[0].paused) {
        
    //     document.getElementById("play").className = "fa-solid fa-pause play";
    //   } else {
    //     songs[0].pause();
    //     document.getElementById("play").className = "fa-solid fa-play play";
    //   }
    //   })




    previous.addEventListener("click", () => {
        console.log("previous");
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if((index-1)>=0){
        playMusic(folder,songs[index-1])
        }
    });
    
    next.addEventListener("click", () => {
        console.log("next");
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if((index+1)<(songs.length)){
        playMusic(folder,songs[index+1])
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
  const mediaQuery = window.matchMedia('(max-width: 1250px)');
  const container = document.querySelector(".container");
  const box12 = document.querySelector(".box12");
  
  container.addEventListener("click", () => {
      if (mediaQuery.matches) {
          box12.style.left = "-125%";
      } else {
          box12.style.left="0";
      }
  });
  

  document.querySelector(".ham").addEventListener("click",function(event){
    
    document.querySelector(".box12").style.left="0";
    event.stopPropagation();
    
    
  }) 
  document.querySelector(".fa-xmark").addEventListener("click",()=>{
    document.querySelector(".box12").style.left="-125%";
  }) 
  
  }
  
  
  main()