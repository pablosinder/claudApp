import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import GameScreen from './screens/GameScreen';
import LevelCompleteScreen from './screens/LevelCompleteScreen';
import useGameProgress from './hooks/useGameProgress';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('home'); // home | categories | game | levelComplete
  const [category, setCategory] = useState('all');
  const { progress, registerCorrectAnswer, registerMiss, wordsPerLevel } = useGameProgress();

  return (
    <div className="app-shell">
      <div className="app-root" dir="rtl">
        {screen === 'home' && <HomeScreen onStart={() => setScreen('categories')} />}

        {screen === 'categories' && (
          <CategoryScreen
            onSelect={(cat) => {
              setCategory(cat);
              setScreen('game');
            }}
            onBack={() => setScreen('home')}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            category={category}
            progress={progress}
            wordsPerLevel={wordsPerLevel}
            onCorrectAnswer={registerCorrectAnswer}
            onMiss={registerMiss}
            onLevelUp={() => setScreen('levelComplete')}
            onBack={() => setScreen('categories')}
          />
        )}

        {screen === 'levelComplete' && (
          <LevelCompleteScreen level={progress.level} score={progress.score} onContinue={() => setScreen('game')} />
        )}
      </div>
    </div>
  );
}
