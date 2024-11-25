'use client';

import { useState } from 'react';
import { storage } from './libs/firebase'; // Ensure this is the correct import for your Firebase config

// Importing necessary Firebase functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(''); // To store the name of the selected file

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name); // Store the file name
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);

    // Create a reference to the storage location
    const storageRef = ref(storage, `Uploads/${file.name}`);

    // Create the upload task using the modular API
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progress: ${progress}%`);
      },
      (error) => {
        console.error('Error uploading file: ', error);
        setUploading(false);
      },
      async () => {
        // Correct way to access the ref property (no need to call it)
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
        navigator.clipboard.writeText(downloadURL); // Automatically copy the URL to clipboard
        setUploading(false);
      }
    );
  };

  return (
    <div className='container'>
      <div className='upload'>
        <div className='fileUploadContainer'>
          <label htmlFor='file-upload' className='fileUpload'>
            Choose File
          </label>
          <input
            id='file-upload'
            type='file'
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the default file input
          />
        </div>

        {/* Show the selected file name */}
        {fileName && <p className='fileName'>{fileName}</p>}

        <button onClick={uploadFile} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {url && (
          <div className='message'>
            <p>File uploaded successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
