import { useEffect, useState } from "react";
import roomBooking from "./roomBooking";
import web3 from "./web3";
import moment from "moment";

const COMPANIES = ["COKE", "PEPSI"];

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [bookedRoomNumber, setBookedRoomNumber] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [formValues, setFormValues] = useState({
    roomNumber: 1,
    company: 0,
  });

  const setCurrentAccountAddr = async () => {
    const newAccounts = await web3.eth.getAccounts();
    setCurrentAccount(newAccounts[0]);
  };

  const initEvents = () => {
    window.ethereum.on("accountsChanged", () => {
      setCurrentAccountAddr();
    });
  };
  
  const loadRooms = async () => {
    // get rooms available
    try {
      let newRooms = [];
      for (let i = 0; i < 20; i++) {
        const roomInfo = await roomBooking.methods.getRoomUsers(i).call();
        newRooms.push(roomInfo);
      }
      setRooms(newRooms);
    } catch (err) {}
  };

  useEffect(() => {
    setCurrentAccountAddr();
    loadRooms();
  }, []);

  useEffect(() => {
    if (!currentAccount) return;
    const loadBookedStatus = async () => {
      // check if current user booked a room or not
      try {
        const roomNumber = await roomBooking.methods
          .getUserRoom(currentAccount)
          .call();
        setBookedRoomNumber(roomNumber);
      } catch (err) {}
    };
    loadBookedStatus();
  }, [currentAccount]);

  useEffect(() => {
    initEvents();
  }, [rooms]);

  const cancelReservation = async () => {
    try {
      await roomBooking.methods.cancelReservation().send({
        from: currentAccount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const bookRoom = async () => {
    try {
      await roomBooking.methods
        .bookRoom(formValues.roomNumber, formValues.company)
        .send({
          from: currentAccount,
        });
    } catch (err) {
      console.log(err);
    }
  };

  const renderRooms = () => {
    let companyInfo = [
      { roomCount: 0, userCount: 0 },
      { roomCount: 0, userCount: 0 },
    ];

    const roomsResult = rooms.map((roomItem, index) => {
      const room = {
        company: Number(roomItem.company),
        userCount: Number(roomItem.userCount),
        roomUsers: roomItem.roomUsers,
      };
      if (room.userCount > 0) {
        companyInfo[room.company].roomCount++;
        companyInfo[room.company].userCount += room.userCount;
      }
      return (
        <div
          className={`drop-shadow-md rounded mb-3 ${
            room.userCount === 0
              ? "bg-gray-300"
              : room.company === 0
              ? "bg-rose-900 text-white/90"
              : "bg-sky-600 text-white/90"
          }`}
          key={index}
        >
          <div className="border-b border-gray-100 pt-2 pb-1 px-3 flex justify-between items-end">
            <span className="font-bold">Room #{index + 1}</span>
            <span className="text-sm">
              {room.userCount > 0
                ? `${COMPANIES[room.company]} ${room.userCount} user${
                    room.userCount > 1 ? "s" : ""
                  }`
                : "Not booked yet"}
            </span>
          </div>
          <div className="">
            {room.roomUsers.map((roomUser) => (
              <div
                className="px-3 py-2 flex flex-col md:flex-row justify-between text-ellipsis"
                key={roomUser.userAddress}
              >
                <span className="text-ellipsis">{roomUser.userAddress}</span>
                <span>
                  (Booked at{" "}
                  {moment(Number(roomUser.bookedAt) * 1000).format(
                    "HH:mm, YYYY.MM.DD"
                  )}
                  )
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="grid md:grid-cols-2 mb-2 gap-2 text-white" key="companyData">
          <div className="bg-rose-900 py-2 px-3 rounded">
            <span className="font-bold">COKE:</span> {companyInfo[0].roomCount}{" "}
            rooms, {companyInfo[0].userCount} users
          </div>

          <div className="bg-sky-600 py-2 px-3 rounded">
            <span className="font-bold">PEPSI:</span> {companyInfo[1].roomCount}{" "}
            rooms, {companyInfo[1].userCount} users
          </div>
        </div>

        {rooms.length === 0 && "Loading..."}
        {roomsResult}
      </>
    );
  };

  return (
    <div className="mx-10">
      <div className="max-w-2xl mt-10 mx-auto">
        <div className="flex items-center justify-between">
          <input
            type="number"
            className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 mr-2"
            placeholder="Room number"
            disabled={bookedRoomNumber}
            value={bookedRoomNumber || formValues.roomNumber}
            min={1}
            max={20}
            onChange={(e) =>
              setFormValues({ ...formValues, roomNumber: e.target.value })
            }
          />

          <select
            className="shadow border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 mr-2"
            disabled={bookedRoomNumber}
            value={formValues.company}
            onChange={(e) =>
              setFormValues({ ...formValues, company: e.target.value })
            }
          >
            <option value={0}>COKE</option>
            <option value={1}>PEPSI</option>
          </select>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-none"
            type="button"
            onClick={() =>
              bookedRoomNumber ? cancelReservation() : bookRoom()
            }
          >
            {bookedRoomNumber ? "Cancel Reservation" : "Book Room"}
          </button>
        </div>

        <hr className="my-2" />

        {renderRooms()}
      </div>
    </div>
  );
}

export default App;
