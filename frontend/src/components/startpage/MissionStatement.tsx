import React from "react";
import styles from './startpage.module.css'
const MissionStatement: React.FC = () => {
  return (
    <section className="py-8 px-4 min-h-[90vh] relative  text-xl  bg-palette1-blue flex flex-col justify-center lg:clip-mission-statement">
      <div className="lg:w-7/12 md:w-55 relative z-10 flex flex-col gap-4 text-palette1-cream-template1">
        <h2 className={`${styles['styled-h1']} text-5xl font-semibold`}>We Are The Future</h2>
        <p className="mb-5 leading-9">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commod. Vivamus tincidunt libero sodales nulla pretium
          euismod. Fusce interdum commodo lacus eu facilisis. Curabitur quis
          ultrices risus, eu porttitor diam. Etiam a elementum neque. Vivamus tincidunt libero sodales nulla pretium
          euismod. Fusce interdum commodo lacus eu facilisis. 
        </p>
      </div>
    </section>
  );
};

export default MissionStatement;
