import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './Tiptap.module.css'
import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash.debounce'
import Loader from '../Loader/Loader'

export default function Tiptap(props) {

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    extensions: [
      StarterKit.configure({
        history: false,
        bulletList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        orderedList: false,
        listItem: false,
        strike: false,
        heading: {
          HTMLAttributes: {
            class: styles.heading,
          },
        }
      }),
    ],
    content: <p></p>,
  })

  const [updated, setUpdated] = useState(false)

  const callback = useCallback(debounce(async (editor,updated) => {
    if(updated){
      console.log(editor.getJSON())
      props.callback(editor.getJSON())
    }
  },3000), [])

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        callback(editor, updated)
      })
    }
  }, [editor, callback, updated])

  useEffect(() => {
    if (props.content) {
      editor.commands.clearContent()
      editor.commands.insertContent(props.content)
      setUpdated(true)
    }
  }, [props.content])

  return (
    <>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.button} ${editor.isActive('bold') ? styles.isActive : ''}`}
          >
            <b>b</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.button} ${editor.isActive('italic') ? styles.isActive : ''}`}
          >
            <i>i</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${styles.button} ${editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}`}
          >
            h1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${styles.button} ${editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}`}
          >
            h2
          </button>
        </div>
      </BubbleMenu>}
      <div style={{opacity: props.saving? '1' : '0'}}><Loader/></div>
      <EditorContent editor={editor} />
    </>
  )
}
