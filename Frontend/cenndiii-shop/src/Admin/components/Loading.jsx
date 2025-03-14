import { React } from "react";
import { PacmanLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="mt-0 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 !m-0" >
          <PacmanLoader color="#ffffff" size={60} />
        </div>
    );
}