'use client';

import { useState } from 'react';
import { storage } from '../libs/firebase'; // Assuming storage is initialized here

// Importing necessary Firebase functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);

    // Check if the storage object is properly initialized
    if (!storage) {
      console.error('Firebase storage is not initialized.');
      setUploading(false);
      return;
    }

    // Create a reference to the storage location
    const storageRef = ref(storage, `Uploads/${file.name}`);

    // Create the upload task using the modular API
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can monitor upload progress here if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progress: ${progress}%`);
      },
      (error) => {
        console.error('Error uploading file: ', error);
        setUploading(false);
      },
      async () => {
        // File uploaded successfully, get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
        setUploading(false);
      }
    );
  };

  const copyUrlToClipboard = () => {
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
        });
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {url && (
        <div>
          <p>File uploaded successfully!</p>
          <p>
            URL:{' '}
            <a href={url} target='_blank' rel='noopener noreferrer'>
              {url}
            </a>
          </p>
          <button onClick={copyUrlToClipboard}>Copy URL</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
