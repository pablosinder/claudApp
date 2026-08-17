import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home screen start button', () => {
  render(<App />);
  const startButton = screen.getByText(/בואו נשחק/i);
  expect(startButton).toBeInTheDocument();
});
