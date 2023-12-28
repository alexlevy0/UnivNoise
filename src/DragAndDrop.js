import { useEffect } from 'react'

export const DragAndDrop = ({ setLink }) => {
    const enter = e => {
        console.log('enter')
        e.currentTarget.classList.add('dragging')
        e.dataTransfer.clearData()
        e.dataTransfer.setData('text/uri-list', e.target.id)
        e.dataTransfer.effectAllowed = 'move'
    }
    const over = e => e.preventDefault() || (e.dataTransfer.dropEffect = 'move')
    const drop = e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.effectAllowed = 'copyLink'
        e.currentTarget.classList.remove('dragging')
        const data = e.dataTransfer.getData('text/uri-list')
        if (!data) return
        setLink(data)
    }
    useEffect(() => {
        document.body.addEventListener('dragenter', enter)
        document.body.addEventListener('dragover', over)
        document.body.addEventListener('drop', drop)
        return () => {
            document.body.removeEventListener('dragenter', enter)
            document.body.removeEventListener('dragover', over)
            document.body.removeEventListener('drop', drop)
        }
    })
    return null
}
