# Chord Grid Inline SVG Generator

This simple Javascript file seeks DOM elements with class "grid" and converts each to a [Ted Greene style chord grid](https://www.tedgreene.com/teaching/chords.asp) by parsing the inner text and interpreting it as the elements on a guitar fretboard.

For example, this span will appear inline as an open C chord.

    <span class="grid">n:C o:6:3 d:5:3 d:4:2 d:3:0 d:2:1 d:1:0</span>

The text is a series of simple words, each of which add an element to the output. For example, `d:5:3` places a dot marker on the 5th string at the 3rd fret. Here is the full set of elements.

| Tag | Meaning       | Example   | Appearance                        |
|-----|---------------|-----------|-----------------------------------|
| n   | Chord name    | `n:C`     | appears above the grid            |
| d   | Dot           | `d:5:3`   | appears on the grid               |
| o   | Open dot      | `o:5:3`   | appears on the grid               |
| x   | Cross         | `x:5:3`   | appears on the grid               |
| s   | Square        | `s:5:3`   | appears on the grid               |
| t   | Diamond       | `t:5:3`   | appears on the grid               |
| S   | Large square  | `S:5:3`   | overlays onto a dot               |
| T   | Large diamond | `T:5:3`   | overlays onto a dot               |
| _   | Invisible dot | `_:5:3`   | influences the layout             |
| f   | Finger number | `f:5:3`   | appears at the bottom of the grid |
| F   | Fret number   | `F:5`     | appears to the left of the grid   |
| N   | Note text     | `N:Text`  | appears beneath the grid          |

The tag may actually be any HTML that doesn't include whitespace or a colon, and any text NOT listed in this table appears as itself. So for example `1:5:3` appears as the digit 1 on the 5th string at the 3rd fret. If a symbol like `d` is needed, trick the renderer by padding it with a zero-width space: `&#8203;d`

The size of the grid is determined by the string and fret numbers used. The invisible dot may be used to pad for alignment or string count.

All grid elements (not `n` or `N`) take an optional final parameter giving a CSS color. For example, `d:5:3:red` produces a red dot.
