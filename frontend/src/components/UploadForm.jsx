import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [signal, setSignal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('screenshot', image);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', form);
      setSignal(res.data.data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Analyze Screenshot</button>
      </form>

      {signal && (
        <div style={{ marginTop: '1rem' }}>
          <h3>📬 Signal Received</h3>
          <pre>{JSON.stringify(signal, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
