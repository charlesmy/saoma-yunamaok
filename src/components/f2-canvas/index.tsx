/** @format */
import React, {useEffect, useCallback, useRef} from 'react'
import {Canvas, CanvasTouchEventFunction, CanvasTouchEvent} from '@tarojs/components'
import Taro from '@tarojs/taro'
import F2 from '@antv/f2'

interface Props {
    id: string
    onInit: (config: object) => Promise<F2.Chart<F2.DataRecord>>
    style?: string
}

function wrapEvent(e: CanvasTouchEvent) {
    if (!e) return
    if (!e.preventDefault) {
        e.preventDefault = function () {}
    }
    return e
}

const Chart: React.FC<Props> = props => {
    const canvasEl = useRef<HTMLElement | null>(null)

    const touchStart: CanvasTouchEventFunction = e => {
        const event = wrapEvent(e)
        if (canvasEl.current && event) {
            canvasEl.current.dispatchEvent(event as unknown as Event)
        }
    }
    const touchMove: CanvasTouchEventFunction = e => {
        const event = wrapEvent(e)
        if (canvasEl.current && event) {
            canvasEl.current.dispatchEvent(event as unknown as Event)
        }
    }
    const touchEnd: CanvasTouchEventFunction = e => {
        const event = wrapEvent(e)
        if (canvasEl.current && event) {
            canvasEl.current.dispatchEvent(event as unknown as Event)
        }
    }

    const initChat = useCallback(() => {
        Taro.nextTick(() => {
            Taro.createSelectorQuery()
                .select('#' + props.id)
                .fields({
                    node: true,
                    size: true,
                })
                .exec(async res => {
                    let {node, width, height} = res[0]
                    const context = node.getContext('2d')
                    const pixelRatio = Taro.getSystemInfoSync().pixelRatio
                    const config = {context, width, height, pixelRatio}
                    // 高清设置
                    node.width = width * pixelRatio
                    node.height = height * pixelRatio
                    const chart = await props.onInit(config)
                    if (chart) {
                        canvasEl.current = chart.get('el')
                    }
                })
        })
    }, [props])

    useEffect(() => {
        initChat()
    }, [initChat])

    return (
        <Canvas
            type="2d"
            id={props.id}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            style={props.style}
        />
    )
}

export default React.memo(Chart)
