import React from "react";

import Image from "next/image";
import styles from './start.module.css'
const NextSteps: React.FC = () => {
  return (
    <section className="min-h-[90vh] text-xl overflow-auto relative p-4 text-palette1-creme-light bg-palette1-darkest-blue-template1  flex justify-center text-right items-center lg:bottom-[240px] lg:clip-next-steps">
      <div className="absolute inset-0 opacity-25 object-cover">
        <Image
          src="https://picsum.photos/1280/720?random=5"
          alt="Background"
          fill={true}
        />
      </div>
      <div className="flex-grow"></div>{" "}
      
      <div className="relative lg:top-40 flex-grow-0 lg:basis-6/12 flex flex-col gap-4 ">
       
        
        <h2 className={`${styles['styled-h1']} text-left text-5xl font-semibold`}>Our Next Steps</h2>
        <p className="text-left mb-5 leading-9" style={{ letterSpacing: "1.2px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commod. Vivamus tincidunt libero sodales nulla pretium
          euismod. Fusce interdum commodo lacus eu facilisis.{" "}
        </p>
      </div>
    </section>
  );
};

export default NextSteps;
