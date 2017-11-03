####annotator.App
the main annotator class

##### annotator.App.include
The only thing it does is add modules to the registry (and their configure(registry) function is called **if exists**)

##### annotator.App.start, annotator.App.destroy
When called, all modules' "start"/"destroy" functions are called.




#Modules:


**ui** - responsuble for all possible visible content, the most important

**ui.adder** - the pen icon that appears after text selection

**ui.editor** - the editor widget (js + html)

**ui.viewer** - the viewer widget (js + html)

**ui.highlighter** - code for adding a <span> in the text to highlight an annotation

**ui.textselector** - text selection hooks

**ui.tags** - unimportant (for tags extension)





#Annotation lifecycle:

When App.start() is called, by default annotations are not loaded 
(storeStorageAdapter.load is not called).

An annotation is created in the "onSelection" event of TextSelector (consisting only of quote and ranges).

When the adder is clicked, its "onCreate" callback is fired, which calls the storage.create
The annotation object consists of

- id
- quote - the whole selected text (extending across many html nodes) 
with some special characters to mark breaks between nodes
- ranges - a list of separate text ranges that make up the whole annotated text;
probably only one range is possible (need to check) and the list always has one element.
- fields - a dictionary, the content of the annotation form



