// ==UserScript==
// @name         Youtube Video Playback Speed
// @namespace    https://orangemonkey.github.io/
// @version      1.0
// @description  Tự động đặt tốc độ phát YouTube mặc định là 1.85, giữ nguyên nếu người dùng thay đổi, và về 1.0 cho livestream
// @author       You
// @match        *://www.youtube.com/*
// @updateURL    https://raw.githubusercontent.com/vaitan/youtube-video-speed/main/youtube-video-speed.user.js
// @downloadURL  https://raw.githubusercontent.com/vaitan/youtube-video-speed/main/youtube-video-speed.user.js
// @supportURL   https://github.com/vaitan/youtube-video-speed/issues
// @homepageURL  https://github.com/vaitan/youtube-video-speed
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_SPEED = 1.85;
  const LIVE_SPEED = 1.0;

  // Biến này để theo dõi tốc độ do người dùng đặt
  let userSpeedSet = false;

  function addRateChangeListener() {
    const video = document.querySelector("video");
    if (video) {
      video.removeEventListener("ratechange", handleSpeedChange);
      video.addEventListener("ratechange", handleSpeedChange);
    }
  }

  function setVideoSpeed() {
    const video = document.querySelector("video");
    if (!video) {
      return;
    }

    const isLive =
      !!document.querySelector(
        ".ytp-live-badge.ytp-button.ytp-live-badge-is-livehead"
      )?.offsetParent || false;
    const targetSpeed = isLive ? LIVE_SPEED : DEFAULT_SPEED;

    if (!userSpeedSet) {
      if (video.playbackRate !== targetSpeed) {
        video.playbackRate = targetSpeed;
        console.log(
          "YouTube video speed set to:",
          targetSpeed,
          isLive ? "(Live Stream)" : ""
        );
      }
      userSpeedSet = false;
    } else if (userSpeedSet && isLive) {
      video.playbackRate = LIVE_SPEED;
      userSpeedSet = false;
    }
  }

  function handleSpeedChange() {
    const video = document.querySelector("video");
    if (video) {
      if (
        video.playbackRate !== DEFAULT_SPEED &&
        video.playbackRate !== LIVE_SPEED
      ) {
        userSpeedSet = true;
        console.log("User changed video speed to:", video.playbackRate);
      }
    }
  }

  window.addEventListener("load", () => {
    userSpeedSet = false;
    setVideoSpeed();
    addRateChangeListener();
  });
  window.addEventListener("yt-navigate-finish", () => {
    userSpeedSet = false;
    setVideoSpeed();
    addRateChangeListener();
  });

  const videoElement = document.querySelector("video");
  if (videoElement) {
    videoElement.addEventListener("ratechange", handleSpeedChange);
  }

  setInterval(() => {
    setVideoSpeed();
  }, 1000); // để tránh tốn tài nguyên CPU, thay vì 1ms
})();