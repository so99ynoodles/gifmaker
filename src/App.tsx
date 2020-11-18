import { ArrowRightIcon, ArrowUpIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  FormControl,
  FormLabel,
  Text,
  Button,
  Image,
  NumberIncrementStepper,
  IconButton,
} from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';
import { useConvertToGif } from './hooks/useConvertToGif';

interface AppProps {}

function App({}: AppProps): JSX.Element {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<File | null>();
  const videoUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [
    video,
  ]);

  const [gif, setGif] = useState<string>();
  const [startTime, setStartTime] = useState<string>('2.0');
  const [totalTime, setTotalTime] = useState<string>('2.5');
  const { ready, convertToGif, converting } = useConvertToGif();

  async function handleConvert() {
    const url = await convertToGif(video!, totalTime, startTime);
    setGif(url);
  }

  function onDownload() {
    let link = document.createElement('a');
    link.href = gif!;
    link.download = `${video?.name.split('.')?.[0] || 'download'}.gif`;
    link.click();
  }

  async function clickUpload(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    if (uploadRef.current) uploadRef.current?.click();
  }

  return ready ? (
    <Container padding="32px">
      <Box mb="16px">
        {video ? (
          <video controls src={videoUrl!} />
        ) : (
          <Text>Please upload a video to convert to Gif</Text>
        )}
      </Box>
      <Box mb="32px">
        <input
          ref={uploadRef}
          hidden
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.item(0))}
        />
        <Button
          onClick={clickUpload}
          mr="8px"
          colorScheme="teal"
          variant="outline"
          aria-label="upload video"
          leftIcon={<ArrowUpIcon />}
        >
          Upload
        </Button>
        <Button
          rightIcon={<ArrowRightIcon />}
          colorScheme="teal"
          variant="solid"
          disabled={!video}
          onClick={handleConvert}
        >
          Convert
        </Button>
      </Box>

      {video && (
        <Box mb="32px">
          <FormControl mb="16px">
            <FormLabel mb="8px">Total Time</FormLabel>
            <NumberInput
              step={0.1}
              min={1}
              value={totalTime}
              onChange={(value) => setTotalTime(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel mb="8px">Start Time</FormLabel>
            <NumberInput
              step={0.1}
              min={0}
              value={startTime}
              onChange={(value) => setStartTime(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Box>
      )}

      {converting && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Spinner colorScheme="teal" />
        </Box>
      )}

      {!converting && gif && (
        <Box position="relative">
          <IconButton
            cursor="pointer"
            position="absolute"
            colorScheme="teal"
            aria-label="download gif"
            icon={<DownloadIcon />}
            top="8px"
            right="8px"
            onClick={onDownload}
          />
          <Image borderRadius="4px" src={gif} alt="converted gif" />
        </Box>
      )}
    </Container>
  ) : (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      centerContent
      height="100vh"
    >
      <Spinner colorScheme="teal" size="xl" />
    </Container>
  );
}

export default App;
