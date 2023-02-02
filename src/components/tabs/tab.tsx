/** @format */
import React, {useState} from 'react'
import {View, Text} from '@tarojs/components'
import classNames from 'classnames'
import './tab.scss'

export interface TabOption {
    name: string
    index: number
    count?: number
    value?: any
}

interface Props {
    tabs: TabOption[]
    onChange?: (item: TabOption) => void
    defaultIndex?: number
    position?: 'fixed' | 'sticky'
}

function Tab(props: Props) {
    const [current, setCurrent] = useState(props.defaultIndex || 0)

    const onTabChange = (item: TabOption) => {
        if (item.index === current) return
        setCurrent(item.index)
        props?.onChange?.(item)
    }

    return (
        <View className={classNames('tabs', props.position === 'fixed' ? 'tabs--fixed' : 'tabs--sticky')}>
            {props.tabs?.map(item => (
                <View className="tabs-item" key={item.index} onClick={() => onTabChange(item)}>
                    <View
                        className={classNames(
                            'tabs-item__text',
                            item.index === current ? 'tabs-item__text--active' : '',
                        )}>
                        {item.name}
                        {item?.count && item.count > 0 ? (
                            <Text className="tabs-item__count">({item.count})</Text>
                        ) : null}
                    </View>
                </View>
            ))}
        </View>
    )
}

export default React.memo(Tab)
