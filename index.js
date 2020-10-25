const timeEl = document.querySelector("time");
const audioEl = document.querySelector("audio");
const speakBtn = document.querySelector("#speakBtn");

let date, min, hr, ampm;

const updateTime = () => {
  date = new Date();
  min = date.getMinutes();
  const hr24 = date.getHours();

  hr = hr24 % 12 || 12;
  ampm = hr24 < 12 || hr24 === 24 ? "AM" : "PM";

  const timeStr = `${hr}:${min < 10 ? 0 : ""}${min} ${ampm}`;
  timeEl.innerHTML = timeStr;
};

const speakTime = () => {
  let isFinishedSpeaking = false;
  let isOSaid = false;
  let isMinTenSaid = false;
  let minOneSaid = false;
  let hrSaid = false;
  let isMinBelow20Said = false;

  const playAudio = () => {
    const playPromise = audioEl.play();
  };
  const addSrc = (num) => {
    audioEl.src = `./numbers/${num}.mp3`;
    playAudio();
  };

  /** will be called when audio is playing finished so that we can play another audio */
  const audioEnd = () => {
    /** hr will always be b/w 1 - 12 so its already pre recorded */
    if (!hrSaid) {
      addSrc(hr);
      hrSaid = true;
      return;
    }

    if (min === 0 || isFinishedSpeaking) {
      if (min === 0 && !isFinishedSpeaking) {
        addSrc(ampm);
      }
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
    if (min < 21 && !isMinBelow20Said) {
      console.log("Min is 1 to 20");
      addSrc(min);
      isMinBelow20Said = true;
      isMinTenSaid = true;
      return;
    }

    if (min > 20 && !isMinTenSaid) {
      const minTen = min.toString().split("")[0];
      //   console.log(`${minTen}0`);
      addSrc(`${minTen}0`);
      isMinTenSaid = true;
      return;
    }

    /** dont run if minute is 30 40 50 */
    if (min > 20 && !minOneSaid && min.toString().split("")[1] !== "0") {
      const minFirst = min.toString().split("")[1];
      addSrc(minFirst);
      minOneSaid = true;
      return;
    }

    addSrc(ampm);
    isFinishedSpeaking = true;
  };
  audioEl.addEventListener("ended", audioEnd);
  /** Play its sound first */
  addSrc("its");
};

speakBtn.addEventListener("click", speakTime);

updateTime();
setInterval(() => {
  updateTime();
}, (60 - new Date().getSeconds()) * 1000);
