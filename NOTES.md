# Build notes

How I went from an Exercism exercise to a live Game of Life simulation.

## From Exercism to a simulation

I started by writing the logic for Conway's Game of Life as an [Exercism](https://exercism.org) exercise ([my solution](https://github.com/rishabkgautam/legendary-fiesta/tree/main/solutions/python/game-of-life/1)). The exercise takes the current state as a matrix of 0s (dead cells) and 1s (living cells), computes the next state using the rules of the game, and returns the next matrix.

Once that was working, I wanted to turn it into a live cellular automaton simulation, like the animated GIF in the [Wikipedia article on Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). The hard part was already done. All I needed was to put the logic to use and draw each generation.

I had used p5.js before and knew it would be a smooth way to do that. So I translated the Python code to JavaScript and added the points and the grid.

## Things that took time

- **Counting the neighbours.** I worked out a way to use offsets (`-1`, `0`, `1` on each axis) to add up the values of the surrounding cells, skipping the cell itself and anything outside the grid.
- **Choosing the starting density.** Each cell gets a random number in [0, 1), and I had to decide how high the threshold should be for a cell to start alive. I tried a few values until the simulation looked realistic. I settled on a 10% chance of a cell being alive.
- **Understanding `frameRate` inside `draw()`.** I tested how the draw loop behaves using the browser console, then set it to 10 generations per second.
- **Making it work on every screen.** Even with the sizes stored in constants, a fixed board did not render consistently on my phone. I changed everything to depend on the window size instead (see below).
- **The rows and columns mix-up.** I accidentally swapped `matrixColumns` and `matrixRows` in the next-state function. This was the real bug 🐞 of the project. There was no error message, only wrong behaviour: the right side of the grid stayed empty, because only the first 32 columns were ever updated.
- **A name clash with p5.** After the layout change, the grid stopped showing any green cells. The console said `matrix.flat is not a function`. Logging my `createMatrix` function showed why: p5 has its own function with that name, and it replaced mine, so I was getting a p5 matrix object instead of my array of rows. I renamed mine to `createRandomGrid` and everything worked.

## How the grid fills the screen

A floating grid centred on the page caused small inconsistencies, so I let the grid take up the whole screen. That also meant I needed fewer extra layout variables.

A single cell size would not fill the screen exactly, because a chosen value rarely divides both the width and the height evenly, and that leaves gaps at the edges. Here is how I solved it:

1. Pick how many cells should fit along the shorter side of the screen (32 in my case). The target cell size is the shorter side divided by 32, rounded down.
2. Divide the width and the height by that cell size and round both down. This gives the number of columns and rows that fit without overflowing.
3. Use those columns and rows to compute the exact `cellWidth` and `cellHeight` that cover the screen from edge to edge.

The cells end up stretched by less than one cell in total across the screen, which is not visible.

The size of a living cell (the green dot) is 60% of the smaller cell dimension.

## Comments

I tried to add good comments throughout the code so it is easy to follow at first glance. Suggestions are welcome, and feel free to fork the repo.

---

Implemented with 💚 and curiosity by [@rishabkgautam](https://github.com/rishabkgautam)
