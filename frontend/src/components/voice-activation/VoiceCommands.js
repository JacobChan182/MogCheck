import { useEffect, useMemo, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function VoiceCommands({ selectedImage, setResponse, setLoading, setError, response, setInsults, setLoadingInsults }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);
    setInsults(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      console.log('Calling API at:', `${API_URL}/api/gemini/`);
      
      let res;
      try {
        res = await fetch(`${API_URL}/api/gemini/`, {
          method: 'POST',
          body: formData,
        });
      } catch (fetchErr) {
        throw new Error(`Failed to connect to backend at ${API_URL}. Make sure the backend is running. Error: ${fetchErr.message}`);
      }

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { detail: `Server returned status ${res.status}: ${res.statusText}` };
        }
        throw new Error(errorData.detail || `Failed to get response (${res.status})`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedImage, setResponse, setLoading, setError, setInsults, API_URL]);

  const handleGenerateInsults = useCallback(async () => {
    if (!response) {
      setError('Please analyze an image first');
      return;
    }

    setLoadingInsults(true);
    try {
      const insultsRes = await fetch(`${API_URL}/api/insults/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });

      if (insultsRes.ok) {
        const insultsData = await insultsRes.json();
        setInsults(insultsData.insults);
      }
    } catch (insultErr) {
      console.error('Error fetching insults:', insultErr);
    } finally {
      setLoadingInsults(false);
    }
  }, [response, setInsults, setLoadingInsults, setError, API_URL]);

  const commands = useMemo(() => [
    {
      command: 'analyze this chud',
      callback: handleAnalyze,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7
    },
    {
      command: 'generate insults',
      callback: handleGenerateInsults,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7
    }
  ], [handleAnalyze, handleGenerateInsults]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (browserSupportsSpeechRecognition && !listening) {
      // Start listening automatically on component mount
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      }).catch(err => {
        console.error('Error starting speech recognition:', err);
      });
    }
  }, [browserSupportsSpeechRecognition, listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Status: {listening ? 'Listening 🎙️' : 'Stopped'}</p>
      <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>
        Stop
      </button>
      <button onClick={resetTranscript}>
        Reset
      </button>

      <p>Heard: {transcript}</p>
    </div>
  );
}

export default VoiceCommands;
