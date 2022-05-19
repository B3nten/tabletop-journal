import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './Comment.module.css'
import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash.debounce'
import supabase from '../../lib/supabase'

export default function AutoSaveRichText(props) {
  const [updated, setUpdated] = useState(false)
  const [saving, setSaving] = useState('')

  async function updateCharacterBio(json, text, props) {
    setSaving('saving')
    const { error } = await supabase.from(props.from).update({ [props.columns[0]]: json, [props.columns[1]]: text }).eq('id', props.id)
    if (error) {
      setSaving('error')
      console.log(error)
    } else {
      setSaving('saved')
    }
  }

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

  //Handles initial load of content into editor. Sets updated to true.
  useEffect(() => {
    if (editor) {
      editor.commands.clearContent()
      editor.commands.insertContent(props.content)
      setUpdated(true)
    }
  }, [editor])

  //creates editor listner when editor and props exist. Passes values into callback function.
  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        callback(editor, updated, props)
        setSaving('saving')
      })
    }
  }, [editor, updated])

  //callback function with debounce. Receives latest arguments. Runs fetch function only after the content is initially hydrated, saving an update call.
  const callback = useCallback(debounce(async (editor, updated, props) => {
    if (updated) {
      updateCharacterBio(editor.getJSON(), editor.getText(), props)
    }
  }, 2000), [])


  return (
    <>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="space-x-2">
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

      <div>
        <EditorContent editor={editor} />
        <div className="translate-x-2">
          {saving === '' && <div className='text-sm text-blue-500 font-handwriting opacity-0'>loading</div>}
          {saving === 'saving' && <div className='text-sm text-blue-500 font-handwriting animate-pulse'>saving...</div>}
          {saving === 'saved' && <div className='text-sm text-green-500 font-handwriting'>saved</div>}
          {saving === 'error' && <div className='text-sm text-red-500 font-handwriting'>error: not saved</div>}
        </div>
      </div>
    </>
  )
}

