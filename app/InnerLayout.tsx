'use client';

import { PropsWithChildren } from 'react';

export const InnerLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};
