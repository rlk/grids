# Chord Grid Inline SVG Generator

This small Javascript file seeks DOM elements with class "grid" and converts each to a [Ted Greene style chord grid](https://www.tedgreene.com/teaching/chords.asp). It parses the inner text of each element and interprets it as elements on a guitar fretboard.

For example, this span will appear inline as an open C chord with an optional G root.

    <span class="grid">n:C o:6:3 +:5:3 +:4:2 +:3:0 +:2:1 +:1:0</span>

## Syntax

The text is a series of words, separated by white space. Each word consists of a tag followed by one or more parameters. So, `+:5:3` places a mark on the 5th string at the 3rd fret. Here is the full set of tags.

| Tag | Meaning        | Example   | Appearance                        |
|-----|----------------|-----------|-----------------------------------|
| `n` | Chord name     | `n:C`     | appears above the grid            |
| `+` | Dot mark       | `+:5:3`   | appears on the grid               |
| `x` | Cross mark     | `x:5:3`   | appears on the grid               |
| `s` | Square mark    | `s:5:3`   | appears on the grid               |
| `d` | Diamond mark   | `d:5:3`   | appears on the grid               |
| `S` | Large square   | `S:5:3`   | overlays onto another mark        |
| `D` | Large diamond  | `D:5:3`   | overlays onto another mark        |
| `o` | Open dot mark  | `o:5:3`   | appears on the grid               |
| `_` | Invisible mark | `_:5:3`   | influences the layout             |
| `f` | Finger number  | `f:5:3`   | appears at the bottom of the grid |
| `F` | Fret number    | `F:5`     | appears to the left of the grid   |
| `N` | Note text      | `N:Text`  | appears beneath the grid          |

The tag may actually be any HTML that doesn't include white space or a colon, and any text NOT listed in this table appears in the output verbatim. So, for example, `1:5:3` appears as the digit 1 on the 5th string at the 3rd fret. (If a symbol like `d` is needed, trick the renderer by padding it with a zero-width space: `&#8203;d`)

The size of the grid is determined by the string and fret numbers used. The invisible mark may be used to pad for alignment or string count.

All elements may by styled using CSS. All grid elements (except `n` or `N`) take an optional final parameter giving a CSS color override. For example, `+:5:3:red` produces a red mark. 

## Tunes

- [Christmas Time is Here](christmas-time-is-here.html)
- [Julia](julia.html)
- [Let's Call the Whole Thing Off](lets-call-the-whole-thing-off.html)
- [Theme from Star Trek](star-trek.html)

## References

- [I-IV-V in Five Forms and Five Keys](I-IV-V-five-forms-five-keys.html)
- [I-IV-V in Five Forms and Five Positions](I-IV-V-five-forms-five-positions.html)
- [I-IV-V in Five Keys and Five Positions](I-IV-V-five-keys-five-positions.html)
- [Diatonic Seventh Arpeggios in C in Five Positions](c-seventh-arpeggios.html)
