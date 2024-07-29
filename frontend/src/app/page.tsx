'use client'

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow p-10">
        <h1>Online Board for Effective Learning, Interaction and Sharing Knowledge</h1>
        <p>We Are The Future...</p>
        <Button onClick={() => console.log(
          {
            "BACKEND_HOST": process.env.BACKEND_HOST,
            "BACKEND_PORT": process.env.BACKEND_PORT,
            "FRONTEND_HOST": process.env.FRONTEND_HOST,
            "FRONTEND_PORT": process.env.FRONTEND_PORT
          })}>Test. Print some env variables in console</Button> {/* TODO: remove later */}
        <button className="bg-blue-500 text-white rounded-lg p-3">Get Started!</button>
      </div>
    </div>
  );
};

export default Home;

