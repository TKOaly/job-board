'use client';

import { PropsWithChildren } from 'react';

export const InnerLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Job Board - TKO-äly</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
