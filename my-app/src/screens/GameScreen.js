import { useEffect, useMemo, useRef, useState } from 'react';
import TraceCanvas from '../components/TraceCanvas';
import WordCard from '../components/WordCard';
import FeedbackBanner from '../components/FeedbackBanner';
import ScoreBar from '../components/ScoreBar';
import ProgressBar from '../components/ProgressBar';
import WORDS from '../data/words';
import { recognizeLetter } from '../utils/letterRecognition';
import { speakLetter, speakWord } from '../utils/speech';
import { playSuccessSound, playRetrySound, playTapSound } from '../utils/sounds';
import './GameScreen.css';

export default function GameScreen({ category, progress, onCorrectAnswer, onMiss, onLevelUp, onBack, wordsPerLevel }) {
  const wordList = useMemo(
    () => (category === 'all' ? WORDS : WORDS.filter((w) => w.category === category)),
    [category]
  );

  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | success | retry
  const [feedbackSeed, setFeedbackSeed] = useState(0);
  const [photoOk, setPhotoOk] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);

  const word = wordList[index % wordList.length];
  const targetChar = word.word[word.missingIndex];

  useEffect(() => {
    setAttempts(0);
    setStatus('idle');
    setPhotoOk(true);
    setShowGuide(false);
    return () => clearTimeout(timeoutRef.current);
  }, [index, category]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const goToNextWord = () => {
    setIndex((i) => i + 1);
  };

  const handleCheck = () => {
    if (!canvasRef.current || !canvasRef.current.hasInk()) return;
    const points = canvasRef.current.getPoints();
    const result = recognizeLetter(points, targetChar);

    if (result.isMatch) {
      setStatus('success');
      setFeedbackSeed((s) => s + 1);
      playSuccessSound();
      speakWord(word.word);
      onCorrectAnswer(word.id);
      const alreadyDone = progress.completedWordIds.includes(word.id);
      const willLevelUp =
        !alreadyDone && (progress.completedWordIds.length + 1) % wordsPerLevel === 0;
      timeoutRef.current = setTimeout(() => {
        if (willLevelUp) {
          onLevelUp();
        } else {
          goToNextWord();
        }
      }, 1400);
    } else {
      setStatus('retry');
      setFeedbackSeed((s) => s + 1);
      playRetrySound();
      onMiss();
      setAttempts((a) => Math.min(a + 1, 2));
      timeoutRef.current = setTimeout(() => {
        canvasRef.current?.clear();
        setStatus('idle');
      }, 1200);
    }
  };

  const handleListen = () => {
    playTapSound();
    speakLetter(targetChar);
  };

  const handleClear = () => {
    playTapSound();
    canvasRef.current?.clear();
  };

  const handleHelp = () => {
    playTapSound();
    setShowGuide(true);
  };

  return (
    <div className="game-screen">
      <div className="game-top-bar">
        <button className="icon-button" onClick={onBack} aria-label="חזרה">
          ↩️
        </button>
        <ScoreBar score={progress.score} streak={progress.streak} level={progress.level} />
      </div>

      <ProgressBar current={progress.completedWordIds.length % wordsPerLevel} total={wordsPerLevel} />

      <div className="game-word-area">
        {photoOk && (
          <div className="game-photo-frame">
            <img
              className="game-photo"
              src={`${process.env.PUBLIC_URL}/images/words/${word.id}.jpg`}
              alt=""
              onError={() => setPhotoOk(false)}
            />
            <span className="game-photo-emoji" aria-hidden="true">
              {word.emoji}
            </span>
          </div>
        )}
        {!photoOk && (
          <div className="game-emoji" aria-hidden="true">
            {word.emoji}
          </div>
        )}

        <WordCard word={word.word} missingIndex={word.missingIndex}>
          <TraceCanvas ref={canvasRef} targetChar={targetChar} hintLevel={attempts} showGuide={showGuide} />
        </WordCard>
      </div>

      <div className="game-feedback-slot">
        <FeedbackBanner status={status} seed={feedbackSeed} />
      </div>

      <div className="game-controls">
        <button className="icon-button" onClick={handleListen} aria-label="השמע">
          🔊
        </button>
        <button
          className={`icon-button ${showGuide ? 'icon-button-active' : ''}`}
          onClick={handleHelp}
          aria-label="עזרה"
        >
          💡
        </button>
        <button className="big-button big-button-primary" onClick={handleCheck}>
          ✓ בדוק
        </button>
        <button className="icon-button" onClick={handleClear} aria-label="נקה">
          🔁
        </button>
      </div>
    </div>
  );
}
