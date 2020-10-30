const timeEl = document.querySelector("time");
const speakBtn = document.querySelector("button");
const audioEl = document.querySelector("audio");

let date, min, hr, ampm;

const updateTime = () => {
  date = new Date();
  min = date.getMinutes();

  const hr24 = date.getHours();
  hr = hr24 % 12 || 12;
  ampm = hr24 < 12 || hr24 === 24 ? "AM" : "PM";

  const timeStr = `${hr}:${min < 10 ? 0 : ""}${min} ${ampm}`;
  timeEl.innerText = timeStr;
};
setTimeout(() => {
  /** Update time in first minute */
  updateTime();
  setInterval(() => {
    updateTime();
  }, 60 * 1000);
}, (60 - new Date().getSeconds()) * 1000);

updateTime();

let isFinishedSpeaking = false,
  isOSaid = false,
  isMin10Said = false,
  isMin1Said = false,
  isHrSaid = false,
  isMinBelow20Said = false,
  isEvenAdded = false;

const speakTime = () => {
  const addSrc = (num) => {
    audioEl.src = `./numbers/${num}.mp3`;
    const isPlayed = audioEl.play();
    audioEl.playbackRate = 1.2;
  };

  /** will be called when audio is playing finished so that we can play another audio */
  const audioEnd = () => {
    console.log("audio end called ", isHrSaid);

    if (isFinishedSpeaking) {
      return;
    }
    /** hr will always be b/w 1 - 12 so its already pre recorded */
    if (!isHrSaid) {
      addSrc(hr);
      isHrSaid = true;
      return;
    }

    if (min === 0) {
      addSrc(ampm);
      isFinishedSpeaking = true;
      return;
    }
    /** Speak 'O' if min < 10 and is not said*/
    if (min < 10 && !isOSaid) {
      addSrc("o");
      isOSaid = true;
      return;
    }
    /** if minute is b/w 1 - 20 say it directly no complications */
    if (min <= 20 && !isMinBelow20Said) {
      addSrc(min);
      isMinBelow20Said = true;
      return;
    }

    if (min > 20 && !isMin10Said) {
      const min10 = min.toString().split("")[0];
      addSrc(`${min10}0`);
      isMin10Said = true;
      return;
    }
    /** dont run if minute is 30 40 50 */
    if (!isMin1Said && min > 20 && min.toString().split("")[1] !== "0") {
      const min1 = min.toString().split("")[1];
      addSrc(min1);
      isMin1Said = true;
      return;
    }
    /** Play its sound first */
    addSrc(ampm);
    isFinishedSpeaking = true;
  };

  /** Add even listener only once */
  if (!isEvenAdded) {
    audioEl.addEventListener("ended", audioEnd);
    isEvenAdded = true;
  }
  addSrc("its");
};

speakBtn.addEventListener("click", () => {
  isFinishedSpeaking = false;
  isOSaid = false;
  isMin10Said = false;
  isHrSaid = false;
  isMinBelow20Said = false;
  isMin1Said = false;

  speakTime();
});

/** Preload audios */
const audioList = [
  "1.mp3",
  "10.mp3",
  "11.mp3",
  "12.mp3",
  "13.mp3",
  "14.mp3",
  "15.mp3",
  "16.mp3",
  "17.mp3",
  "18.mp3",
  "19.mp3",
  "2.mp3",
  "20.mp3",
  "3.mp3",
  "30.mp3",
  "4.mp3",
  "40.mp3",
  "5.mp3",
  "50.mp3",
  "6.mp3",
  "7.mp3",
  "8.mp3",
  "9.mp3",
  "am.mp3",
  "its.mp3",
  "o.mp3",
  "pm.mp3",
];
