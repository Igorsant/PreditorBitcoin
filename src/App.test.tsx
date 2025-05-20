import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './App';
import '../tests/setup.ts';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Example: check for a heading or text in your App component
    // Replace 'Welcome' with actual text from your App
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });
});