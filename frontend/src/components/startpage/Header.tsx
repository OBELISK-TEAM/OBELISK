import React from 'react';
import Image from 'next/image';
const Header: React.FC = () => {

  const largeInitial = "text-6xl ";

  return (
    <header className="w-full h-[90vh] text-palette1-creme-light text-3xl tracking-widest p-8 flex flex-row items-center justify-center gap-[3em]" style={{letterSpacing: "4px"}}>
      <div className="w-[50%] flex flex-row-reverse">
        <Image src="/images/best-logo.png" alt="Obelisk Logo" width={200} height={300} />
      </div>
      <div className="w-[50%] ml-5 space-y-3 relative top-6">
        <p><span className={largeInitial}>O</span>NLINE</p>
        <p><span className={largeInitial}>B</span>OARD FOR</p>
        <p><span className={largeInitial}>E</span>FFECTIVE</p>
        <p><span className={largeInitial}>L</span>EARNIG,</p>
        <p><span className={largeInitial}>I</span>NTERACTION AND</p>
        <p><span className={largeInitial}>S</span>HARING</p>
        <p><span className={largeInitial}>K</span>NOWLEDGE</p>
      </div>
    </header>
  );
};

export default Header;
