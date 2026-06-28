import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Crewbridge heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Crewbridge' })).toBeInTheDocument();
});
