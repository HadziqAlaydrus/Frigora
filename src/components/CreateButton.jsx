import React from "react";
import { Link } from "react-router-dom";

const CreateButton = () => {
  return (
    <section>
      <div className="flex justify-end p-4">
        <button className="btn btn-xs border-3 rounded-lg border-gray-700 dark:border-gray-200 sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
          <Link to="/form">Create Storage</Link>
        </button>
      </div>
    </section>
  );
};

export default CreateButton;
