import React from 'react';
import { Wrapper } from './Wrapper';
import { NavBar } from './NavBar';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};
