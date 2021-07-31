import styles from './ShellscatterGame.module.css'
import Tree from 'react-svg-tree'

const vertexMap = new Map([
  ['a', ['b', 'c']],
  ['b', ['d', 'e']],
  ['c', []],
  ['d', []],
  ['e', ['f', 'g']],
  ['f', []],
  ['g', []]
])

export function AncestryTree () {
  return (
    <Tree
      width={50}
      height={45}
      vertices={vertexMap}
      rootId={'a'}
      nodeSize={5}
      levelSeparation={5}
      siblingSeparation={5}
      subtreeSeparation={5}
      maxDepth={Infinity}
    >
      {({ x, y, id }) => (
        <g>
          <circle cx={x} cy={y} r={2} className={styles.treeNode} />
          <text
            x={x}
            y={(y || 0) + 0.8}
            style={{ fontSize: 2 }}
            textAnchor='middle'
            fill='#fff'
          >
            {id}
          </text>
        </g>
      )}
    </Tree>
  )
}
