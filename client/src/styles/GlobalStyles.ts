import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.accent};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Link reset */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    background: ${props => props.theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    color: ${props => props.theme.colors.primary};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    color: ${props => props.theme.colors.text};
  }

  p {
    margin-bottom: 1em;
    color: ${props => props.theme.colors.textSecondary};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 20px ${props => props.theme.colors.primary}40;
    }
    to {
      box-shadow: 0 0 30px ${props => props.theme.colors.primary}60;
    }
  }

  /* Utility classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: ${props => props.theme.spacing.sm};
  }

  .gap-md {
    gap: ${props => props.theme.spacing.md};
  }

  .gap-lg {
    gap: ${props => props.theme.spacing.lg};
  }

  .mb-sm {
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  .mb-md {
    margin-bottom: ${props => props.theme.spacing.md};
  }

  .mb-lg {
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  .mt-sm {
    margin-top: ${props => props.theme.spacing.sm};
  }

  .mt-md {
    margin-top: ${props => props.theme.spacing.md};
  }

  .mt-lg {
    margin-top: ${props => props.theme.spacing.lg};
  }

  .p-sm {
    padding: ${props => props.theme.spacing.sm};
  }

  .p-md {
    padding: ${props => props.theme.spacing.md};
  }

  .p-lg {
    padding: ${props => props.theme.spacing.lg};
  }

  .rounded {
    border-radius: ${props => props.theme.borderRadius.md};
  }

  .rounded-lg {
    border-radius: ${props => props.theme.borderRadius.lg};
  }

  .shadow {
    box-shadow: ${props => props.theme.shadows.md};
  }

  .shadow-lg {
    box-shadow: ${props => props.theme.shadows.lg};
  }

  .shadow-neon {
    box-shadow: ${props => props.theme.shadows.neon};
  }

  .animate-fadeIn {
    animation: ${props => props.theme.animations.fadeIn};
  }

  .animate-slideUp {
    animation: ${props => props.theme.animations.slideUp};
  }

  .animate-pulse {
    animation: ${props => props.theme.animations.pulse};
  }

  .animate-glow {
    animation: ${props => props.theme.animations.glow};
  }
`;
