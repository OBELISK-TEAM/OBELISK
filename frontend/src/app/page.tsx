'use client'
const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow p-10">
        <h1>Online Board for Effective Learning, Interaction and Sharing Knowledge</h1>
        <p>We Are The Future...</p>
        <button className="bg-blue-500 text-white rounded-lg p-3">Get Started!</button>
        <div>HOST={process.env.FRONTEND_HOST}</div>
        <div>PORT={process.env.FRONTEND_PORT}</div>
        <div>PORT_LOCAL={process.env.FRONTEND_PORT_LOCAL}</div>
        <div>DB_NAME={process.env.DB_NAME}</div>
      </div>
    </div>
  );
};

export default Home;

