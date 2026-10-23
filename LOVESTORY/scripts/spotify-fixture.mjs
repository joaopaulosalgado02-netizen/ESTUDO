/** Test double for the documented Spotify iFrame controller, never shipped. */
export async function mockSpotify(context) {
  await context.route('https://open.spotify.com/embed/iframe-api/v1', route => route.fulfill({ contentType: 'text/javascript', body: `
    window.__spotifyTest = { calls: [], uri: null, playing: false };
    window.onSpotifyIframeApiReady({ createController(element, options, callback) {
      window.__spotifyTest.uri = options.uri;
      const frame = document.createElement('iframe'); frame.src = 'about:blank'; frame.height = '80'; frame.width = '100%'; element.replaceWith(frame);
      const listeners = {};
      const emit = paused => { window.__spotifyTest.playing = !paused; listeners.playback_update?.({ data: { isPaused: paused, isBuffering: false } }); };
      const controller = {
        pause() { window.__spotifyTest.calls.push('pause'); emit(true); },
        resume() { window.__spotifyTest.calls.push('resume'); emit(false); },
        destroy() { window.__spotifyTest.calls.push('destroy'); frame.remove(); },
        addListener(event, callback) { listeners[event] = callback; }
      };
      callback(controller);
      setTimeout(() => listeners.ready?.({ data: {} }), 0);
    }});
  ` }));
}
