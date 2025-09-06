const tracks = [
    {title:'Track One', artist:'Artist A', src:'tracks/track1.mp3', cover:'cover1.jpg'},
    {title:'Track Two', artist:'Artist B', src:'tracks/track2.mp3', cover:'cover1.jpg'}
  ];
  
  const audio = document.getElementById('audio');
  const playlistEl = document.getElementById('playlist');
  const playBtn = document.getElementById('play');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  const titleEl = document.getElementById('title');
  const artistEl = document.getElementById('artist');
  const coverEl = document.getElementById('cover');
  const seek = document.getElementById('seek');
  const timeEl = document.getElementById('time');
  
  let idx = 0;
  let updating = false;
  
  function load(index){
    const t = tracks[index];
    audio.src = t.src;
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist;
    coverEl.src = t.cover || 'cover1.jpg';
    Array.from(playlistEl.children).forEach((li,i)=> li.classList.toggle('active', i===index));
  }
  
  function playPause(){ if(audio.paused) audio.play(); else audio.pause(); }
  playBtn.addEventListener('click', ()=> { playPause(); updatePlayIcon(); });
  
  audio.addEventListener('play', updatePlayIcon);
  audio.addEventListener('pause', updatePlayIcon);
  function updatePlayIcon(){ playBtn.textContent = audio.paused ? '▶' : '⏸'; }
  
  nextBtn.addEventListener('click', ()=> { idx = (idx+1)%tracks.length; load(idx); audio.play(); });
  prevBtn.addEventListener('click', ()=> { idx = (idx-1+tracks.length)%tracks.length; load(idx); audio.play(); });
  
  tracks.forEach((t,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${t.title} — ${t.artist}</span><small>▶</small>`;
    li.addEventListener('click', ()=> { idx = i; load(i); audio.play(); });
    playlistEl.appendChild(li);
  });
  
  audio.addEventListener('timeupdate', ()=>{
    if(!updating){
      const pct = audio.currentTime / audio.duration || 0;
      seek.value = Math.floor(pct * 100);
      timeEl.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration || 0);
    }
  });
  
  seek.addEventListener('input', ()=>{
    updating = true;
    const t = (seek.value / 100) * (audio.duration || 0);
    timeEl.textContent = formatTime(t) + ' / ' + formatTime(audio.duration || 0);
  });
  seek.addEventListener('change', ()=>{
    audio.currentTime = (seek.value / 100) * (audio.duration || 0);
    updating = false;
  });
  
  function formatTime(s){ if(!s || isNaN(s)) return '0:00'; const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
  
  audio.addEventListener('ended', ()=> { idx = (idx+1)%tracks.length; load(idx); audio.play(); });
  
  // ilk yükleme
  load(idx);
  