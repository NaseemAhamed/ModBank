import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  template: '<div #editorHost class="code-editor-host" aria-label="TypeScript challenge editor"></div>'
})
export class CodeEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) code = '';
  @Input() readOnly = false;
  @Output() readonly codeChange = new EventEmitter<string>();
  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLElement>;
  private view?: EditorView;
  private readonly readOnlyCompartment = new Compartment();

  ngAfterViewInit(): void {
    this.view = new EditorView({
      state: EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          javascript({ typescript: true }),
          this.readOnlyCompartment.of(EditorState.readOnly.of(this.readOnly)),
          EditorView.lineWrapping,
          EditorView.theme({
            '&': { color: '#e8f0ff', backgroundColor: 'transparent', fontSize: '13px', height: '100%' },
            '.cm-content': { caretColor: '#93f1c3', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', padding: '20px 12px 20px 4px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' },
            '.cm-gutters': { backgroundColor: '#111f37', color: '#7385a4', border: 'none', paddingLeft: '6px' },
            '.cm-activeLine': { backgroundColor: '#1d30504f' },
            '.cm-activeLineGutter': { backgroundColor: '#1b2e48' },
            '.cm-cursor': { borderLeftColor: '#90f5c1' },
            '.cm-selectionBackground': { backgroundColor: '#355577 !important' },
            '&.cm-focused': { outline: 'none' }
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) this.codeChange.emit(update.state.doc.toString());
          })
        ]
      }),
      parent: this.editorHost.nativeElement
    });
  }

  ngOnChanges(): void {
    if (!this.view) return;
    const current = this.view.state.doc.toString();
    if (current !== this.code) {
      this.view.dispatch({ changes: { from: 0, to: current.length, insert: this.code } });
    }
    this.view.dispatch({ effects: this.readOnlyCompartment.reconfigure(EditorState.readOnly.of(this.readOnly)) });
  }

  ngOnDestroy(): void { this.view?.destroy(); }
}
