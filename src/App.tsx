import React, { useState, useEffect } from "react";
import { RsvpService } from "./services/RsvpService";
import { ConsoleLogger } from "./services/ConsoleLogger";
import { Player, RsvpStatus } from "./services/types";
import ReactDOM from "react-dom";
import "./styles/App.css";

// Modal component that uses portal
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
    { id: "4", name: "Sarah Williams" },
    { id: "5", name: "Michael Brown" },
  ]);
  const [rsvpService] = useState(() => new RsvpService(new ConsoleLogger()));
  const [newPlayerName, setNewPlayerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with some sample data
    players.forEach((player, index) => {
      if (index === 0) rsvpService.addOrUpdateRsvp(player, "Yes");
      else if (index === 1) rsvpService.addOrUpdateRsvp(player, "No");
      else if (index === 2) rsvpService.addOrUpdateRsvp(player, "Maybe");
    });

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle body class for modal
  useEffect(() => {
    if (pendingDeleteId) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [pendingDeleteId]);

  const handleRsvpChange = (playerId: string, status: RsvpStatus) => {
    const player = players.find((p) => p.id === playerId);
    if (player) {
      rsvpService.addOrUpdateRsvp(player, status);
      setPlayers([...players]); // Trigger re-render
    }
  };

  const getPlayerStatus = (playerId: string): RsvpStatus | undefined => {
    const rsvp = rsvpService.getRsvpForPlayer(playerId);
    return rsvp?.status;
  };

  const addNewPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: (players.length + 1).toString(),
        name: newPlayerName.trim(),
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setShowAddForm(false);
    }
  };

  const handleBulkAction = (status: RsvpStatus) => {
    selectedPlayers.forEach((id) => {
      const player = players.find((p) => p.id === id);
      if (player) {
        rsvpService.addOrUpdateRsvp(player, status);
      }
    });
    setPlayers([...players]); // Trigger re-render
    setSelectedPlayers([]);
  };

  const toggleSelectPlayer = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const selectAllPlayers = () => {
    if (selectedPlayers.length === filteredPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filteredPlayers.map((p) => p.id));
    }
  };

  const deletePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
    setPendingDeleteId(null);
  };

  const stats = rsvpService.getRsvpStats();
  const confirmedAttendees = rsvpService.getConfirmedAttendees();

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusEmoji = (status?: RsvpStatus): string => {
    if (!status) return "❓";
    return status === "Yes" ? "✅" : status === "No" ? "❌" : "🤔";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      <div className="max-w-5xl mx-auto p-6">
        <header className="text-center mb-12 pt-8 relative">
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
          <h1
            className={`text-4xl font-bold ${
              darkMode
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
            } mb-2 animate-fadeIn`}
          >
            Team RSVP Manager
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Track your team's attendance in style
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } font-medium`}
              >
                Total
              </h3>
              <span className="text-blue-500 text-2xl">👥</span>
            </div>
            <p
              className={`text-4xl font-bold mt-2 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {stats.total}
            </p>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } font-medium`}
              >
                Confirmed
              </h3>
              <span className="text-green-500 text-2xl">✅</span>
            </div>
            <p
              className={`text-4xl font-bold mt-2 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {stats.confirmed}
            </p>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } font-medium`}
              >
                Declined
              </h3>
              <span className="text-red-500 text-2xl">❌</span>
            </div>
            <p
              className={`text-4xl font-bold mt-2 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {stats.declined}
            </p>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } font-medium`}
              >
                Maybe
              </h3>
              <span className="text-yellow-500 text-2xl">🤔</span>
            </div>
            <p
              className={`text-4xl font-bold mt-2 ${
                darkMode ? "text-yellow-400" : "text-yellow-500"
              }`}
            >
              {stats.maybe}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player List Section */}
          <div className="lg:col-span-2">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 mb-8`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Players
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2 ${
                    darkMode
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white rounded-lg shadow transition-colors`}
                >
                  {showAddForm ? "Cancel" : "Add Player"}
                </button>
              </div>

              {/* Search and Add Form */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "border-gray-300 placeholder-gray-500"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10`}
                  />
                  <svg
                    className={`absolute left-3 top-3.5 h-5 w-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {showAddForm && (
                  <div className="flex mb-4 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Enter player name"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className={`flex-1 px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "border-gray-300 placeholder-gray-500"
                      } rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <button
                      onClick={addNewPlayer}
                      className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Bulk Actions */}
                {selectedPlayers.length > 0 && (
                  <div
                    className={`flex justify-between items-center p-3 ${
                      darkMode ? "bg-gray-700" : "bg-indigo-50"
                    } rounded-lg mb-4 animate-fadeIn`}
                  >
                    <div
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium">
                        {selectedPlayers.length}
                      </span>{" "}
                      players selected
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("Yes")}
                        className="min-w-[60px] px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        All Yes
                      </button>
                      <button
                        onClick={() => handleBulkAction("Maybe")}
                        className="min-w-[60px] px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        All Maybe
                      </button>
                      <button
                        onClick={() => handleBulkAction("No")}
                        className="min-w-[60px] px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        All No
                      </button>
                      <button
                        onClick={() => setSelectedPlayers([])}
                        className={`min-w-[60px] px-3 py-1 ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-400 hover:bg-gray-500"
                        } text-white rounded-lg text-sm`}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Player List */}
              <div
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredPlayers.length > 0 ? (
                  <>
                    <div className="pb-2 flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={
                          selectedPlayers.length === filteredPlayers.length &&
                          filteredPlayers.length > 0
                        }
                        onChange={selectAllPlayers}
                      />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Select All
                      </span>
                    </div>

                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`py-4 flex flex-col md:flex-row md:items-center md:justify-between transform transition-all duration-200 ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        } rounded-lg p-2 ${
                          selectedPlayers.includes(player.id)
                            ? darkMode
                              ? "bg-gray-700"
                              : "bg-indigo-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center mb-3 md:mb-0">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                            checked={selectedPlayers.includes(player.id)}
                            onChange={() => toggleSelectPlayer(player.id)}
                          />
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                            {player.name.charAt(0)}
                          </div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {player.name}
                          </span>
                          <span
                            className="ml-3 text-lg"
                            title={
                              getPlayerStatus(player.id) || "Not responded"
                            }
                          >
                            {getStatusEmoji(getPlayerStatus(player.id))}
                          </span>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <button
                            onClick={() => handleRsvpChange(player.id, "Yes")}
                            className={`min-w-[60px] px-4 py-2 rounded-lg transition-all duration-200 ${
                              getPlayerStatus(player.id) === "Yes"
                                ? "bg-green-500 text-white shadow-md"
                                : `${
                                    darkMode
                                      ? "bg-gray-700 text-gray-300 hover:bg-green-800"
                                      : "bg-gray-100 text-gray-700 hover:bg-green-100"
                                  }`
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleRsvpChange(player.id, "Maybe")}
                            className={`min-w-[60px] px-4 py-2 rounded-lg transition-all duration-200 ${
                              getPlayerStatus(player.id) === "Maybe"
                                ? "bg-yellow-500 text-white shadow-md"
                                : `${
                                    darkMode
                                      ? "bg-gray-700 text-gray-300 hover:bg-yellow-800"
                                      : "bg-gray-100 text-gray-700 hover:bg-yellow-100"
                                  }`
                            }`}
                          >
                            Maybe
                          </button>
                          <button
                            onClick={() => handleRsvpChange(player.id, "No")}
                            className={`min-w-[60px] px-4 py-2 rounded-lg transition-all duration-200 ${
                              getPlayerStatus(player.id) === "No"
                                ? "bg-red-500 text-white shadow-md"
                                : `${
                                    darkMode
                                      ? "bg-gray-700 text-gray-300 hover:bg-red-800"
                                      : "bg-gray-100 text-gray-700 hover:bg-red-100"
                                  }`
                            }`}
                          >
                            No
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(player.id)}
                            className={`p-2 rounded-full ${
                              darkMode
                                ? "hover:bg-gray-600"
                                : "hover:bg-red-100"
                            }`}
                            title="Delete player"
                          >
                            <svg
                              className="w-5 h-5 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          {/* Delete Confirmation Modal */}
                          {pendingDeleteId === player.id && (
                            <Modal onClose={() => setPendingDeleteId(null)}>
                              <div
                                className={`${
                                  darkMode ? "bg-gray-800" : "bg-white"
                                } rounded-lg p-6 shadow-xl animate-scaleIn`}
                              >
                                <h3
                                  className={`text-lg font-bold mb-4 ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  Delete Player
                                </h3>
                                <p
                                  className={`mb-6 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  Are you sure you want to delete {player.name}?
                                  This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => setPendingDeleteId(null)}
                                    className={`px-4 py-2 rounded-lg ${
                                      darkMode
                                        ? "bg-gray-700 hover:bg-gray-600"
                                        : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => deletePlayer(player.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </Modal>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    className={`py-8 text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No players match your search
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmed Attendees Section */}
          <div className="lg:col-span-1">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 sticky top-6`}
            >
              <h2
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                } mb-6 flex items-center`}
              >
                <span className="text-green-500 mr-2">✅</span>
                Confirmed Attendees
              </h2>
              <div className="space-y-3">
                {confirmedAttendees.length > 0 ? (
                  confirmedAttendees.map((attendee) => (
                    <div
                      key={attendee.player.id}
                      className={`p-4 ${
                        darkMode
                          ? "bg-green-900 border-green-700"
                          : "bg-green-50 border-green-500"
                      } rounded-lg flex items-center border-l-4 transform transition-all duration-200 hover:scale-102 hover:shadow-sm`}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3 text-sm">
                        {attendee.player.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {attendee.player.name}
                        </div>
                        <div
                          className={`text-xs ${
                            darkMode ? "text-green-200" : "text-gray-500"
                          }`}
                        >
                          Confirmed{" "}
                          {new Date(attendee.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`p-6 text-center ${
                      darkMode
                        ? "text-gray-400 bg-gray-700"
                        : "text-gray-500 bg-gray-50"
                    } rounded-lg`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-12 w-12 mx-auto mb-4 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p>No confirmed attendees yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer
          className={`mt-12 py-6 text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          } text-sm`}
        >
          <p>© {new Date().getFullYear()} Gametime Hero — Team RSVP Manager</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
