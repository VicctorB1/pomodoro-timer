import { useState, useEffect, useRef } from 'react';
import Button from './components/Button';

const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

function App() {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeLeft(MODES[mode]);
    stopTimer();
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          playSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(MODES[mode]);
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error('Audio error:', err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm text-center space-y-10">
        {/* Modos */}
        <div className="flex justify-center gap-2">
          {(['focus', 'short', 'long'] as const).map((item) => (
            <Button
              key={item}
              className={`text-2xl px-4 py-2 border transition rounded ${mode === item ? 'border-blue-500 text-blue-500' : 'border-transparent hover:border-blue-500 hover:text-blue-500'}`}
              title={item}
              onClick={() => setMode(item)}
            >
              {item === 'focus' ? '🧠' : item === 'short' ? '☕' : '💤'}
            </Button>
          ))}
        </div>

        {/* Timer */}
        <h1 className="text-7xl font-light tracking-tight">
          {formatTime(minutes)}:{formatTime(seconds)}
        </h1>

        {/* Ações */}
        <div className="flex justify-center gap-2">
          <Button
            className="text-2xl px-6 py-2 border border-transparent hover:border-green-500 hover:text-green-500 transition rounded"
            title={isRunning ? 'Pause' : 'Start'}
            onClick={toggleTimer}
          >
            {isRunning ? '⏸️' : '▶️'}
          </Button>
          <Button
            className="text-2xl px-6 py-2 border border-transparent hover:border-yellow-500 hover:text-yellow-500 transition rounded"
            title="Reset"
            onClick={resetTimer}
          >
            🔄
          </Button>
        </div>

        {/* Áudio */}
        <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
      </div>
    </div>
  );
}

export default App;
