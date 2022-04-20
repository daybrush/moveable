import { configure } from '@storybook/react';
// automatically import all files ending in *.stories.tsx
configure(require.context('../stories', true, /\.stories\.(tsx|js|jsx|ts)?$/), module)