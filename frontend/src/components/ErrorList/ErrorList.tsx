import React from "react";

interface ErrorListProps {
  error: string[] | null;
}

const ErrorList: React.FC<ErrorListProps> = ({ error }) => {
  if (!error || !Array.isArray(error)) {
    return null;
  }

  return (
    <ol className="list-disc text-red-500 text-sm">
      {error.map((errMsg, index) => (
        <li key={index}>{errMsg}</li>
      ))}
    </ol>
  );
};

export default ErrorList;
