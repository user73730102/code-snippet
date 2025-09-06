import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form by default', () => {
  // Step 1: Render the App component
  render(<App />);
  
  // Step 2: Look for an element that we know should be on the page
  const headingElement = screen.getByText(/Code Snippet Viewer/i);
  
  // Step 3: Assert that the element was actually found in the document
  expect(headingElement).toBeInTheDocument();
});