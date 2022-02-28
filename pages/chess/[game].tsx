import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext, NextPage } from "next";

interface ChessBoardProps {
  state?: any;
}



declare global {
  namespace JSX {
    interface IntrinsicElements {
      "chess-board": any;
    }
  }
}

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
  const baseUrl = process.env.API_BASE_URL;
  const { game } = params;

  // get current game state
  // get legal moves
  const response = await fetch(`${baseUrl}/game/${game}`);

  const state = await response.json();

  // TODO: pull game state from our chess API...
  return {
    props: {
      state,
    }, // will be passed to the page component as props
  };
}

const ChessBoard: NextPage<ChessBoardProps> = ({ state }) => {
  const { query } = useRouter();
  const { game, token } = query;
  const [moved, setMoved] = useState(false);
  const [error, setError] = useState(undefined);
  const board = useRef(null);

  useEffect(() => {
    // we only need the chess board element client side
    import("chessboard-element");
  }, []);

  useEffect(() => {
    board.current.addEventListener("drop", async (e) => {
      const { source, target, setAction } = e.detail;
      const { moves } = state;

      const to = moves.find(({ from, to }) => from === source && to === target);

      if (!to) {
        setAction("snapback");
      } else {
        // send move update to the server
        const resp = await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify({ game: game, token, from: source, to: target }),
        });
        if (resp.status === 200) {
          setMoved(true);
        } else {
          console.error(await resp.json())
          setError("could not make move, your token may be invalid!");
          board.current.setPosition(state.fen)
        }
      }
    });

    board.current.addEventListener("drag-start", (e) => {
      const { source } = e.detail;

      const { moves } = state;

      const move = moves.find(({ from }) => source === from);

      if (!move) {
        e.preventDefault();
      }
    });
  }, [board]);

  return !moved ? (
      <div style={{ height: '100vh', margin: 'auto', maxWidth: 800 }}>
        {
          error 
          ? <span>{error}</span>
          : null
        }
        <chess-board
          ref={board}
          position={state.fen}
          draggable-pieces
        ></chess-board>
      </div>
  ) : (
    <div>Thanks for making your move</div>
  );
};

export default ChessBoard;
