import { describe, expect, it } from 'vitest';

import { parseBgmManifest } from './bgm';

// 호스티드 BGM 매니페스트 파서 — 웹(/audio/playlist.json)과 토스(웹 오리진 절대 URL 폴백)가
// 같은 파서를 쓴다. 스키마 불일치·비JSON 형태가 와도 절대 throw 하지 않아야 한다(합성 폴백).

const WEB_BASE = 'https://aidigestdesk.vercel.app/audio/playlist.json';

describe('parseBgmManifest', () => {
  it('parses valid tracks and absolutizes relative src against the manifest origin', () => {
    const tracks = parseBgmManifest(
      {
        tracks: [
          {
            src: '/audio/hey-android.mp3',
            title: 'Hey Android',
            artist: 'VoldemarSF',
            license: 'Pixabay Content License',
            creditUrl: 'https://pixabay.com/music/pop-hey-android-340670/',
          },
        ],
      },
      WEB_BASE,
    );
    expect(tracks).toEqual([
      {
        src: 'https://aidigestdesk.vercel.app/audio/hey-android.mp3',
        title: 'Hey Android',
        artist: 'VoldemarSF',
        license: 'Pixabay Content License',
        creditUrl: 'https://pixabay.com/music/pop-hey-android-340670/',
      },
    ]);
  });

  it('keeps already-absolute src untouched and optional fields optional', () => {
    const tracks = parseBgmManifest(
      { tracks: [{ src: 'https://cdn.example.com/a.mp3', title: 'A' }] },
      WEB_BASE,
    );
    expect(tracks).toEqual([{ src: 'https://cdn.example.com/a.mp3', title: 'A' }]);
  });

  it('drops malformed entries without throwing (missing src/title, non-object items)', () => {
    const tracks = parseBgmManifest(
      {
        tracks: [
          { src: '', title: 'no-src' },
          { src: '/a.mp3' },
          'not-an-object',
          null,
          { src: '/ok.mp3', title: 'OK' },
        ],
      },
      WEB_BASE,
    );
    expect(tracks).toEqual([{ src: 'https://aidigestdesk.vercel.app/ok.mp3', title: 'OK' }]);
  });

  it('returns [] for non-manifest shapes (null, html-ish string, missing tracks)', () => {
    expect(parseBgmManifest(null, WEB_BASE)).toEqual([]);
    expect(parseBgmManifest('<!doctype html>', WEB_BASE)).toEqual([]);
    expect(parseBgmManifest({}, WEB_BASE)).toEqual([]);
    expect(parseBgmManifest({ tracks: 'nope' }, WEB_BASE)).toEqual([]);
  });
});
