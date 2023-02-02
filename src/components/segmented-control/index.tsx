/** @format */

import React, {useState} from 'react'
import {View} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface SegmentedControlProps {
    list: string[]
    // 当前选中的tab索引值，从0计数
    current?: number
    // 背景颜色与选中标签字体的颜色
    color?: string
    // 选中的标签背景色与边框颜色
    selectedColor?: string
    // 字体大小
    fontSize?: string
    onChange?: (index: number) => void
}

const defSelectedColor = 'rgb(30, 130, 210)'
const defColor = '#fff'

function SegmentedControl(props: SegmentedControlProps) {
    const [current, setCurrent] = useState(props.current || 0)

    const onTap = (index: number) => {
        setCurrent(index)
        props?.onChange?.(index)
    }

    const Tabs = props.list.map((item, index) => {
        const isActive = index === current
        const itemStyle = `font-size: ${props.fontSize || '12px'}; background-color: ${
            isActive ? props.selectedColor || defSelectedColor : ''
        }; color: ${isActive ? props.color || defColor : props.selectedColor || defSelectedColor}`
        return (
            <View
                key={item}
                style={itemStyle}
                className={classNames(
                    'segmented-control__item',
                    current === index ? 'segmented-control__item--active' : '',
                )}
                onClick={() => onTap(index)}>
                {item}
            </View>
        )
    })
    const boxStyle = `border-color: ${props.selectedColor || defSelectedColor}; background-color: ${
        props.color || defColor
    }`
    return (
        <View className="segmented-control" style={boxStyle}>
            {Tabs}
        </View>
    )
}

export default React.memo(SegmentedControl)
