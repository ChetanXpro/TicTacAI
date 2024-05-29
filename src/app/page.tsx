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

const initialBox: IBox = {
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
};
export default function Home() {
  const [allBox, setAllBox] = useState<IBox>(initialBox);
  const [winner, setWinner] = useState<Players | null>(null);

  const [playersHistory, setPlayersHistory] = useState<IPlayerHistory>({
    [Players.USER]: [],
    [Players.AI]: [],
  });

  const [isAiTurn, setIsAiTurn] = useState(false);

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

    if (player === Players.USER && winner == null) {
      setIsAiTurn(true);
    }
  };

  const checkWinner = (player: Players) => {
    const history = playersHistory[player];

    const hasWon = winningPairs.some((pair) => {
      return pair.every((p) => history.includes(p));
    });
    if (hasWon) {
      console.log(player, "Won");
      setWinner(player);

      return true;

      // alert(`${player} Won`);
      // setAllBox(initialBox);
      // setPlayersHistory({} as IPlayerHistory);
    }
  };
  useEffect(() => {
    const isWinner = checkWinner(Players.USER);

    if (isWinner) {
      return;
    }

    if (isAiTurn) {
      getAIresponse().then((res) => {
        console.log("AI RESPONSE", res);

        const aiMove = JSON.parse(res.choices[0].message.content).move;

        console.log("AIMOVE", aiMove);

        handleUpdateMove(aiMove, Players.AI);
        checkWinner(Players.AI);
        setIsAiTurn(false);
      });
    }
  }, [playersHistory]);

  const getPositionStyle = (positionName: string) => {
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

  const getAIresponse = async () => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          allBox,
        }),
      });

      return res.json();
    } catch (error) {
      console.log(error);
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
                if (isAiTurn || winner) return;
                handleUpdateMove(positionName, Players.USER);
              }}
              className={`flex flex-row w-32 h-32 items-center justify-center border-white ${
                isAiTurn || winner ? "cursor-not-allowed" : "cursor-pointer"
              } ${getPositionStyle(positionName)}`}
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
      <div className="flex flex-col h-20  items-center justify-center gap-3">
        {/* <div className="mt-10 border p-2 ">
          Turn: {isAiTurn ? "AI" : "User"}
        </div> */}

        <p>{isAiTurn ? "AI is thinking..." : ""}</p>
        <p>{winner ? `${winner} Won` : ""}</p>
      </div>
    </main>
  );
}
