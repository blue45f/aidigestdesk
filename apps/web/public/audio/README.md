# Background Music Assets

Tracks are used under the Pixabay Content License (free for commercial use, no
attribution required). Not for standalone redistribution.

| File | Title | Artist | Source |
| --- | --- | --- | --- |
| `hey-android.mp3` | Hey Android | VoldemarSF | https://pixabay.com/music/pop-hey-android-340670/ |
| `synthwave-vocal-pop-love-song.mp3` | Synthwave Vocal Pop Love Song | Sound4Stock | https://pixabay.com/music/electronic-synthwave-vocal-pop-love-song-464602/ |

License reference: https://pixabay.com/service/license-summary/

`playlist.json` is the runtime manifest consumed by the shared BGM engine
(`packages/content/src/shared/bgm.ts`). If it is missing or unreachable, the
app silently falls back to the procedurally generated Web Audio soundtrack.
