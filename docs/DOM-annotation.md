
### Libraries used

- `xpath-range` (see below for details)
- parts of [annotator](https://github.com/openannotation/annotator) project (exploiting xpath-range)
- [rangy](https://github.com/timdown/rangy)

#### why?

`annotator` + `xpath-range` provide a specialised, but a tested and stable annotation solution;

`rangy` is a popular library with a huge API operating on DOM ranges/selections, necessary where xpath-range cannot be used.

#### Notes on xpath-range

We use `xpath-range` in version 0.0.5 since in later versions most of the functionality was removed.

[Here](docs/xpath-range-README-0.0.5.md) is the README provided with that version (hard to find otherwise)
