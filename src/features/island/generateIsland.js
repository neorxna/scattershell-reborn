import { CellTypes } from './properties'
import * as Poisson from 'poisson-disk-sampling'
import {
  ResourceTypes,
  FoodPerResources,
  WoodPerResources
} from '../../app/Resources'

const GridPositions = (grid, size) => {
  const u = pos => pos - size
  const d = pos => pos + size
  const l = pos => (pos % size === 0 ? undefined : pos - 1)
  const r = pos => (pos % size === size - 1 ? undefined : pos + 1)

  const up = pos => grid[u(pos)]
  const down = pos => grid[d(pos)]
  const left = pos => grid[l(pos)]
  const right = pos => grid[r(pos)]

  const upright = pos => grid[u(r(pos))]
  const downleft = pos => grid[d(l(pos))]
  const upleft = pos => grid[u(l(pos))]
  const downright = pos => grid[d(r(pos))]

  return { up, down, left, right, upright, downleft, upleft, downright }
}

const randomChoice = arr => {
  let index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const materialResources = Object.values(ResourceTypes).filter(x => {
  return WoodPerResources[x] > 0
})
const foodResources = Object.values(ResourceTypes).filter(
  x => FoodPerResources[x] > 0
)
const allResources = Object.values(ResourceTypes)

const buildCell = (cellType, neighbourCells) => {
  let contains = []
  if (cellType === CellTypes.Materials) {
    contains = [
      randomChoice(materialResources),
      randomChoice(materialResources)
    ]
  } else if (cellType === CellTypes.Food) {
    contains = [randomChoice(foodResources), randomChoice(foodResources)]
  } else if (cellType === CellTypes.Desert) {
    contains = [
      randomChoice([
        ResourceTypes.Succulents,
        ResourceTypes.BushFood,
        null,
        null,
        null
      ])
    ].filter(x => x !== null)
  } else if (cellType === CellTypes.Lagoon) {
    contains = [
      randomChoice([ResourceTypes.FreshWater, null]),
      randomChoice([ResourceTypes.Fish, null])
    ].filter(x => x !== null)
  } else if (cellType === CellTypes.Mountain) {
    contains = [
      randomChoice([
        ResourceTypes.FreshWater,
        ResourceTypes.Birds,
        ResourceTypes.Bamboo,
        null
      ])
    ].filter(x => x !== null)
  } else {
    contains = [randomChoice(allResources)]
  }
  return { cellType, contains }
}

export const generateIsland = size => {
  const baseCell = {
    cellType: CellTypes.Undecided
  }

  const getPos = (x, y) => y * size + x

  let grid = Array(size * size)
    .fill({ ...baseCell })
    .map((cell, pos) => ({ ...cell, pos }))

  const {
    up,
    down,
    left,
    right,
    upleft,
    upright,
    downleft,
    downright
  } = GridPositions(grid, size)

  // add size/3 settlements

  for (let i = 0; i < size / 4; i++) {
    let x = rand(0, size - 1)
    let y = rand(0, size - 1)
    let cell = grid[getPos(x, y)]
    grid[getPos(x, y)] = { ...cell, cellType: CellTypes.Settlement }
  }

  // add at least 1 food next to a settlement.
  // find a settlement, pick a random direction that leads to another cell, place food.
  const sPos = randomChoice(
    grid.filter(cell => cell.cellType === CellTypes.Settlement)
  ).pos
  const essentialFoodCandidates = [
    up(sPos),
    down(sPos),
    left(sPos),
    right(sPos)
  ].filter(x => x != undefined && x.cellType === CellTypes.Undecided)
  const essentialFood = randomChoice(essentialFoodCandidates)

  grid[essentialFood.pos] = {
    ...essentialFood,
    ...buildCell(CellTypes.Food)
  }

  const randomWalkUpdate = propertiesFn => {
    let walk = [grid[sPos]]

    let end = null
    while (walk.length < size) {
      let head = walk[walk.length - 1]
      let candidates = [up, down, left, right]
        .map(fn => fn(head.pos))
        .filter(
          x =>
            x &&
            (walk.length > 3
              ? x.cellType === CellTypes.Undecided
              : x.cellType !== CellTypes.Settlement &&
                x.cellType !== CellTypes.Food) &&
            walk.filter(w => w.pos === x.pos).length === 0
        )
      let pick = randomChoice(candidates)
      if (pick) walk.push(pick)
      else {
        break
      }
    }
    end = walk.pop()
    grid[end.pos] = {
      ...end,
      ...propertiesFn([up, down, left, right].map(fn => fn(end.pos)))
    }
    return [...walk, end]
  }

  randomWalkUpdate(neighbours => buildCell(CellTypes.Materials, neighbours))

  if (size > 5) {
    randomWalkUpdate(neighbours => buildCell(CellTypes.Mountain, neighbours))
  }

  const desertRate = 1.5
  const pDesert = new Poisson([size, size], size / desertRate)

  pDesert
    .fill()
    .map(point => getPos(Math.round(point[0]), Math.round(point[1])))
    .forEach(pos => {
      if (grid[pos] && grid[pos].cellType === CellTypes.Undecided) {
        // clump the desert cells together on von neumann neighbourhood
        // alternate direction of pill shapes
        let neighbours = [
          up,
          down,
          left,
          right,
          ...randomChoice([
            [upright, downleft],
            [downright, upleft]
          ])
        ].map(fn => fn(pos))

        let desertCount = 0
        for (let neighbour of neighbours) {
          if (neighbour && neighbour.cellType === CellTypes.Undecided) {
            grid[neighbour.pos] = {
              ...grid[neighbour.pos],
              ...buildCell(CellTypes.Desert)
            }
            desertCount += 1
          }
        }
        // oasis :)
        grid[pos] = {
          ...grid[pos],
          ...buildCell(desertCount === 6 ? CellTypes.Lagoon : CellTypes.Desert)
        }
      }
    })

  const pMountains = new Poisson([size, size], size / 4)

  pMountains
    .fill()
    .map(point => getPos(Math.round(point[0]), Math.round(point[1])))
    .forEach(pos => {
      let noOtherMountains =
        [left, right, up, down]
          .map(fn => fn(pos))
          .filter(nn => nn == undefined || nn.cellType === CellTypes.Mountain)
          .length === 0

      if (
        grid[pos] &&
        grid[pos].cellType === CellTypes.Undecided &&
        noOtherMountains
      ) {
        grid[pos] = { ...grid[pos], ...buildCell(CellTypes.Mountain, []) } // todo
        let neighbours = [upright(pos), downleft(pos)]
        for (let neighbour of neighbours) {
          if (neighbour && neighbour.cellType === CellTypes.Undecided) {
            let others = [up, down, left, right].map(fn => fn(neighbour.pos))
            let noOtherMountains =
              others.filter(
                nn => nn == undefined || nn.cellType === CellTypes.Mountain
              ).length === 0
            if (noOtherMountains) {
              grid[neighbour.pos] = {
                ...grid[neighbour.pos],
                ...buildCell(CellTypes.Mountain, [])
              } // todo
            }
          }
        }
      }
    })

  const pGrass = new Poisson([size, size], size / 8)

  pGrass
    .fill()
    .map(point => getPos(Math.round(point[0]), Math.round(point[1])))
    .forEach(pos => {
      if (grid[pos] && grid[pos].cellType === CellTypes.Undecided) {
        grid[pos] = { ...grid[pos], ...buildCell(CellTypes.Grass) }
      }
    })

  grid.forEach(cell => {
    if (cell.cellType === CellTypes.Undecided) {
      grid[cell.pos] = {
        ...cell,
        ...buildCell(
          randomChoice([
            CellTypes.Food,
            CellTypes.Materials,
            CellTypes.Lagoon
            // CellTypes.Undecided
          ])
        )
      }
    }
  })

  return grid
}
