import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login screen when not authenticated', () => {
  render(<App />);
  // Not logged in → redirected to /login, which shows the "Log in" button.
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});
