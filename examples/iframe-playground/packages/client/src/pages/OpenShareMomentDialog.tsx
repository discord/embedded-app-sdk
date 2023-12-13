import React from 'react';
import discordSdk from '../discordSdk';
import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

import babyBrick from '../../assets/baby-brick.jpeg';
import brickPugLife from '../../assets/brick-pug-life.gif';

const NAME_TO_IMG: {[name: string]: {src: any; width: number; height: number}} = {
  'baby-brick': {
    src: babyBrick,
    width: 240,
    height: 320,
  },
  'pug-life': {
    src: brickPugLife,
    width: 292,
    height: 320,
  },
};

async function imageURLToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type;
  const buf = await blob.arrayBuffer();
  return new File([buf], url, {type: mimeType});
}

async function uploadImageAttachment(imageURL: string): Promise<string> {
  const applicationId = import.meta.env.VITE_APPLICATION_ID;
  const auth = authStore.getState();
  const imageFile = await imageURLToFile(imageURL);
  const body = new FormData();
  body.append('file', imageFile);
  const resp = await DiscordAPI.request<{attachment: {url: string}}>(
    {
      method: RequestType.POST,
      endpoint: `/activities/${applicationId}/attachment`,
      body,
      stringifyBody: false,
    },
    auth.access_token
  );
  return resp.attachment.url;
}

export default function OpenShareMomentDialog() {
  const [selectedImage, setSelectedImage] = React.useState<string>('baby-brick');
  const [posting, setPosting] = React.useState<boolean>(false);

  const doOpenShareMomentDialog = async () => {
    setPosting(true);
    const imageURL = NAME_TO_IMG[selectedImage]?.src;
    if (imageURL == null) return;
    const mediaUrl = await uploadImageAttachment(imageURL);
    try {
      await discordSdk.commands.openShareMomentDialog({
        mediaUrl,
      });
    } catch (err: any) {
      // TODO
    }
    setPosting(false);
  };
  return (
    <div style={{padding: 32}}>
      {Object.entries(NAME_TO_IMG).map(([name, {src, width, height}]) => {
        return (
          <img
            style={{
              border: selectedImage === name ? '1px solid red' : 'none',
            }}
            key={name}
            src={src}
            alt={name}
            width={width}
            height={height}
            onClick={() => setSelectedImage(name)}
          />
        );
      })}
      <br />
      <button onClick={doOpenShareMomentDialog}>Click to Share this Image!</button>
      {posting ? <p> ... sharing in progress ... </p> : null}
    </div>
  );
}
