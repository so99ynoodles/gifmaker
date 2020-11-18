import { useToast } from '@chakra-ui/react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useEffect, useState } from 'react';
const ffmpeg = createFFmpeg({ log: true });

export function useConvertToGif() {
  const [ready, setReady] = useState(false);
  const [converting, setConverting] = useState(false);
  const toast = useToast();

  async function load() {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  async function convertToGif(
    video: File,
    totalTime: string = '2.5',
    startTime: string = '2.0',
  ) {
    try {
      setConverting(true);
      ffmpeg.FS('writeFile', video.name, await fetchFile(video));
      await ffmpeg.run(
        '-i',
        video.name,
        // 動画の長さ
        '-t',
        totalTime,
        // 動画のスタートタイム
        '-ss',
        startTime,
        '-f',
        'gif',
        'out.gif',
      );
      const data = ffmpeg.FS('readFile', 'out.gif');
      toast({
        position: 'bottom-left',
        title: 'Your video was successfully converted to Gif.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return URL.createObjectURL(
        new Blob([data.buffer], { type: 'image/gif' }),
      );
    } catch (e) {
      console.error(e);
      toast({
        position: 'bottom-left',
        title: 'Your Gif conversion failed.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setConverting(false);
    }
  }

  return {
    ready,
    convertToGif,
    converting,
  };
}
