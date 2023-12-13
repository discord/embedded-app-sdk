import React from 'react';
import discordSdk from '../discordSdk';

export default function OpenAttachmentUpload() {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [awaitingInitiateImageUpload, setAwaitingInitiateImageUpload] = React.useState(false);

  const doOpenAttachmentUpload = async () => {
    try {
      setAwaitingInitiateImageUpload(true);
      const response = await discordSdk.commands.initiateImageUpload();
      if (response) {
        setImageUrl(response.image_url);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setAwaitingInitiateImageUpload(false);
    }
  };

  return (
    <div style={{padding: 32}}>
      <div>Awaiting initiateImageUpload? "{JSON.stringify(awaitingInitiateImageUpload)}"</div>
      <button onClick={doOpenAttachmentUpload}>Click to Open Attachment Upload Flow!</button>
      {imageUrl ? <img src={imageUrl} /> : null}
    </div>
  );
}
