/** @format */
import React from 'react'
import ReactDOM from 'react-dom'

interface Confirm<D> {
    code: 0
    data: D
    message?: string
}

interface Error {
    code: -1
    message: string
}

interface Cancel {
    code: -2
    message: string
}

export type Result<D = string> = Confirm<D> | Error | Cancel

export type CloseFunc<D = string> = (data?: Result<D>) => void

export interface RunComponentOptions {
    id?: string
}

export function runComponent<D = {}, P = {}>(Ele: React.ComponentType<P>, props: P, options: RunComponentOptions = {}) {
    const id = options.id || Math.random().toString(36).slice(-8)
    return new Promise<Result<D>>(resolve => {
        const div = document.createElement('view')
        div.id = id
        const rootList = document.getElementsByTagName('root')
        const container = rootList[rootList.length - 1]
        const onClose = (data: Result<D> = {code: -2, message: ''}) => {
            const dialog = document.getElementById(id)
            if (dialog) {
                const unmountResult = ReactDOM.unmountComponentAtNode(dialog)
                if (unmountResult && dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog)
                }
                resolve(data)
            }
        }
        if (container) {
            container.appendChild(div)
            ReactDOM.render(<Ele {...props} _onClose={onClose} />, div)
        }
    })
}
