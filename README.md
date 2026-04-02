## TODO

- Add other alloys
  - More stainless steels (e.g. 316L, 321, ...)
  - Aluminium alloys
  - Bronze and other copper alloys

- Add composition to tooltip of alloys in all UI elements (opens after delay)
- Add different plot types? Properties on y axis, element on x axis?
  - Click axis labels to change properties. Don't limit the user to sensible values, %Cr vs %Ni should also be possible. Material groups are visible as patches, with the selected materials in this groups represented as dots.
  - This replaces the first two columns, the UI will be split in 'tabs', with the rightmost column static (compare alloys selection), the selection should furthermore be transferred between the visualizations. One version of the UI focusses on alloy composition and allows the user to create custom alloys, while the other 'tab' shows relations between parameters (e.g. PREN vs Cr content). The user should be free to explore though.
  - I'm not trying to recreate the ashby diagrams, but they will have a similar style. This project is more about educational stuff.

- The tooltip in the radar plot should color the alloy label.

- It should be possible to remove the custom composition and other alloys by clicking the legend labels. It should be clear it is toggled off and can be toggled back on by clicking again (standard behaviour?).
- Lines should not be dashed in the radar plot.
- Add dark mode (stretch goal)
