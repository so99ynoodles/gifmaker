import React, { useMemo, useState } from 'react';
import { useConvertToGif } from './hooks/useConvertToGif';
import './App.css';

interface AppProps {}

function App({}: AppProps) {
  const [video, setVideo] = useState<File | null>();
  const videoUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [
    video,
  ]);

  const [gif, setGif] = useState<string>();
  const [startTime, setStartTime] = useState<string>('2.0');
  const [totalTime, setTotalTime] = useState<string>('2.5');
  const { ready, convertToGif } = useConvertToGif();

  async function handleConvert() {
    const url = await convertToGif(video!, totalTime, startTime);
    setGif(url);
  }

  return ready ? (
    <div className="App">
      <div className="App__Media">
        {video && (
          <video
            className="App__Media__Video"
            controls
            width="300"
            src={videoUrl!}
          />
        )}
      </div>
      <input
        className="App__Input"
        type="file"
        onChange={(e) => setVideo(e.target.files?.item(0))}
      />

      {video && (
        <div className="App__Controls">
          <div>
            <label>total time</label>
            <input
              type="number"
              step="0.1"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
            />
          </div>
          <div>
            <label>start time</label>
            <input
              type="number"
              step="0.1"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>
      )}

      <h3>Result</h3>
      <button onClick={handleConvert}>Convert</button>
      {gif && <img src={gif} alt="converted gif" />}
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default App;
