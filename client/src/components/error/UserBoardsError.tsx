import React from "react";

interface UserBoardsErrorProps {
  error: any;
}

const UserBoardsError = ({ error }: UserBoardsErrorProps) => {
  return (
    <section
      className="ms-center flex w-screen justify-center rounded-lg border bg-card p-4"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <p className="mb-2 text-error-foreground">{"Oops! " + (error.message || "Error while fetching boards")}</p>
    </section>
  );
};

export default UserBoardsError;
