import web3 from "./web3";

const address = "0xA4a72F92Ba03989eA568c0b455a810B663E52243";
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "room",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "booker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum RoomBooking.Company",
        "name": "company",
        "type": "uint8"
      }
    ],
    "name": "BookedRoom",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "room",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "booker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum RoomBooking.Company",
        "name": "company",
        "type": "uint8"
      }
    ],
    "name": "CanceledReservation",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_roomNumber",
        "type": "uint8"
      },
      {
        "internalType": "enum RoomBooking.Company",
        "name": "company",
        "type": "uint8"
      }
    ],
    "name": "bookRoom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancelReservation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_roomNumber",
        "type": "uint8"
      }
    ],
    "name": "getRoomUsers",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "bookedAt",
            "type": "uint32"
          }
        ],
        "internalType": "struct RoomBooking.UserData[]",
        "name": "roomUsers",
        "type": "tuple[]"
      },
      {
        "internalType": "uint8",
        "name": "userCount",
        "type": "uint8"
      },
      {
        "internalType": "enum RoomBooking.Company",
        "name": "company",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "getUserRoom",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "bookedAt",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default new web3.eth.Contract(abi, address);
