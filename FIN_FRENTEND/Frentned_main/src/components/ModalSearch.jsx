import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const modalContent = useRef(null);
  const searchInput = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Close when pressing ESC
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    if (modalOpen) searchInput.current.focus();
  }, [modalOpen]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />

      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg"
        >
          {/* Search */}
          <form className="border-b border-gray-200 dark:border-gray-700/60">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <input
                id={searchId}
                ref={searchInput}
                type="search"
                placeholder="Search financial tools, reports, loans…"
                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-10 pr-4"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute inset-0 right-auto group"
              >
                <svg
                  className="fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 ml-4 mr-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                  <path d="M15.7 14.29L13.31 11.9A8.01 8.01 0 0111.9 13.31l2.39 2.39a1 1 0 001.41-1.41z" />
                </svg>
              </button>
            </div>
          </form>

          {/* finance specific content */}
          <div className="py-4 px-2">
            {/* Recent searches */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                Recent Searches
              </div>
              <ul className="text-sm">
                {[
                  "Loan Application Status",
                  "Customer Ledger - Rajesh Sharma",
                  "Daily Collection Report",
                  "Pending EMI List",
                  "Finance Dashboard",
                ].map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="flex items-center w-full text-left p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    >
                      <svg
                        className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="7" cy="7" r="6" />
                      </svg>
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick finance links */}
            <div>
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                Quick Financial Pages
              </div>
              <ul className="text-sm">
                {[
                  { name: "Loan Management", link: "/loans" },
                  { name: "Customer Profiles", link: "/customers" },
                  { name: "Finance Reports", link: "/reports" },
                  { name: "EMI Calculator", link: "/emi-calculator" },
                  { name: "Expenses & Collections", link: "/collections" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.link}
                      className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                      onClick={() => setModalOpen(false)}
                    >
                      <svg
                        className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <rect x="2" y="2" width="12" height="12" rx="2" />
                      </svg>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;
