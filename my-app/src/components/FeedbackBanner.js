import './FeedbackBanner.css';

const SUCCESS_MESSAGES = ['מעולה! 🎉', 'כל הכבוד! ⭐', 'איזה יופי! 🌟', 'נכון מאוד! 🥳'];
const RETRY_MESSAGES = ['כמעט! נסה שוב 💪', 'עוד ניסיון קטן! 😊', 'אתה כמעט שם! ✨'];

function pickMessage(list, seed) {
  return list[seed % list.length];
}

export default function FeedbackBanner({ status, seed = 0 }) {
  if (status === 'idle') return null;

  const isSuccess = status === 'success';
  const message = isSuccess ? pickMessage(SUCCESS_MESSAGES, seed) : pickMessage(RETRY_MESSAGES, seed);

  return (
    <div className={`feedback-banner ${isSuccess ? 'feedback-success' : 'feedback-retry'}`}>
      <span className="feedback-emoji">{isSuccess ? '🎉' : '🙂'}</span>
      <span>{message}</span>
    </div>
  );
}
