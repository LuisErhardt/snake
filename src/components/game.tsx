import * as React from "react";
import { initGrid, randomAntPosition } from "./util";

enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

export interface IGameProps {}

export interface IGameState {
  grid: boolean[][];
  snake: { x: number; y: number }[];
  ant: { x: number; y: number };
  direction: Direction;
  gameStarted: boolean;
  delay: number;
}

const SIZE = 16;

const initSnake = [
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
];

const initialGrid = initGrid(SIZE);

export default class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);

    this.state = {
      grid: initialGrid.map((a) => [...a]),
      // Last entry of snake is head (length-1)
      snake: JSON.parse(JSON.stringify(initSnake)),
      ant: randomAntPosition(SIZE),
      direction: Direction.RIGHT,
      gameStarted: false,
      delay: 300,
    };
    this.move = this.move.bind(this);
    this.checkKey = this.checkKey.bind(this);
  }

  componentDidMount(): void {
    this.updateGrid();
    setInterval(this.move, this.state.delay);
    document.onkeydown = this.checkKey;
  }

  checkKey(e: KeyboardEvent) {
    e = e || window.event;

    if (this.state.gameStarted) {
      if (e.key === "ArrowUp") {
        this.setState({ direction: Direction.UP }, () => this.move());
      } else if (e.key === "ArrowDown") {
        console.log(e.key);
        this.setState({ direction: Direction.DOWN }, () => this.move());
      } else if (e.key === "ArrowLeft") {
        console.log(e.key);
        this.setState({ direction: Direction.LEFT }, () => this.move());
      } else if (e.key === "ArrowRight") {
        console.log(e.key);
        this.setState({ direction: Direction.RIGHT }, () => this.move());
      }
    }
  }

  initGame() {
    this.setState(
      {
        grid: initialGrid.map((a) => [...a]),
        snake: JSON.parse(JSON.stringify(initSnake)),
        direction: Direction.RIGHT,
      },
      () => this.updateGrid()
    );
  }

  move() {
    if (this.state.gameStarted) {
      let newSnake: { x: number; y: number }[] = JSON.parse(JSON.stringify(this.state.snake));
      const head: { x: number; y: number } = newSnake[newSnake.length - 1];
      const ant = this.state.ant;

      let futureHead: any = undefined;

      switch (this.state.direction) {
        case Direction.RIGHT:
          futureHead = { x: head.x + 1, y: head.y };
          break;
        case Direction.LEFT:
          futureHead = { x: head.x - 1, y: head.y };
          break;
        case Direction.UP:
          futureHead = { x: head.x, y: head.y - 1 };
          break;
        case Direction.DOWN:
          futureHead = { x: head.x, y: head.y + 1 };
          break;
      }

      let hitSnake = false;

      // check if snake hits itself
      newSnake.forEach((elem) => {
        if (elem.x === futureHead.x && elem.y === futureHead.y) {
          hitSnake = true;
        }
      });

      newSnake.push(futureHead);

      // check if snake eats an ant
      if (futureHead.x !== ant.x || futureHead.y !== ant.y) {
        newSnake = newSnake.slice(1);
      } else {
        this.setState({ ant: randomAntPosition(SIZE), delay: this.state.delay - 20 });
      }

      // check if snake head hits a border
      if (futureHead.y <= SIZE - 1 && futureHead.y >= 0 && futureHead.x <= SIZE - 1 && futureHead.x >= 0 && !hitSnake) {
        this.setState({ snake: newSnake }, () => {
          this.updateGrid();
        });
      } else {
        this.setState({ gameStarted: false });
        this.initGame();
      }
    }
  }

  updateGrid() {
    const grid = initialGrid.map((a) => [...a]);
    this.state.snake.forEach((elem) => {
      grid[elem.y][elem.x] = true;
    });
    this.setState({ grid: grid });
  }

  public render() {
    const head: { x: number; y: number } = this.state.snake[this.state.snake.length - 1];
    const roundedHeadCSS = () => {
      switch (this.state.direction) {
        case Direction.LEFT:
          return " rounded-l-lg";
        case Direction.RIGHT:
          return " rounded-r-lg";
        case Direction.UP:
          return " rounded-t-lg";
        case Direction.DOWN:
          return " rounded-b-lg";
      }
    };
    return (
      <div className="py-5">
        <div className="mx-auto mb-5 w-[40vh] md:w-[80vh] flex justify-between flex-wrap">
          <button
            className={`${!this.state.gameStarted ? "bg-green-400" : "bg-red-400"} p-3 rounded`}
            onClick={() => {
              if (this.state.gameStarted) {
                this.initGame();
              }
              this.setState({ gameStarted: this.state.gameStarted ? false : true });
            }}
          >
            {!this.state.gameStarted ? "Start Game" : "Quit Game"}
          </button>
        </div>
        <div
          className="mx-auto w-[40vh] md:w-[80vh]
          border border-black flex flex-col 
          bg-[url('../public/Green-grass-background.jpg')]"
        >
          {/* {bg-[url('..${process.env.PUBLIC_URL + "/Green-grass-background.jpg"}')]} */}
          {this.state.grid.map((row, rIndex) => (
            <div className="flex grow" key={rIndex}>
              {row.map((isFilled, cIndex) => (
                <div
                  key={cIndex}
                  className={`grow ${
                    isFilled
                      ? rIndex === head.y && cIndex === head.x
                        ? "bg-red-500" + roundedHeadCSS()
                        : "bg-blue-400"
                      : ""
                  }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={
                      rIndex === this.state.ant.y && cIndex === this.state.ant.x ? "text-white" : "text-transparent"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                    />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-5 w-[40vh] md:w-[80vh] flex justify-between flex-wrap">
          {this.state.gameStarted && (
            <div className="flex justify-around grow">
              <button
                className="bg-white p-3 rounded"
                onClick={() => {
                  if (this.state.direction !== Direction.RIGHT) {
                    this.setState({ direction: Direction.LEFT }, () => this.move());
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <button
                className="bg-white p-3 rounded"
                onClick={() => {
                  if (this.state.direction !== Direction.LEFT) {
                    this.setState({ direction: Direction.RIGHT }, () => this.move());
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="bg-white p-3 rounded"
                onClick={() => {
                  if (this.state.direction !== Direction.DOWN) {
                    this.setState({ direction: Direction.UP }, () => this.move());
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
              <button
                className="bg-white p-3 rounded"
                onClick={() => {
                  if (this.state.direction !== Direction.UP) {
                    this.setState({ direction: Direction.DOWN }, () => this.move());
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
