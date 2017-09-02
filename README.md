# Barkeep :musical_note::saxophone:

Barkeep is a nifty little tool I made to assist my saxophone practice.
I had a CD of backing tracks to play along with, but every time I stuffed up a solo
I just wished I could shout out a bar number and have the CD pick back up from there.

Inspiration had struck, and a couple hours later I had knocked together a prototype using
[AudioContext](https://developer.mozilla.org/en/docs/Web/API/AudioContext) and
[SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) APIs.
[Click here for a demo!](https://timiles.github.io/barkeep/)

## TODO
- [x] play audio from bar number using voice recognition
- [x] stretch audio for slower practice
- [ ] multiple tracks, also voice controlled
- [ ] persist settings per audio track; import/export
- [ ] load files via drag & drop
- [ ] UI overhaul

## Credits

Demo track: [Not Just Jazz by Snowdrop](https://soundcloud.com/snowdrop_jpn/not-just-jazz)

[Kali](https://github.com/Infinity/Kali) to time stretch samples without pitch shifting
