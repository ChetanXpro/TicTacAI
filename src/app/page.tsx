"use client";
import { useEffect, useState } from "react";
import { MOVES, Players } from "./constants/enums";
interface IBox {
  [key: string]: { Player: string | null; Move: MOVES };
}

interface IPlayerHistory {
  [Players.USER]: string[];
  [Players.AI]: string[];
}
export default function Home() {
  const [allBox, setAllBox] = useState<IBox>({
    topLeft: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    topCenter: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    topRight: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    centerLeft: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    center: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    centerRight: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    bottomLeft: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    bottomCenter: {
      Player: null,
      Move: MOVES.EMPTY,
    },
    bottomRight: {
      Player: null,
      Move: MOVES.EMPTY,
    },
  });

  const [playersHistory, setPlayersHistory] = useState<IPlayerHistory>({
    [Players.USER]: [],
    [Players.AI]: [],
  });

  const winningPairs = [
    ["topLeft", "topCenter", "topRight"],
    ["centerLeft", "center", "centerRight"],
    ["bottomLeft", "bottomCenter", "bottomRight"],
    ["topLeft", "centerLeft", "bottomLeft"],
    ["topCenter", "center", "bottomCenter"],
    ["topRight", "centerRight", "bottomRight"],
    ["topLeft", "center", "bottomRight"],
    ["topRight", "center", "bottomLeft"],
  ];

  const handleUpdateMove = (positionName: string, player: string) => {
    setAllBox((prev) => {
      return {
        ...prev,
        [positionName]: {
          Move: player === Players.USER ? MOVES.O : MOVES.X,
          Player: player,
        },
      };
    });
    setPlayersHistory((prev) => {
      return {
        ...prev,
        [player]: [
          ...prev[player as keyof typeof playersHistory],
          positionName,
        ],
      };
    });
  };

  const getPositionStyle = (positionName: string) => {
    console.log("po", positionName);

    switch (positionName) {
      case "topLeft":
        return "border-r-2 border-b-2";
      case "topCenter":
        return "border-r-2 border-b-2 border-l-2";
      case "topRight":
        return "border-l-2 border-b-2";
      case "centerLeft":
        return "border-r-2 border-b-2 border-t-2";
      case "center":
        return "border-r-2 border-b-2 border-t-2 border-l-2";
      case "centerRight":
        return "border-l-2 border-b-2 border-t-2";
      case "bottomLeft":
        return "border-r-2 border-t-2";
      case "bottomCenter":
        return "border-r-2 border-t-2 border-l-2";
      case "bottomRight":
        return "border-l-2 border-t-2";
      default:
        return "";
    }
  };
  return (
    <main className="flex min-h-screen flex-col   items-center justify-center">
      <div className="  grid grid-cols-3">
        {Object.keys(allBox).map((positionName, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                handleUpdateMove(positionName, Players.USER);
              }}
              className={`flex flex-row w-32 h-32 items-center justify-center border-white cursor-pointer ${getPositionStyle(
                positionName
              )}`}
            >
              {allBox[positionName].Move === MOVES.EMPTY ? (
                ""
              ) : allBox[positionName].Move === MOVES.X ? (
                <span className="text-4xl font-extrabold">X</span>
              ) : (
                <span className="text-[4rem] font-semibold">O</span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
