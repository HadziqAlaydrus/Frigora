import React from "react";
import { Link } from "react-router-dom";

const CreateButton = () => {
  return (
    <section>
      <div className="flex justify-end px-4 py-4">
        <Link
          to="/form"
          className="flex gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base lg:text-lg font-semibold px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
        <span>Create</span><span>Storage</span>
        </Link>
      </div>
    </section>
  );
};

export default CreateButton;
